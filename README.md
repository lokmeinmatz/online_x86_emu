# online_x86_emu
An online x86 emulator for education written in rust + typescript


## VM Memory layout

### General VM Info: bytes 64:64

|    64    | ...
| x64 mode |


### Integer Registers: byte 128:263‬

| 128 | 136 | 144 | 152 | 160 | 168 | 176 | 184 | 192 + (8 * offset)
| rax | rbx | rcx | rdx | rbp | rsi | rdi | rsp | r8-r15 