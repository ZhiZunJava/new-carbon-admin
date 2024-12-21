import request from '@/utils/request'

// 查询移库记录列表
export function listWarehouseMove(query) {
  return request({
    url: '/warehouse/warehouseMove/list',
    method: 'get',
    params: query
  })
}

// 查询移库记录详细
export function getWarehouseMove(id) {
  return request({
    url: '/warehouse/warehouseMove/' + id,
    method: 'get'
  })
}

// 新增移库记录
export function addWarehouseMove(data) {
  return request({
    url: '/warehouse/warehouseMove',
    method: 'post',
    data: data
  })
}

// 修改移库记录
export function updateWarehouseMove(data) {
  return request({
    url: '/warehouse/warehouseMove',
    method: 'put',
    data: data
  })
}

// 删除移库记录
export function delWarehouseMove(id) {
  return request({
    url: '/warehouse/warehouseMove/' + id,
    method: 'delete'
  })
}

// 导出移库记录
export function exportWarehouseMove(query) {
  return request({
    url: '/warehouse/warehouseMove/export',
    method: 'get',
    params: query
  })
}

export function moveWarehouseMove(data) {
    return request({
      url: '/warehouse/warehouseMove/move',
      method: 'post',
      data: data
    })
  }