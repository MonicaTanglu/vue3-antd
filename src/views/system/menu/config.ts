const menuObj = { 0: "菜单", 1: "菜单", 2: "按钮/权限" }
export const columns = [
    {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '菜单类型',
        dataIndex: 'menuType',
        key: 'menuType',
        customRender: ({text}) => {
            return menuObj[text] || text
        }
    }, {
        title: 'icon',
        dataIndex: 'icon',
        key: 'icon'
    },
    {
        title: '组件',
        dataIndex: 'component',
        key: 'component',
    },
    {
        title: '路径',
        dataIndex: 'url',
        key: 'url',
    },
    {
        title: '排序',
        dataIndex: 'sortNo',
        key: 'sortNo'
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 150
    }
]