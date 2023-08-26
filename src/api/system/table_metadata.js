
import request from '@/utils/request'

// 获取table_metadata列表
export function getTableMetadata(params) {
  return request({
    url: '/api/tableMetadata',
    method: 'get',
    params
  })
}

// 创建table_metadata
export function createTableMetadata(data) {
  return request({
    url: '/api/tableMetadata',
    method: 'post',
    data
  })
}

// 更新table_metadata
export function updateTableMetadata(Id, data) {
  return request({
    url: '/api/tableMetadata/' + Id,
    method: 'put',
    data
  })
}

// 删除table_metadata
export function deleteTableMetadata(data) {
  return request({
    url: '/api/tableMetadata',
    method: 'delete',
    data
  })
}

