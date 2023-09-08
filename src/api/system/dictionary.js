
import request from '@/utils/request'

// 获取字典列表
export function getDictionaryPager(params) {
  return request({
    url: '/api/system/dictionary/pager',
    method: 'get',
    params
  })
}

// 获取字典列表
export function getDictionary(params) {
  return request({
    url: '/api/system/dictionary',
    method: 'get',
    params
  })
}


// 创建字典
export function createDictionary(data) {
  return request({
    url: '/api/system/dictionary',
    method: 'post',
    data
  })
}

// 更新字典
export function updateDictionary(Id, data) {
  return request({
    url: '/api/system/dictionary/' + Id,
    method: 'put',
    data
  })
}

// 删除字典
export function deleteDictionary(data) {
  return request({
    url: '/api/system/dictionary',
    method: 'delete',
    data
  })
}

