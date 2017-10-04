module.exports = function device(options){
  // IO
  var verbose = false
  if(options.verbose !== undefined){
    verbose = true
  }
  var CLOCK_PREV = 0
  var type = 'device'
  if(options.type === 'clock'){
    type = 'clock'
  }

  var name = options.name
  var ports = Array(options.n_ports).fill(0)
  var memory = Array(1).fill(0)
  if(options.memory_size !== undefined) {
    memory = Array(options.memory_size).fill(0)
  }

  function set_port(v,i){
    // if(verbose){ console.log(name, 'setting port', i, 'with value', v) }
    ports[i] = v
  }
  function get_ports(){
    return ports
  }

  var instructions = options.instructions

  function tick(){
    if(ports[0] === 1 && CLOCK_PREV === 0 || type === 'clock'){
      if(verbose) { console.log(name, 'running instruction', memory[0], instructions[memory[0]]) }
      // perform instruction
      instructions[memory[0]](ports, memory)

      // increment instruction counter
      memory[0] += 1

      // reset the counter if the counter is > than the instructions length
      if(memory[0] >= options.instructions.length){
        memory[0] = 0
      }
    }
    CLOCK_PREV = ports[0]
  }

  function state(){
    // console.log([name, 'signal', ports[0], 'prev', CLOCK_PREV, memory[0], JSON.stringify(ports)].join('\t'))
    return [name, JSON.stringify(ports)].join('\t')
  }

  return {
    set_port: set_port,
    get_ports: get_ports,
    tick: tick,
    state: state
  }
}
