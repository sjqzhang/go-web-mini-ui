
import request from '@/utils/request'

// 获取news列表
export function getNews(params) {
  return request({
    url: '/api/news',
    method: 'get',
    params
  })
}

// 创建news
export function createNews(data) {
  return request({
    url: '/api/news',
    method: 'post',
    data
  })
}

// 更新news
export function updateNews(Id, data) {
  return request({
    url: '/api/news/' + Id,
    method: 'put',
    data
  })
}

// 删除news
export function deleteNews(data) {
  return request({
    url: '/api/news',
    method: 'delete',
    data
  })
}

