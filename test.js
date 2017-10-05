var device = require('./src/lib/device.js')
var probe = require('./src/lib/probe.js')

var devices = []
var connections = []
var probes = []

devices.push(device({
  name: 'clock',
  type: 'clock',
  n_ports: 1,
  instructions: [WRITE_PORT(0,1),WRITE_PORT(0,0)]
}))
devices.push(device({
  name: 'div2',
  n_ports: 2,
  instructions: [WRITE_PORT(1,1),WRITE_PORT(1,0)]
}))
devices.push(device({
  name: 'div4',
  n_ports: 2,
  instructions: [WRITE_PORT(1,1),NOP,WRITE_PORT(1,0),NOP]
}))
devices.push(device({
  name: 'div4-2',
  n_ports: 2,
  instructions: [WRITE_PORT(1,1),WRITE_PORT(1,0)]
}))
devices.push(device({
  name: 'DBBLER',
  n_ports: 3,
  memory_size: 2,
  instructions: [
    WRITE_MEM(1,1),
    WRITE_MEM_TO_PORT(1,2),
    SHIFT_LEFT_MEM(1),
    WRITE_MEM_TO_PORT(1,2),
    JMP_OFFSET(-2)
  ],
  verbose: true
}))

probes.push(probe({name:'clock',device_index:0,port_index:0}))
probes.push(probe({name:'div2',device_index:1,port_index:1}))
probes.push(probe({name:'div4',device_index:2,port_index:1}))
probes.push(probe({name:'div4-2',device_index:3,port_index:1}))
probes.push(probe({name:'DBBLER',device_index:4,port_index:2}))

// connect the clock to port[0] of all the other devices
devices.forEach(function(device,device_index){
  if(device_index > 0){
    connections.push({ from: [0,0], to: [device_index,0] })
  }
})
connections.push({ from: [1,1], to: [3,0] }) // overwrite the clock signal to the div4-2
connections.push({ from: [1,1], to: [4,1] }) // send div4 port 1 to dbbler port 1

console.log('connections\n', connections)

var cycles = 14

var n = 2 + (cycles*2)
while(n--){
  // console.log('running probes')
  probes.forEach(function(p){ p.probe(devices) })
  // console.log('running ticks')
  devices.forEach(function(d){
    d.tick()
  })
  // copy clock output to delay input
  // console.log('running connections')
  connections.forEach(function(d){
    var value = devices[d.from[0]].get_ports()[d.from[1]]
    var index = d.to[1]
    devices[d.to[0]].set_port(value, index)
  })
}

probes.forEach(function(p){ console.log(p.status()) })

var instruction_lut = [
  'NOP',
  'WRITE_MEM',
  'WRITE_PORT',
  'JMP_OFFSET',
  'JMP_DIRECT',
  'WRITE_MEM_TO_PORT',
  'WRITE_PORT_TO_MEM',
  'SHIFT_LEFT_MEM',
  'SHIFT_RIGHT_MEM',
  'INC_MEM',
  'DEC_MEM',
]

var instructions = [
  { fn: NOP, args: 0 },
  { fn: WRITE_MEM, args: 2 },
  { fn: WRITE_PORT, args: 2 },
  { fn: JMP_OFFSET, args: 1 },
  { fn: JMP_DIRECT, args: 1 },
  { fn: WRITE_MEM_TO_PORT, args: 2 },
  { fn: WRITE_PORT_TO_MEM, args: 2 },
  { fn: SHIFT_LEFT_MEM, args: 1 },
  { fn: SHIFT_RIGHT_MEM, args: 1 },
  { fn: INC_MEM, args: 1 },
  { fn: DEC_MEM, args: 1 },
]

//
var machine_code = [0,0,0,1,1,0,0]
var fns = []
var idx = 0
var instruction = {}
while(idx < machine_code.length){
  instruction = instructions[machine_code[idx]]
  console.log([idx, machine_code.length, instruction_lut[machine_code[idx]],instruction.args].join('\t'))
  if(instruction.args === 0){
    fns.push(instruction.fn())
  } else if (instruction.args === 1) {
    fns.push(instruction.fn(machine_code[idx+1]))
  } else if (instruction.args === 2) {
    fns.push(instruction.fn(machine_code[idx+1], machine_code[idx+2]))
  }
  idx += instruction.args + 1
}
console.log(fns)


//
// TODO need branching
// JMP_IF_EQUAL(_OFFSET/DIRECT)

// NOP
function NOP(){ return function NOP(){} }

// Write direct values
function WRITE_MEM(index,value){ return function WRITE_MEM(ports,memory) { memory[index] = value } }
function WRITE_PORT(index,value){ return function WRITE_PORT(ports,memory) { ports[index] = value } }

// Jumping around
function JMP_OFFSET(offset){ return function JMP_OFFSET(ports,memory) { memory[0] += offset-1 } }
function JMP_DIRECT(address){ return function JMP_DIRECT(ports,memory) { memory[0] = address-1 } }

// memory to port IO
function WRITE_MEM_TO_PORT(mem_index, port_index){ return function WRITE_MEM_TO_PORT(ports,memory) { ports[port_index] = memory[mem_index] } }
function WRITE_PORT_TO_MEM(port_index, mem_index){ return function WRITE_PORT_TO_MEM(ports,memory) { memory[mem_index] = port[port_index] } }

// math operations on memory addresses
function SHIFT_LEFT_MEM(mem_index){ return function SHIFT_LEFT_MEM(ports,memory) { memory[mem_index] = memory[mem_index] << 1 } }
function SHIFT_RIGHT_MEM(mem_index){ return function SHIFT_RIGHT_MEM(ports,memory) { memory[mem_index] = memory[mem_index] >> 1 } }
function INC_MEM(mem_index){ return function INC_MEM(ports, memory) { memory[mem_index] += 1 }  }
function DEC_MEM(mem_index){ return function INC_MEM(ports, memory) { memory[mem_index] -= 1 }  }
