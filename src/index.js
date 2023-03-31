myGridOptions = createAgGrid('#customer-ck-table', {
    columnDefs: setTableHeader(),
    rowData: [
        {
            a: '1',
            b: '',
            c: '',
        },
        {
            a: '3',
            b: '3',
            c: '',
        },
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true,
    },
    suppressCellSelection: false,
})

const data = [
    {
        id: '1',
        text: '111'
    },
    {
        id: '2',
        text: '222'
    },
    {
        id: '3',
        text: '333'
    },
]

function setTableHeader() {
    return [
        {
            headerName: ' ',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            // suppressMenu: true,
            minWidth: 55,
            maxWidth: 55,
            width: 55,
        },
        {
            headerName: 'input',
            field: 'a',
            width: 190,
            editable: true,
        },
        {
            headerName: 'select',
            field: 'b',
            width: 190,
            editable: true,
            cellEditor: Selecter,
            cellRenderer: SelecterRenderer,
        },
        {
            headerName: 'text',
            field: 'b',
            width: 190,
        }
    ]
}

// Selecter 编辑器
function SelecterRenderer() {
}

SelecterRenderer.prototype.init = function (params) {
    this.span = document.createElement('span')
    params.value && (this.span.innerHTML = data.filter(item => item.id === params.value)[0].text)
}
SelecterRenderer.prototype.getGui = function () {
    return this.span
}

function Selecter() {
}

Selecter.prototype.init = function (params) {
    this.selecter = document.createElement('select')
    this.selecter.params = params
}
Selecter.prototype.getGui = function () {
    return this.selecter
}
Selecter.prototype.afterGuiAttached = function () {
    $(this.selecter).select2({data}).select2('open')
        .val(this.selecter.params.value)
        .trigger('change')
        .on('select2:close', function (e) {
            $(this).select2('destroy')
            this.params.stopEditing()
        })
}

Selecter.prototype.getValue = function () {
    return this.selecter.value
}
