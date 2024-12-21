import request from '@/utils/request'

// 查询库位信息列表
export function listWarehouseLocation(query) {
  return request({
    url: '/warehouse/warehouseLocation/list',
    method: 'get',
    params: query
  })
}

// 查询库位信息详细
export function getWarehouseLocation(id) {
  return request({
    url: '/warehouse/warehouseLocation/' + id,
    method: 'get'
  })
}

// 新增库位信息
export function addWarehouseLocation(data) {
  return request({
    url: '/warehouse/warehouseLocation',
    method: 'post',
    data: data
  })
}

// 修改库位信息
export function updateWarehouseLocation(data) {
  return request({
    url: '/warehouse/warehouseLocation',
    method: 'put',
    data: data
  })
}

// 删除库位信息
export function delWarehouseLocation(id) {
  return request({
    url: '/warehouse/warehouseLocation/' + id,
    method: 'delete'
  })
}

// 导出库位信息
export function exportWarehouseLocation(query) {
  return request({
    url: '/warehouse/warehouseLocation/export',
    method: 'get',
    params: query
  })
}