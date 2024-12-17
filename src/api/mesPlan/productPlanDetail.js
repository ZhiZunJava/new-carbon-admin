import request from '@/utils/request'

// 查询计划排产列表
export function listProductPlanDetail(query) {
  return request({
    url: '/mesPlan/productPlanDetail/list',
    method: 'get',
    params: query
  })
}

// 查询计划排产详细
export function getProductPlanDetail(id) {
  return request({
    url: '/mesPlan/productPlanDetail/' + id,
    method: 'get'
  })
}

// 新增计划排产
export function addProductPlanDetail(data) {
  return request({
    url: '/mesPlan/productPlanDetail',
    method: 'post',
    data: data
  })
}

// 修改计划排产
export function updateProductPlanDetail(data) {
  return request({
    url: '/mesPlan/productPlanDetail',
    method: 'put',
    data: data
  })
}

// 删除计划排产
export function delProductPlanDetail(id) {
  return request({
    url: '/mesPlan/productPlanDetail/' + id,
    method: 'delete'
  })
}

// 导出计划排产
export function exportProductPlanDetail(query) {
  return request({
    url: '/mesPlan/productPlanDetail/export',
    method: 'get',
    params: query
  })
}