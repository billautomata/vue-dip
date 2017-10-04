module.exports = function(options) {
  var values = []
  var name = options.name
  var device_index = options.device_index
  var port_index = options.port_index
  return {
    probe: function(devices){
      values.push(devices[device_index].get_ports()[port_index])
    },
    clear: function () {
      values = []
    },
    status: function () {
      return [name,JSON.stringify(values)].join('\t')
    }
  }
}
