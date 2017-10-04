var device = require('./src/lib/device.js')
var probe = require('./src/lib/probe.js')

var devices = []
var connections = []
var probes = []

devices.push(device({
  name: 'clock',
  type: 'clock',
  n_ports: 1,
  instructions: [FLIP,FLOP]
}))
devices.push(device({
  name: 'div2',
  n_ports: 2,
  instructions: [FLIM,FLOM]
}))
devices.push(device({
  name: 'div4',
  n_ports: 2,
  instructions: [FLIM,NOP,FLOM,NOP]
}))
devices.push(device({
  name: 'div4-2',
  n_ports: 2,
  instructions: [FLIM,FLOM]
}))
devices.push(device({
  name: 'DBBLER',
  n_ports: 3,
  memory_size: 2,
  instructions: [LOAD,BRANCH_IF_NOT_ZERO,JMP_MINUS_1,DOUBLE,WRITE,JMP_MINUS_2],
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
connections.push({ from: [2,1], to: [4,1] }) // send div4 port 1 to dbbler port 1

console.log('connections\n', connections)

var n = 48
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
  // devices.forEach(function(d){ console.log(d.state()) })
}

probes.forEach(function(p){ console.log(p.status()) })

function NOP(ports){}

function FLIP(ports){ ports[0] = 1 }
function FLOP(ports){ ports[0] = 0 }

function FLIM(ports){ ports[1] = 1 }
function FLOM(ports){ ports[1] = 0 }

function BRANCH_IF_NOT_ZERO(ports,memory) { if(ports[1] !== 0){ memory[0] += 2 } }
function JMP_MINUS_1(ports,memory) { memory[0] -= 2 }
function LOAD(ports,memory) { memory[1] = 1 }
function DOUBLE(ports,memory) { memory[1] += memory[1] }
function WRITE(ports,memory) { ports[2] = memory[1] }
function JMP_MINUS_2(ports,memory) { memory[0] -= 3 }
