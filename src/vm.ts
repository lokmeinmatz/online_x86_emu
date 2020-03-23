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
    "r15",
    "rip",
    "rflags"
]

const regAddresses = {}

for (let i = 0; i < regNames.length; i++) {
    regAddresses[regNames[i]] = 128 + (i * 8)
}

export interface IntRegisters {
    rax: bigint,
    rbx: bigint,
    rcx: bigint,
    rdx: bigint,
    rbp: bigint, // base pointer
    rsi: bigint,
    rdi: bigint,
    rsp: bigint,
    r8:  bigint,
    r9:  bigint,
    r10: bigint,
    r11: bigint,
    r12: bigint,
    r13: bigint,
    r14: bigint,
    r15: bigint,
    rip: bigint,
    rflags: bigint
}

export function getVmGeneralInfos(): VmGeneralInfos {
    let u8mem = new Uint8Array(vm.memory.buffer.slice(64, 70))
    

    return {
        is_x64: u8mem[0] == 1
    }
}

export function getIntRegister(regName: string): bigint {
    const addr = regAddresses[regName]
    const val_arr = new BigUint64Array(vm.memory.buffer.slice(addr, addr + 8))
    return val_arr[0]
}

export function setIntRegister(regName: string, newVal: bigint) {
    const addr = regAddresses[regName] / 8
    const arr = new BigUint64Array(vm.memory.buffer)
    arr[addr] = newVal
}

export function getAllIntRegisters(): IntRegisters {
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
    let regs = getAllIntRegisters()
    console.log(infos)
    console.log(regs)

}
