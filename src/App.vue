<template>
  <div id="app">
    <device v-for="(device,index) in devices" v-bind:device="device" v-bind:key="index"></device>
  </div>
</template>

<script>
import Device from './Device.vue'

var device = require('./lib/device.js')
var assembler = require('./lib/assembler.js')
var probe = require('./lib/probe.js')

export default {
  name: 'app',
  components: {
    'device': Device
  },
  data () {
    return {
      devices: [],
      connections: [],
      probes: []
    }
  },
  mounted () {
    this.devices.push(device({
      name: 'clock',
      type: 'clock',
      n_ports: 1,
      instructions: ['WRITE_PORT 0 1', 'WRITE_PORT 0 0'],
      verbose: true
    }))
    this.devices.push(device({
      name: 'div2',
      n_ports: 2,
      instructions: ['WRITE_PORT 1 1', 'NOP', 'WRITE_PORT 1 0', 'NOP']
    }))
    this.devices.push(device({
      name: 'BRNCHR',
      n_ports: 2,
      memory_size: 2,
      instructions: [
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
      ],
    }))
    this.devices.forEach((device,device_index) => {
      if(device_index > 0){
        this.connections.push({ from: [0,0], to: [device_index,0] })
      }
    })

    this.probes.push(probe({name:'clock',device_index:0,port_index:0}))
    this.probes.push(probe({name:'div2',device_index:1,port_index:1}))
    this.probes.push(probe({name:'BRNCHR',device_index:2,port_index:1}))

    var cycles = 18

    var n = 2 + (cycles*2)
    setInterval(() => {
      console.log('tick')
      // copy clock output to delay input
      // console.log('running connections')
      this.connections.forEach((d) => {
        var value = this.devices[d.from[0]].get_ports()[d.from[1]]
        var index = d.to[1]
        this.devices[d.to[0]].set_port(value, index)
      })
      // console.log('running probes')
      this.probes.forEach((p) => { p.probe(this.devices) })
      // console.log('running ticks')
      this.devices.forEach(function(d){
        d.tick()
      })
    },1000)


  },
}
</script>

<style>
</style>
