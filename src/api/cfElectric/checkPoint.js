
import request from '@/utils/request'

export function listCheckPoint(query) {
    return request({
        url: '/cfElectric/checkpoint/list',
        method: 'get',
        params: query
    })
}

export function addCheckPoint(data) {
    return request({
        url: '/cfElectric/checkpoint',
        method: 'post',
        data: data
    })
}

export function putCheckPoint(data) {
    return request({
        url: '/cfElectric/checkpoint',
        method: 'put',
        data: data
    })
}

export function exportCheckPoint(query) {
    return request({
        url: '/cfElectric/checkpoint/export',
        method: 'get',
        params: query
    })
}

export function deleteCheckPoint(ids) {
    return request({
        url: '/cfElectric/checkpoint/' + ids,
        method: 'delete'
    })
}

export function getCheckPoint(id) {
    return request({
        url: '/cfElectric/checkpoint/' + id,
        method: 'get'
    })
}