
import request from '@/utils/request'

// 获取字典类型列表
export function getDictionaryTypePager(params) {
  return request({
    url: '/api/system/dictionaryType/pager',
    method: 'get',
    params
  })
}

// 获取字典类型列表
export function getDictionaryType(params) {
  return request({
    url: '/api/system/dictionaryType',
    method: 'get',
    params
  })
}


// 创建字典类型
export function createDictionaryType(data) {
  return request({
    url: '/api/system/dictionaryType',
    method: 'post',
    data
  })
}

// 更新字典类型
export function updateDictionaryType(Id, data) {
  return request({
    url: '/api/system/dictionaryType/' + Id,
    method: 'put',
    data
  })
}

// 删除字典类型
export function deleteDictionaryType(data) {
  return request({
    url: '/api/system/dictionaryType',
    method: 'delete',
    data
  })
}

