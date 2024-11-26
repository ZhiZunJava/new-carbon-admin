import request from '@/utils/request'

export function addProjectInfo(data) {
    return request({
        url: '/baseInfo/projectInfo',
        method: 'post',
        data: data
    })
}

export function putProjectInfo(data) {
    return request({
        url: '/baseInfo/projectInfo',
        method: 'put',
        data: data
    })
}

export function exportProjectInfo(query) {
    return request({
        url: '/baseInfo/projectInfo/export',
        method: 'get',
        params: query
    })
}

export function listProjectInfo(query) {
    return request({
        url: '/baseInfo/projectInfo/list',
        method: 'get',
        params: query
    })
}

export function deleteProjectInfo(ids) {
    return request({
        url: '/baseInfo/projectInfo/' + ids,
        method: 'delete',
    })
}

export function getProjectInfo(id) {
    return request({
        url: '/baseInfo/projectInfo/' + id,
        method: 'get'
    })
}