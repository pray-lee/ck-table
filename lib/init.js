const localeText = {
    page: "页",
    more: "更多",
    to: "到",
    of: "共",
    next: "下一页",
    last: "上一页",
    first: "首页",
    previous: "上一页",
    loadingOoo: "加载中...",
    selectAll: "查询全部",
    searchOoo: "查询...",
    blanks: "空白",
    filterOoo: "过滤...",
    applyFilter: "daApplyFilter...",
    equals: "相等",
    notEqual: "不相等",
    lessThan: "小于",
    greaterThan: "大于",
    lessThanOrEqual: "小于等于",
    greaterThanOrEqual: "大于等于",
    inRange: "范围",
    contains: "包含",
    notContains: "不包含",
    startsWith: "开始于",
    endsWith: "结束于",
    group: "组",
    columns: "列",
    filters: "筛选",
    // rowGroupColumns: "laPivot Cols",
    // rowGroupColumnsEmptyMessage: "la drag cols to group",
    // valueColumns: "laValue Cols",
    pivotMode: "条件查询",
    // groups: "laGroups",
    values: "值",
    // pivots: "laPivots",
    // valueColumnsEmptyMessage: "la drag cols to aggregate",
    // pivotColumnsEmptyMessage: "la drag here to pivot",
    // toolPanelButton: "la tool panel",
    noRowsToShow: "数据为空",
    pinColumn: "固定列",
    // valueAggregation: "laValue Agg",
    autosizeThiscolumn: "自适应当前列",
    autosizeAllColumns: "自适应所有列",
    groupBy: "排序",
    ungroupBy: "不排序",
    resetColumns: "重置列",
    expandAll: "展开全部",
    collapseAll: "关闭",
    toolPanel: "工具面板",
    export: "导出",
    csvExport: "导出为CSV格式文件",
    excelExport: "导出到Excel",
    pinLeft: "固定在最左侧",
    pinRight: "固定在最右侧",
    noPin: "不固定",
    sum: "总数",
    min: "最小值",
    max: "最大值",
    none: "无",
    count: "总",
    average: "平均值",
    copy: "复制",
    copyWithHeaders: "携带表头复制",
    ctrlC: "ctrl + C",
    paste: "粘贴",
    ctrlV: "ctrl + V",
    chartRange: '图表展示',
    columnChart: '条形图',
    groupedColumn: '分组',
    stackedColumn: '堆叠',
    normalizedColumn: '100%堆叠',
    barChart: '柱状图',
    groupedBar: '分组',
    stackedBar: '堆叠',
    normalizedBar: '100%堆叠',
    pieChart: '饼状图',
    pie: '饼状',
    doughnut: "同心圆",
    line: '折线图',
    groupedLine: '分组',
    stackedLine: '堆叠',
    normalizedLine: '100%堆叠',
    areaChart: '区域图',
    groupedArea: '分组',
    stackedArea: '堆叠',
    normalizedArea: '100%堆叠',
    xyChart: '坐标图',
    scatter: '分散',
    bubble: '气泡',
    data: '数据筛选',
    settings: '图表类型',
    rangeChartTitle: '图表展示',
    categories: '横坐标',
    series: '纵坐标'
}
// // 样式加载器
function CellRender() {}
CellRender.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    this.eGui.style.paddingLeft = (params.data.subjectLevel * 30) + 'px'
    this.eGui.innerHTML = params.value;
}
CellRender.prototype.getGui = function() {
    return this.eGui
}

const defaultGridOptions = (function (){
    return {
        headerHeight: 32,
        rowHeight: 32,
        localeText: localeText,
        defaultColDef: {
            resizable: true,
        },
        suppressMenuHide: true,
        // 单机不选中单元格
        enableCellTextSelection: true,
        suppressCellSelection: true,
        // row animation
        animateRows: true,
        // rowSelection
        rowSelection: 'multiple',
        // rowMultiSelectWithClick: true,
        suppressContextMenu:true,//设置为true不显示上下文菜单。即不想使用默认的“右键单击”上下文菜单
    }
})();

function createAgGrid(selector, options) {
    if(!selector) {
        throw new Error('请添加要初始化的元素选择器')
    }
    if(!options || !options.columnDefs || !options.rowData ) {
        throw new Error('请添加表头和表数据')
    }
    const eGridDiv = document.querySelector(selector);
    const gridOptions = Object.assign({}, defaultGridOptions, agGridEventListener(), options)
    const myGrid = new agGrid.Grid(eGridDiv, gridOptions);
    // ==========增加一些ck的方法===========
    addCKFunction(myGrid.gridOptions)
    // ==========增加一些ck的方法===========
    return myGrid.gridOptions
}

function addCKFunction(Grid) {
    Grid.ck = Object.create(null)
    Grid.ck.addRow = function(data, index) {
        if(!data) {
            return
        }
        if(Array.isArray(data)) {
            Grid.api.applyTransaction({
                add: data,
                addIndex: index
            })
        }else{
            Grid.api.applyTransaction({
                add: [data],
                addIndex: index
            })
        }
    }
    Grid.ck.delRow = function() {
        const row = Grid.api.getSelectedRows()
        Grid.api.applyTransaction({
            remove: row
        })
    }
    Grid.ck.getAllRows = function() {
        const allRows = []
        Grid.api.forEachNode(function(node) {
            allRows.push(node.data)
        })
        return allRows
    }
}

function agGridEventListener() {
    return {
        onGridReady: function(e) {
            // 加载完成，把缓存里的设置进去
            console.log('girdReady')
            setColumnState(e)
        },
        // 显隐
        onColumnVisible: function(e) {
            saveColumnState(e.columnApi.getColumnState(), e)
        },
        // 拖动列宽
        onColumnResized: function(e) {
            saveColumnState(e.columnApi.getColumnState(), e)
        },
        // 表头固定
        onColumnPinned: function(e) {
            saveColumnState(e.columnApi.getColumnState(), e)
        },
        // 表头拖动
        onColumnMoved: function(e) {
            saveColumnState(e.columnApi.getColumnState(), e)
        }
    }
}

function saveColumnState(columnState) {
    window.localStorage.setItem('colState', JSON.stringify(columnState))
}
function setColumnState(ag) {
    ag.columnApi.applyColumnState({
        state: getColumnState(),
        applyOrder: true
    })
}
function getColumnState() {
    return JSON.parse(window.localStorage.getItem('colState')) || []
}