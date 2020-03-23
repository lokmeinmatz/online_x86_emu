import * as vm from './src/vm'
import * as regTable from './src/regTable'
import * as popups from './src/popups'

let initialized = false



function init() {
    
    if(initialized) return
    initialized = true

    console.log('loaded')
    vm.init(true)

    popups.init()
    regTable.init()
    regTable.updateTable()
    vm.test()
    regTable.updateTable()


}

window.addEventListener('load', init)


if (document.readyState == 'complete' && !initialized) {
    init()
}