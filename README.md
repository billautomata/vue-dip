# vue-clocks-and-ports

Clock and ports.

A clock that ticks up and down.

A list of devices that do things when input ports change.

```
[ Device ]

     ------
 CLK |    |
     |    | PORT
PORT |    |
     |    |
     ------
```

On tick
* device compares the value of the clock to the previous value, if changed perform an action
  * on fall, on rise

```javascript



```
