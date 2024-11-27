import request from '@/utils/request'

// 待审
export function listInWarahouseApplyAudit(query) {
  return request({
    url: '/wmsApply/inWarahouseApply/audit/list',
    method: 'get',
    params: query
  })
}
// 审核入库申请
export function auditInWarahouseApply(data) {
  return request({
    url: '/wmsApply/inWarahouseApply/audit',
    method: 'put',
    data: data
  })
}
// 查询入库申请列表
export function listInWarahouseApply(query) {
  return request({
    url: '/wmsApply/inWarahouseApply/list',
    method: 'get',
    params: query
  })
}

// 查询入库申请详细
export function getInWarahouseApply(id) {
  return request({
    url: '/wmsApply/inWarahouseApply/' + id,
    method: 'get'
  })
}

// 新增入库申请
export function addInWarahouseApply(data) {
  return request({
    url: '/wmsApply/inWarahouseApply',
    method: 'post',
    data: data
  })
}

// 修改入库申请
export function updateInWarahouseApply(data) {
  return request({
    url: '/wmsApply/inWarahouseApply',
    method: 'put',
    data: data
  })
}

// 删除入库申请
export function delInWarahouseApply(id) {
  return request({
    url: '/wmsApply/inWarahouseApply/' + id,
    method: 'delete'
  })
}

// 导出入库申请
export function exportInWarahouseApply(query) {
  return request({
    url: '/wmsApply/inWarahouseApply/export',
    method: 'get',
    params: query
  })
}

// 查询库区管理列表
export function listWarehouseRegion(query) {
  return request({
    url: '/warehouse/warehouseRegion/list',
    method: 'get',
    params: query
  })
}

// 查询库位管理列表
export function listWarehouseLocation(query) {
  return request({
    url: '/warehouse/warehouseLocation/list',
    method: 'get',
    params: query
  })
}