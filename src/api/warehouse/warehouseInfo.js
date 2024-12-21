import request from '@/utils/request'

// 查询仓库信息列表
export function listWarehouseInfo(query) {
  return request({
    url: '/warehouse/warehouseInfo/list',
    method: 'get',
    params: query
  })
}

// 查询仓库信息详细
export function getWarehouseInfo(id) {
  return request({
    url: '/warehouse/warehouseInfo/' + id,
    method: 'get'
  })
}

// 新增仓库信息
export function addWarehouseInfo(data) {
  return request({
    url: '/warehouse/warehouseInfo',
    method: 'post',
    data: data
  })
}

// 修改仓库信息
export function updateWarehouseInfo(data) {
  return request({
    url: '/warehouse/warehouseInfo',
    method: 'put',
    data: data
  })
}

// 删除仓库信息
export function delWarehouseInfo(id) {
  return request({
    url: '/warehouse/warehouseInfo/' + id,
    method: 'delete'
  })
}

// 导出仓库信息
export function exportWarehouseInfo(query) {
  return request({
    url: '/warehouse/warehouseInfo/export',
    method: 'get',
    params: query
  })
}