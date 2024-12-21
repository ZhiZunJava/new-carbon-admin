import request from '@/utils/request'

// 查询盘点单列表
export function listWarehouseCheck(query) {
  return request({
    url: '/warehouse/warehouseCheck/list',
    method: 'get',
    params: query
  })
}

// 查询盘点单详细
export function getWarehouseCheck(id) {
  return request({
    url: '/warehouse/warehouseCheck/' + id,
    method: 'get'
  })
}

// 新增盘点单
export function addWarehouseCheck(data) {
  return request({
    url: '/warehouse/warehouseCheck',
    method: 'post',
    data: data
  })
}

// 修改盘点单
export function updateWarehouseCheck(data) {
  return request({
    url: '/warehouse/warehouseCheck',
    method: 'put',
    data: data
  })
}

// 删除盘点单
export function delWarehouseCheck(id) {
  return request({
    url: '/warehouse/warehouseCheck/' + id,
    method: 'delete'
  })
}

// 导出盘点单
export function exportWarehouseCheck(query) {
  return request({
    url: '/warehouse/warehouseCheck/export',
    method: 'get',
    params: query
  })
}