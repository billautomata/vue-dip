module.exports = function(file_lines){
  var I = require('./instructions.js').fns
  var instruction_lut = require('./instructions.js').lut
  var instructions = require('./instructions.js').array

  // turns file lines into machine code
  // var file_lines = [
  //
  // ]

  var machine_code = []
  var labels = {}
  file_lines.forEach(function(line){
    var tokens = line.split(' ')
    console.log(tokens)
    if(tokens.length === 1){
      if (line.indexOf(':') !== -1) {
        labels[line.split(':')[0]] = machine_code.length
      } else {
        machine_code.push(instruction_lut.indexOf(tokens[0]))
      }
    } else if (tokens.length === 2) {
      // check for JMP to a label
      if(tokens[1].indexOf(':') !== -1){
        machine_code.push(instruction_lut.indexOf(tokens[0]))
        machine_code.push('LABEL_'+tokens[1].split(':')[0])
      } else {
        machine_code.push(instruction_lut.indexOf(tokens[0]))
        machine_code.push(Number(tokens[1]))
      }
    } else if (tokens.length === 3) {
      machine_code.push(instruction_lut.indexOf(tokens[0]))
      machine_code.push(Number(tokens[1]))
      machine_code.push(Number(tokens[2]))
    }
  })
  console.log('machine_code with labels\n', machine_code.join(' '))
  console.log('labels', labels)

  machine_code = machine_code.map(function(o){ if(typeof o === 'string') { return Number(labels[o.split('_')[1]]) } else { return o } })
  console.log('machine_code\n', machine_code.join(' '))

  // fix the labels into machine code addresses

  return machine_code

  var fns = []
  var idx = 0
  var instruction = {}
  while(idx < machine_code.length){
    instruction = instructions[machine_code[idx]]
    console.log([idx, machine_code.length, instruction_lut[machine_code[idx]]].join('\t'))
    if(instruction.args === 0){
      fns.push(instruction.fn())
    } else if (instruction.args === 1) {
      fns.push(instruction.fn(machine_code[idx+1]))
    } else if (instruction.args === 2) {
      fns.push(instruction.fn(machine_code[idx+1], machine_code[idx+2]))
    }
    idx += instruction.args + 1
  }
  console.log(fns)
  return fns
}
