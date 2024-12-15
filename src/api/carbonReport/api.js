import request from '@/utils/request'
// 综合能耗图表
export function getEmissionChartOverall() {
    return request({
        url: '/carbonReport/emissionChart/overall',
        method: 'get'
    })
}

// 能耗占比
export function getEmissionChartPercent() {
    return request({
        url: '/carbonReport/emissionChart/percent',
        method: 'get'
    })
}

//查询能耗汇总报表
export function getEquipmentList(query) {
    return request({
        url: '/carbonReport/equipmentPowerReport/list',
        method: 'get',
        params: query,
    })
}

// 生产能耗
export function getProductListDay() {
    return request({
        url: '/carbonReport/productPowerReport/day',
        method: 'get'
    })
}

export function getProductListMonth() {
    return request({
        url: '/carbonReport/productPowerReport/month',
        method: 'get'
    })
}

export function getProductListYear() {
    return request({
        url: '/carbonReport/productPowerReport/year',
        method: 'get'
    })
}

export function getProductList(query) {
    return request({
        url: '/carbonReport/productPowerReport/list',
        method: 'get',
        params: query
    })
}