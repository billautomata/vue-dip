var assembler = require('./assembler')
var I = require('./instructions.js')

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

  var source_code = options.instructions
  var instructions = assembler(options.instructions)
  console.log(name, 'instructions', instructions)

  function tick(){
    // if(verbose) { console.log(name, 'tick', ports[0], memory[0]) }
    if(ports[0] === 1 && CLOCK_PREV === 0 || type === 'clock'){

      // perform instruction
      var instruction_value = instructions[memory[0]]
      // console.log('\ninstruction value', instruction_value, 'memory value', memory[0])
      var fn = I.fns[I.lut[instruction_value]]
      var args = I.array[instruction_value].args
      if(args === 0){
        // console.log(fn, I.array[instruction_value].fn)
        fn()(ports,memory)
      } else if (args === 1) {
        // console.log(fn, I.array[instruction_value].fn, instructions[memory[0]+1])
        fn(instructions[memory[0]+1])(ports,memory)
      } else if (args === 2) {
        // console.log(fn, I.array[instruction_value].fn, instructions[memory[0]+1], instructions[memory[0]+2])
        fn(instructions[memory[0]+1], instructions[memory[0]+2])(ports,memory)
      }
      memory[0] += args + 1
      // increment instruction counter by the length of the

      // reset the counter if the counter is > than the instructions length
      if(memory[0] >= options.instructions.length){
        // if(verbose) { console.log('looping back') }
        memory[0] = 0
      }
    }
    CLOCK_PREV = ports[0]
  }

  function state(){
    // console.log([name, 'signal', ports[0], 'prev', CLOCK_PREV, memory[0], JSON.stringify(ports)].join('\t'))
    return [name, JSON.stringify(ports), JSON.stringify(memory)].join('\t')
  }

  return {
    set_port: set_port,
    get_ports: function() { return ports },
    get_memory: function() { return memory },
    get_source: function() { return source_code },
    tick: tick,
    state: state
  }
}
