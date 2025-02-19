import request from '@/utils/request'

// 查询供应商列表
export function listSupplier(query) {
    return request({
        url: '/purchase/supplier/list',
        method: 'get',
        params: query
    })
}

// 查询供应商详细
export function getSupplier(id) {
    return request({
        url: '/purchase/supplier/' + id,
        method: 'get'
    })
}

// 新增供应商
export function addSupplier(data) {
    return request({
        url: '/purchase/supplier',
        method: 'post',
        data: data
    })
}

// 修改供应商
export function updateSupplier(data) {
    return request({
        url: '/purchase/supplier',
        method: 'put',
        data: data
    })
}

// 删除供应商
export function delSupplier(id) {
    return request({
        url: '/purchase/supplier/' + id,
        method: 'delete'
    })
}

// 导出供应商
export function exportSupplier(query) {
    return request({
        url: '/purchase/supplier/export',
        method: 'get',
        params: query
    })
}

// 待审核
export function listAuditSupplier(query) {
    return request({
        url: '/purchase/supplier/audit/list',
        method: 'get',
        params: query
    })
}

// 审核
export function auditSupplier(data) {
    return request({
        url: '/purchase/supplier/audit',
        method: 'put',
        data: data
    })
}