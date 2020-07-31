import service from 'network/service'

// 登录
export const loginApi = payload => service.post('login', payload)

// 获取菜单列表
export const getMenuListApi = () => service.get('menus')

// 获取用户列表
export const getUserListApi = data => service.get('users', { params: data })

// 获取用户
export const getUserApi = data => service.get(`users/${data.id}`)

// 添加用户
export const addUserApi = data => service.post('users', data)

// 修改用户
export const editUserApi = data => service.put(`users/${data.id}`, { email: data.email, mobile: data.mobile })

// 删除用户
export const deleteUserApi = data => service.delete(`users/${data.id}`)

// 修改用户状态
export const changeUserStateApi = data => service.put(`users/${data.id}/state/${data.state}`)