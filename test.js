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
  ]
}))
devices.push(device({
  name: 'BRNCHR',
  n_ports: 2,
  memory_size: 2,
  instructions: [
    WRITE_MEM(1,0),
    INC_MEM(1),
    BEQ(1,10),
    JMP_DIRECT(1),
    WRITE_MEM_TO_PORT(1,1),
    NOP(),
    JMP_OFFSET(-1)
  ],
  verbose: true
}))

// probes.push(probe({name:'clock',device_index:0,port_index:0}))
// probes.push(probe({name:'div2',device_index:1,port_index:1}))
// probes.push(probe({name:'div4',device_index:2,port_index:1}))
// probes.push(probe({name:'div4-2',device_index:3,port_index:1}))
// probes.push(probe({name:'DBBLER',device_index:4,port_index:2}))
probes.push(probe({name:'BRNCHR',device_index:5,port_index:1}))

// connect the clock to port[0] of all the other devices
devices.forEach(function(device,device_index){
  if(device_index > 0){
    connections.push({ from: [0,0], to: [device_index,0] })
  }
})
connections.push({ from: [1,1], to: [3,0] }) // overwrite the clock signal to the div4-2
connections.push({ from: [1,1], to: [4,1] }) // send div4 port 1 to dbbler port 1

console.log('connections\n', connections)

var cycles = 64

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

// BEQ_MEM (index, value)
// BNEQ_****
// BGT_
// BLT_

function BEQ (index, value) { return function BEQ(ports,memory) { if(memory[index] === value) { memory[0] += 1 } }}
function BNEQ (index, value) { return function BNEQ(ports,memory) { if(memory[index] !== value) { memory[0] += 1 } }}
function BGT (index, value) { return function BGT(ports,memory) { if(memory[index] > value) { memory[0] += 1 } }}
function BLT (index, value) { return function BLT(ports,memory) { if(memory[index] < value) { memory[0] += 1 } }}

// function BEQ_PORT (index, value) { return function BEQ_PORT(ports,memory) { if(ports[index] === value) { memory[0] += 1 } }}
// function BNEQ_PORT (index, value) { return function BNEQ_PORT(ports,memory) { if(ports[index] !== value) { memory[0] += 1 } }}
// function BGT_PORT (index, value) { return function BGT_PORT(ports,memory) { if(ports[index] > value) { memory[0] += 1 } }}
// function BLT_PORT (index, value) { return function BLT_PORT(ports,memory) { if(ports[index] < value) { memory[0] += 1 } }}

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
