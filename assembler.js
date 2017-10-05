
var instruction_lut = [
  'NOP',
  'WRITE_MEM',
  'WRITE_PORT',
  'JMP_OFFSET',
  'JMP_DIRECT',
  'WRITE_MEM_TO_PORT',
  'WRITE_PORT_TO_MEM',
  'SHIFT_LEFT_MEM',
  'SHIFT_RIGHT_MEM',
  'INC_MEM',
  'DEC_MEM',
  'BEQ',
  'BNEQ',
  'BGT',
  'BLT'
]

var instructions = [
  { fn: NOP, args: 0 },
  { fn: WRITE_MEM, args: 2 },
  { fn: WRITE_PORT, args: 2 },
  { fn: JMP_OFFSET, args: 1 },
  { fn: JMP_DIRECT, args: 1 },
  { fn: WRITE_MEM_TO_PORT, args: 2 },
  { fn: WRITE_PORT_TO_MEM, args: 2 },
  { fn: SHIFT_LEFT_MEM, args: 1 },
  { fn: SHIFT_RIGHT_MEM, args: 1 },
  { fn: INC_MEM, args: 1 },
  { fn: DEC_MEM, args: 1 },
  { fn: BEQ, args: 2 },
  { fn: BNEQ, args: 2 },
  { fn: BGT, args: 2 },
  { fn: BLT, args: 2 }
]

//
var machine_code = [0,0,0,1,1,0,0]
var fns = []
var idx = 0
var instruction = {}
while(idx < machine_code.length){
  instruction = instructions[machine_code[idx]]
  console.log([idx, machine_code.length, instruction_lut[machine_code[idx]],instruction.args].join('\t'))
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
