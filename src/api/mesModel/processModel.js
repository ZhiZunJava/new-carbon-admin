import request from '@/utils/request'

export function addProcessModel(data) {
    return request({
        url: '/one/gong',
        method: 'post',
        data: data
    })
}

export function putProcessModel(data) {
    return request({
        url: '/one/gong',
        method: 'put',
        data: data
    })
}

export function exportProcessModel(query) {
    return request({
        url: '/one/gong/export',
        method: 'get',
        params: query
    })
}

export function listProcessModel(query) {
    return request({
        url: '/one/gong/list',
        method: 'get',
        params: query
    })
}

export function deleteProcessModel(ids) {
    return request({
        url: '/one/gong/' + ids,
        method: 'delete',
    })
}

export function getProcessModel(id) {
    return request({
        url: '/one/gong/' + id,
        method: 'get'
    })
}