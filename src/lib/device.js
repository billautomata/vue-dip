module.exports = function device(options){
  // IO
  var CLOCK_PREV = 0
  var type = 'device'
  if(options.type === 'clock'){
    type = 'clock'
  }

  var name = options.name
  var ports = Array(options.n_ports).fill(0)

  function set_port(v,i){
    ports[i] = v
  }
  function get_ports(){
    return ports
  }

  var instruction_counter = 0
  var instructions = options.instructions

  function tick(){
    if(ports[0] === 1 && CLOCK_PREV === 0 || type === 'clock'){
      // console.log(name, 'running instruction', instruction_counter, instructions[instruction_counter])
      // perform instruction
      instructions[instruction_counter](ports)

      // increment instruction counter
      instruction_counter += 1
      if(instruction_counter >= options.instructions.length){
        instruction_counter = 0
      }
    }
    CLOCK_PREV = ports[0]
  }

  function state(){
    // console.log([name, 'signal', ports[0], 'prev', CLOCK_PREV, instruction_counter, JSON.stringify(ports)].join('\t'))
    return [name, JSON.stringify(ports)].join('\t')
  }

  return {
    set_port: set_port,
    get_ports: get_ports,
    tick: tick,
    state: state
  }
}
