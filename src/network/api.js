import service from 'network/service'

// 登录
export const loginApi = payload => service.post('login', payload)

// 获取菜单列表
export const getMenuListApi = () => service.get('menus')

// 获取用户列表
export const getUserListApi = payload => service.get('users', { params: payload })

// 获取用户
export const getUserApi = payload => service.get(`users/${payload.id}`)

// 添加用户
export const addUserApi = payload => service.post('users', payload)

// 修改用户
export const editUserApi = payload => service.put(`users/${payload.id}`, { email: payload.email, mobile: payload.mobile })

// 删除用户
export const deleteUserApi = payload => service.delete(`users/${payload.id}`)

// 修改用户状态
export const changeUserStateApi = payload => service.put(`users/${payload.id}/state/${payload.state}`)