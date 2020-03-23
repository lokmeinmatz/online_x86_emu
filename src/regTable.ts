import * as vm from './vm'
import * as popups from './popups'

class RegRowEntry {
    regName: string
    row: JQuery
    hexEntry: JQuery
    decEntry: JQuery

    constructor(regName: string, tbody: JQuery) {
        this.regName = regName
        
        this.row = $(`<tr><td>${regName}</td></tr>`)

        this.hexEntry = $(`<td>0x?</td>`)
        this.decEntry = $(`<td>?</td>`)
        this.row.append(this.hexEntry, this.decEntry)

        this.hexEntry.click(() => {
            popups.showRegisterEditor(this.regName, popups.NumberMode.Hex)
        })
        this.decEntry.click(() => {
            popups.showRegisterEditor(this.regName, popups.NumberMode.Dec)
        })

        tbody.append(this.row)
    }

    update(regState: vm.IntRegisters) {
        let myNewState: number = regState[this.regName]
        this.hexEntry.text('0x' + myNewState.toString(16))
        this.decEntry.text(myNewState.toString(10))
    }
}

let regEntries: Map<string, RegRowEntry> = new Map()

export function init() {
    let regList = $('#registers > tbody')
    for (let regName of vm.regNames) {
        let entry = new RegRowEntry(regName, regList)
        regEntries.set(regName, entry)
    }
}

export function updateTable() {
    const regState = vm.getAllIntRegisters()
    for (let reg of regEntries.values()) {
        reg.update(regState)
    }
}