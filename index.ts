import * as vm from './src/vm'
import tsdom from 'tsdom'


let initialized = false



function init() {
    
    if(initialized) return
    initialized = true

    console.log('loaded')
    vm.init(true)

    let regList = tsdom('#registers')
    const regState = vm.getIntRegisterState()
    for (let regName of vm.regNames) {
        regList.append(`<li><p>${regName}</p><p>0x${regState[regName].toString(16)}</p></li>`)
    }

    vm.test()
}

window.addEventListener('load', init)


if (document.readyState == 'complete' && !initialized) {
    init()
}