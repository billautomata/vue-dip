var device = require('./src/lib/device.js')
var probe = require('./src/lib/probe.js')
var I = require('./instructions.js').fns
var assembler = require('./assembler.js')

var devices = []
var connections = []
var probes = []

devices.push(device({
  name: 'clock',
  type: 'clock',
  n_ports: 1,
  instructions: assembler(['WRITE_PORT 0 1', 'WRITE_PORT 0 0']),
  verbose: true
}))
devices.push(device({
  name: 'div2',
  n_ports: 2,
  instructions: assembler(['WRITE_PORT 1 1', 'NOP', 'WRITE_PORT 1 0', 'NOP'])
}))
// devices.push(device({
//   name: 'div4',
//   n_ports: 2,
//   instructions: ['WRITE_PORT 1 1', 'WRITE_PORT 1 0']
// }))
// devices.push(device({
//   name: 'div4-2',
//   n_ports: 2,
//   instructions: ['WRITE_PORT 1 1', 'WRITE_PORT 1 0']
// }))
// devices.push(device({
//   name: 'DBBLER',
//   n_ports: 3,
//   memory_size: 2,
//   instructions: [
//     I.WRITE_MEM(1,1),
//     I.WRITE_MEM_TO_PORT(1,2),
//     I.SHIFT_LEFT_MEM(1),
//     I.WRITE_MEM_TO_PORT(1,2),
//     I.JMP_OFFSET(-2)
//   ]
// }))
devices.push(device({
  name: 'BRNCHR',
  n_ports: 2,
  memory_size: 2,
  instructions: assembler([
    'WRITE_PORT 1 1',
    'WRITE_PORT 1 2',
    'MAIN:',
    'WRITE_MEM 1 244',
    'WRITE_PORT 1 3',
    'BEQ 1 244',
    'NOP',                // not true
    'INC_MEM 1',          // true
    'END:',
    'WRITE_MEM_TO_PORT 1 1',
    'JMP_DIRECT END:'
  ]),
}))

probes.push(probe({name:'clock',device_index:0,port_index:0}))
probes.push(probe({name:'div2',device_index:1,port_index:1}))
// probes.push(probe({name:'div4',device_index:2,port_index:1}))
// probes.push(probe({name:'div4-2',device_index:3,port_index:1}))
// probes.push(probe({name:'DBBLER',device_index:4,port_index:2}))
probes.push(probe({name:'BRNCHR',device_index:2,port_index:1}))

// connect the clock to port[0] of all the other devices
devices.forEach(function(device,device_index){
  if(device_index > 0){
    connections.push({ from: [0,0], to: [device_index,0] })
  }
})
// connections.push({ from: [1,1], to: [3,0] }) // overwrite the clock signal to the div4-2
// connections.push({ from: [1,1], to: [4,1] }) // send div4 port 1 to dbbler port 1

console.log('connections\n', connections)

var cycles = 18

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
