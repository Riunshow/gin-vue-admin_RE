import { getDict } from '@/utils/dictionary.ts'
import { reactive } from 'vue'

export const infoList = (listApi: any) => {
  const tableInfo = reactive({
    page: 1,
    total: 10,
    pageSize: 10,
    tableData: [],
    searchInfo: {}
  })

  const filterDict = (value: string | number, options: { label: string, value: string | number }[]) => {
    const rowLabel = options.filter(item => item.value === value)
    return rowLabel && rowLabel[0] && rowLabel[0].label
  }
  const getDictFun = async (type: string) => {
    const dicts = await getDict(type)
    return dicts
  }

  const handleSizeChange = (val: number) => {
    tableInfo.pageSize = val
    getTableData()
  }

  const handleCurrentChange = (val: number) => {
    tableInfo.page = val
    getTableData()
  }

  const getTableData = async () => {
    const res = await listApi({ page: tableInfo.page, pageSize: tableInfo.pageSize, ...tableInfo.searchInfo })
    if (res.code === 0) {
      tableInfo.tableData = res.data.list
      tableInfo.total = res.data.total
      tableInfo.page = res.data.page
      tableInfo.pageSize = res.data.pageSize
    }
  }
  return {
    tableInfo,
    filterDict,
    getDictFun,
    handleSizeChange,
    handleCurrentChange,
    getTableData
  }
}
