import request from '@/utils/request'

// 查询库区信息列表
export function listWarehouseRegion(query) {
  return request({
    url: '/warehouse/warehouseRegion/list',
    method: 'get',
    params: query
  })
}

// 查询库区信息详细
export function getWarehouseRegion(id) {
  return request({
    url: '/warehouse/warehouseRegion/' + id,
    method: 'get'
  })
}

// 新增库区信息
export function addWarehouseRegion(data) {
  return request({
    url: '/warehouse/warehouseRegion',
    method: 'post',
    data: data
  })
}

// 修改库区信息
export function updateWarehouseRegion(data) {
  return request({
    url: '/warehouse/warehouseRegion',
    method: 'put',
    data: data
  })
}

// 删除库区信息
export function delWarehouseRegion(id) {
  return request({
    url: '/warehouse/warehouseRegion/' + id,
    method: 'delete'
  })
}

// 导出库区信息
export function exportWarehouseRegion(query) {
  return request({
    url: '/warehouse/warehouseRegion/export',
    method: 'get',
    params: query
  })
}