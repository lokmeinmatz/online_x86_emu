import * as vm_import from '../emulator/src/lib.rs'

let vm: {
    memory: WebAssembly.Memory, 
    init: (bool) => number
} = vm_import


export interface VmGeneralInfos {
    is_x64: boolean
}

export const regNames = [
    "rax",
    "rbx",
    "rcx",
    "rdx",
    "rbp",
    "rsi",
    "rdi",
    "rsp",
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "r15"
]

export interface IntRegisters {
    rax: number,
    rbx: number,
    rcx: number,
    rdx: number,
    rbp: number, // base pointer
    rsi: number,
    rdi: number,
    rsp: number,
    r8:  number,
    r9:  number,
    r10: number,
    r11: number,
    r12: number,
    r13: number,
    r14: number,
    r15: number
}

export function getVmGeneralInfos(): VmGeneralInfos {
    let u8mem = new Uint8Array(vm.memory.buffer.slice(64, 70))
    

    return {
        is_x64: u8mem[0] == 1
    }
}

export function getIntRegisterState(): IntRegisters {
    let u64mem = new BigUint64Array(vm.memory.buffer.slice(128, 128 + 16 * 8))

    let regs = {}

    for(let i = 0; i < 16; i++) {
        regs[regNames[i]] = u64mem[i]
    }

    return regs as IntRegisters
}

export function init(x64mode: boolean) {

    // reset all memory
    let currentMemory = new Uint8Array(vm.memory.buffer)
    console.log(`Setting ${currentMemory.length} bytes to 0...`)
    console.time('reset')
    for (let i = 0; i < currentMemory.length; i++) {
        currentMemory[i] = 0
    }
    console.timeEnd('reset')

    if (vm.init(x64mode) != 0) {
        console.error('Failed to init vm')
    }
}

export function test() {
    console.log('--- starting test ---')
    let mem = new Uint8Array(vm.memory.buffer.slice(64, 70))
    console.log(mem)


    let infos = getVmGeneralInfos()
    let regs = getIntRegisterState()
    console.log(infos)
    console.log(regs)

}
