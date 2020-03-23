import * as vm from './vm'
import * as regTable from './regTable'

let regEditCard: JQuery
let regEditNumber: NumberInput
let popupBase: JQuery

export function init() {
    popupBase = $('#popups')
    popupBase.click(event => {
        if (event.target == popupBase.get(0)) {
            hideAll()
        }
    })
    hideAll()

    regEditCard = $('#reg-edit')
}

function hideAll() {
    $('#popups > .card').hide()
    popupBase.hide()
}

export enum NumberMode {
    Hex = 16,
    Dec = 10
}

const charToValue: Map<string, number> = new Map()

for (let i = 0; i < 20; i++) {
    const s1: string = i.toString(20).toLowerCase()
    if (s1 != s1.toUpperCase()) {
        charToValue.set(s1, i)
        charToValue.set(s1.toUpperCase(), i)
    }
    else {
        charToValue.set(s1, i)
    }
}

function parseToUnsignedBigInt(source: string, b: number): bigint {
    const base = BigInt(b)
    let res = 0n
    for (let i = 0; i < source.length; i++) {
        const val = charToValue.get(source.charAt(i))
        res = res * base + BigInt(val)
    }
    return res

}

export class NumberInput {
    hex: JQuery
    dec: JQuery
    state: NumberMode
    inputDiv: JQuery
    contentStr: string = '0'

    get contentNum(): bigint {
        return parseToUnsignedBigInt(this.contentStr, this.state)
    }

    constructor(addTo: JQuery, startState: NumberMode, startContent: string) {
        const group = $('<div class="btn-group" id="input-mode" role="group" aria-label="Number entry mode">')
        this.hex = $('<button type="button" id="hex" class="btn btn-secondary">Hex</button>')
        this.dec = $('<button type="button" id="dec" class="btn btn-secondary">Decimal</button>')
        group.append(this.hex, this.dec)
        this.inputDiv = $(`
        <div class="input-group mb-3">
        <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">prefix</span>
        </div>
        <input type="text" class="form-control" placeholder="number" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        `)
        this.contentStr = startContent
        this.state = startState
        this.validateAndUpdateInput(startContent)
        this.setState(startState)

        const input = this.inputDiv.find('input')
        input.on('input', () => this.validateAndUpdateInput())

        addTo.append(group, this.inputDiv)

        this.dec.click(() => { this.setState(NumberMode.Dec) })
        this.hex.click(() => { this.setState(NumberMode.Hex) })
    }

    validateAndUpdateInput(text?: string) {
        console.log('validating input')
        let input = this.inputDiv.find('input')
        if (text == undefined) {
            text = input.val() as string
        }
        let m
        switch (this.state) {
            case NumberMode.Dec:
                m = /^\d+$/g
                break;
            case NumberMode.Hex:
                m = /^[a-fA-F0-9]+$/g
                break;
        }
        if (m.test(text)) {
            this.contentStr = text.trim()
        }
        else {
            console.error('Input invalid')
            input.val(this.contentStr)
        }
    }

    removeFrom(parent: JQuery): boolean {
        let r1 = parent.find('#input-mode')
        let r2 = parent.find('.input-group')
        r1.remove()
        r2.remove()
        return true // TODO return false if not existed
    }

    getState(): NumberMode { return this.state }
    setState(newState: NumberMode) {

        let primary: JQuery, secondary: JQuery
        switch (newState) {
            case NumberMode.Dec:
                primary = this.dec
                secondary = this.hex
                break;
            case NumberMode.Hex:
                primary = this.hex
                secondary = this.dec
                break;
        }

        // convert text to target state format
        let num = this.contentNum
        this.contentStr = num.toString(newState)
        this.inputDiv.find('input').val(this.contentStr)


        this.state = newState
        primary.removeClass('btn-secondary').addClass('btn-primary')
        secondary.addClass('btn-secondary').removeClass('btn-primary')

        this.inputDiv.find('.input-group-text').text(newState == NumberMode.Hex ? '0x' : '')
    }


}

export function showRegisterEditor(regName: string, mode: NumberMode) {
    hideAll() // no other popups shoud show
    popupBase.show()
    regEditCard.show()

    regEditCard.find('.card-title').text(`Edit register ${regName}`)
    let body = regEditCard.find('.card-body')
    if (regEditNumber != null) {
        regEditNumber.removeFrom(body)
        body.find('.btn').remove()
    }
    regEditNumber = new NumberInput(body, mode, vm.getIntRegister(regName).toString(mode))


    let overwriteButton = $('<button class="btn btn-success">Overwrite Register</button>')
    overwriteButton.click(() => {
        const newVal = regEditNumber.contentNum
        vm.setIntRegister(regName, newVal)
        hideAll()
        regTable.updateTable()
    })


    body.append(overwriteButton)
}