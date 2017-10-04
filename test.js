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

probes.push(probe({name:'clock',device_index:0,port_index:0}))
probes.push(probe({name:'div2',device_index:1,port_index:1}))
probes.push(probe({name:'div4',device_index:2,port_index:1}))
probes.push(probe({name:'div4-2',device_index:3,port_index:1}))

// connect the clock to port[0] of all the other devices
devices.forEach(function(device,device_index){
  if(device_index > 0){
    connections.push({ from: [0,0], to: [device_index,0] })
  }
})
connections.push({ from: [1,1], to: [3,0] }) // overwrite the clock signal to the div4-2

console.log('connections\n', connections)

var n = 32
while(n--){
  probes.forEach(function(p){ p.probe(devices) })
  devices.forEach(function(d){
    d.tick()
  })
  // copy clock output to delay input
  connections.forEach(function(d){
    devices[d.to[0]].set_port(devices[d.from[0]].get_ports()[d.from[1]], d.to[1])
  })
  // devices.forEach(function(d){ console.log(d.state()) })
}

probes.forEach(function(p){ console.log(p.status()) })

function NOP(ports){}

function FLIP(ports){ ports[0] = 1 }
function FLOP(ports){ ports[0] = 0 }

function FLIM(ports){ ports[1] = 1 }
function FLOM(ports){ ports[1] = 0 }
