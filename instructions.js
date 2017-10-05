module.exports = {
  fns: {
    BEQ: function BEQ (index, value) { return function BEQ(ports,memory) { if(memory[index] === value) { memory[0] += 1 } }},
    BNEQ: function BNEQ (index, value) { return function BNEQ(ports,memory) { if(memory[index] !== value) { memory[0] += 1 } }},
    BGT: function BGT (index, value) { return function BGT(ports,memory) { if(memory[index] > value) { memory[0] += 1 } }},
    BLT: function BLT (index, value) { return function BLT(ports,memory) { if(memory[index] < value) { memory[0] += 1 } }},
    NOP: function NOP(){ return function NOP(){} },
    WRITE_MEM: function WRITE_MEM(index,value){ return function WRITE_MEM(ports,memory) { memory[index] = value } },
    WRITE_PORT: function WRITE_PORT(index,value){ return function WRITE_PORT(ports,memory) { ports[index] = value } },
    JMP_OFFSET: function JMP_OFFSET(offset){ return function JMP_OFFSET(ports,memory) { memory[0] += offset-1 } },
    JMP_DIRECT: function JMP_DIRECT(address){ return function JMP_DIRECT(ports,memory) { memory[0] = address-2 } },
    WRITE_MEM_TO_PORT: function WRITE_MEM_TO_PORT(mem_index, port_index){ return function WRITE_MEM_TO_PORT(ports,memory) { ports[port_index] = memory[mem_index] } },
    WRITE_PORT_TO_MEM: function WRITE_PORT_TO_MEM(port_index, mem_index){ return function WRITE_PORT_TO_MEM(ports,memory) { memory[mem_index] = port[port_index] } },
    SHIFT_LEFT_MEM: function SHIFT_LEFT_MEM(mem_index){ return function SHIFT_LEFT_MEM(ports,memory) { memory[mem_index] = memory[mem_index] << 1 } },
    SHIFT_RIGHT_MEM: function SHIFT_RIGHT_MEM(mem_index){ return function SHIFT_RIGHT_MEM(ports,memory) { memory[mem_index] = memory[mem_index] >> 1 } },
    INC_MEM: function INC_MEM(mem_index){ return function INC_MEM(ports, memory) { memory[mem_index] += 1 }  },
    DEC_MEM: function DEC_MEM(mem_index){ return function INC_MEM(ports, memory) { memory[mem_index] -= 1 }  }
  },
  lut: [
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
  ],
  array: [
    { fn: 'NOP', args: 0 },
    { fn: 'WRITE_MEM', args: 2 },
    { fn: 'WRITE_PORT', args: 2 },
    { fn: 'JMP_OFFSET', args: 1 },
    { fn: 'JMP_DIRECT', args: 1 },
    { fn: 'WRITE_MEM_TO_PORT', args: 2 },
    { fn: 'WRITE_PORT_TO_MEM', args: 2 },
    { fn: 'SHIFT_LEFT_MEM', args: 1 },
    { fn: 'SHIFT_RIGHT_MEM', args: 1 },
    { fn: 'INC_MEM', args: 1 },
    { fn: 'DEC_MEM', args: 1 },
    { fn: 'BEQ', args: 2 },
    { fn: 'BNEQ', args: 2 },
    { fn: 'BGT', args: 2 },
    { fn: 'BLT', args: 2 }
  ]
}
