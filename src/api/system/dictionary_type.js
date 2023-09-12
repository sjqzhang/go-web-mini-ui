
import request from '@/utils/request'

// 获取dictionary_type列表
export function getDictionaryTypePager(params) {
  return request({
    url: '/api/system/dictionaryType/pager',
    method: 'get',
    params
  })
}

// 获取dictionary_type列表
export function getDictionaryType(params) {
  return request({
    url: '/api/system/dictionaryType',
    method: 'get',
    params
  })
}


// 创建dictionary_type
export function createDictionaryType(data) {
  return request({
    url: '/api/system/dictionaryType',
    method: 'post',
    data
  })
}

// 更新dictionary_type
export function updateDictionaryType(Id, data) {
  return request({
    url: '/api/system/dictionaryType/' + Id,
    method: 'put',
    data
  })
}

// 删除dictionary_type
export function deleteDictionaryType(data) {
  return request({
    url: '/api/system/dictionaryType',
    method: 'delete',
    data
  })
}

