import request from '@/utils/request'

// 用户登录
export const userLogin = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 获取用户频道
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 更新用户频道（重置式）

export const updateUserChannels = ({ channels }) => {
  return request({
    method: 'PUT',
    url: '/v1_0/user/channels',
    data: {
      channels
    }
  })
}

// 删除指定用户频道

export const deleteTheChannel = ({ channelId }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}

// 获取文章列表
export const getArticlesList = ({ channelId, timestamp }) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}

// 对文章不喜欢
export const dislikeArticle = ({ articleId }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 举报文章
export const reportArticle = ({ articleId, type }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/reports',
    data: {
      target: articleId,
      type,
      remark: '附加说明'
    }
  })
}
