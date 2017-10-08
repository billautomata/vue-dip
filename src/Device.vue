<template>
  <div id='device'>
    <div>ports: {{ports}}</div>
    <div>memory: {{memory}}</div>
    <br>
    <div v-for="(line,index) in source" v-bind:line="line" v-bind:index="index">{{line}}</div>
  </div>
</template>
<script>
export default {
  name: 'device',
  props: ['device'],
  data () {
    return {}
  },
  mounted () {
    console.log(this.device)
  },
  computed: {
    ports: function () {
      return this.device.get_ports()
    },
    memory: function () {
      return this.device.get_memory()
    },
    source: function () {
      return this.device.get_source()
    }
  }
}
</script>
<style scoped>
#device {
  padding: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 5px;
}
</style>
