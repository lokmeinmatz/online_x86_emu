use std::mem::size_of;

unsafe fn get_mem_from_idx<T>(idx: usize) -> &'static mut T {
    core::mem::transmute(idx)
}

#[repr(packed)]
struct GeneralInfo {
    is_x64: bool
}

type reg_type = u64;
#[repr(packed)]
struct IntRegisters {
    rax: reg_type,
    rbx: reg_type,
    rcx: reg_type,
    rdx: reg_type,
    rbp: reg_type, // base pointer
    rsi: reg_type,
    rdi: reg_type,
    rsp: reg_type,
    r8:  reg_type,
    r9:  reg_type,
    r10: reg_type,
    r11: reg_type,
    r12: reg_type,
    r13: reg_type,
    r14: reg_type,
    r15: reg_type,
    rip: reg_type,
    rflags: reg_type
}

fn int_registers() -> &'static mut IntRegisters {
    unsafe {
        get_mem_from_idx(128)
    }
}

fn general_info() -> &'static mut GeneralInfo {
    unsafe {
        get_mem_from_idx(64)
    }
}

#[no_mangle]
pub fn init(is_x64: bool) -> usize {
    assert!(size_of::<IntRegisters>() == 8 * 18);
    let mut info = general_info();
    info.is_x64 = is_x64;

    let mut reg = int_registers();

    reg.rdi = 123;
    reg.r15 = 8832;

    0
}
