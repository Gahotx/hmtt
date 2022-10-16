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

// 获取搜索联想建议
export const getSuggestions = ({ prefix }) => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q: prefix
    }
  })
}

// 获取搜索结果
export const getSearchResult = ({ page = 1, perpage = 10, q }) => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params: {
      page,
      perpage,
      q
    }
  })
}

// 获取文章详情
export const getArticleDetail = ({ aid }) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${aid}`
  })
}

// 关注用户
export const followUser = ({ uid }) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: uid
    }
  })
}

// 取关用户
export const unFollowUser = ({ uid }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${uid}`
  })
}

// 对文章点赞
export const likeArticle = ({ aid }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: aid
    }
  })
}

// 取消对文章点赞
export const nolikeArticle = ({ aid }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${aid}`
  })
}

// 获取文章评论
export const getComments = ({ type = 'a', aid, offset = null, limit = 10 }) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params: {
      type,
      source: aid,
      offset,
      limit
    }
  })
}

// 对评论点赞
export const likeComment = ({ cid }) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: cid
    }
  })
}

// 取消对评论点赞
export const dislikeComment = ({ cid }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${cid}`
  })
}

// 对文章进行评论
export const sendComment = ({ id, content, aid = null }) => {
  const obj = {
    target: id,
    content
  }

  if (aid !== null) {
    obj.art_id = aid
  }

  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: obj
  })
}

// 获取用户个人信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 上传用户头像
export const changeAvatar = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}

// 编辑用户个人资料
export const changeUserProfile = (obj) => {
  const dataObj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }

  for (const k in dataObj) {
    if (obj[k] === undefined) {
      delete dataObj[k]
    } else {
      dataObj[k] = obj[k]
    }
  }

  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data: dataObj
  })
}

// 收藏文章
export const starArticle = ({ aid }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: aid
    }
  })
}

// 取消收藏文章
export const unStarArticle = ({ aid }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${aid}`
  })
}
