* [x] port the device to run on machine code because jumping does not work
  memory[0] refers to an instruction but the instructions aren't mapped 1:1 to the array index value,
  the jump address would have to be translated
