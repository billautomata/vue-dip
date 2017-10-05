# vue-clocks-and-ports

Clock and ports.

A clock that ticks up and down.

A list of devices that do things when input ports change.

```
[ Device ]

     ------
     |    | CLK(PORT0)
     |    |
     |    | PORT1
PORT2|    |
     |MEM0| PORT3
     |MEM1|
     |MEM2| PORT4
     |MEM3|
     ------
```

MEM0 is the instruction counter
PORT0 is the clock signal


```
WRITE_MEM 2 0    ;; write memory address 2 with value 0
MAIN:            ;; main loop label
INC_MEM 2        ;; increment memory address 2
BMEM_EQ 2 10     ;; branch if memory address 2 equals 10
JMP MAIN         ;; jump to label 'MAIN'
WRITE_MEM 2 100  ;; branch target
DEAD:            ;; another label
JMP DEAD         ;; jump to label 'DEAD'
```

0000 - I 2 0
0003 - I 2      ;; MAIN
0005 - I 2 10
0008 - I 0003
0010 - I 2 100
0013 - I 0010   ;; DEAD
