// 服务管理api
import request from '@/utils/request'

// 查询服务列表
export function listInfo(data) {
  return request({
    url: '/system/service/list',
    method: 'post',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize
    },
    data: data
  })
}
// 修改状态
export function stateUp(data, params) {
  return request({
    url: '/system/service/stateUp',
    method: 'post',
    data: data,
    params: {
      remark: params
    },
  })
}
// 新增服务
export function addInfo(data) {
  return request({
    url: '/system/service/insert',
    method: 'post',
    data: data
  })
}

// 修改服务
export function updateInfo(data) {
  return request({
    url: '/system/service/upDateEntity',
    method: 'post',
    data: data
  })
}

// 获取服务信息
export function getEntity(data) {
  return request({
    url: '/system/service/getEntity',
    method: 'post',
    data: data
  })
}

// 删除服务
export function delInfo(serverId, data) {
  return request({
    url: `/system/service/${serverId}`,
    method: 'delete',
    params: data
  })
}

// 查询渠道应用列表
export function getWebNameList() {
  return request({
    url: '/system/appinfo/getNameList',
    method: 'get',
  })
}

//服务管理日志查看api
export function getLogList(params) {
  return request({
    url: '/system/logs/getLogList',
    method: 'post',
    params
  })
}
