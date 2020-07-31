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

// 编辑用户
export const editUserApi = payload => service.put(`users/${payload.id}`, payload)

// 删除用户
export const deleteUserApi = payload => service.delete(`users/${payload.id}`)

// 编辑用户状态
export const changeUserStateApi = payload => service.put(`users/${payload.id}/state/${payload.state}`)

// 获取权限列表
export const getRightListApi = payload => service.get(`rights/${payload.type}`)

// 获取角色列表
export const getRoleListApi = () => service.get(`roles`)

// 获取角色
export const getRoleApi = payload => service.get(`roles/${payload.id}`)

// 添加角色
export const addRoleApi = payload => service.post('roles', payload)

// 编辑角色
export const editRoleApi = payload => service.put(`roles/${payload.id}`, payload)

// 删除角色
export const deleteRoleApi = payload => service.delete(`roles/${payload.id}`)

// 删除角色指定权限
export const deleteRoleRightApi = payload => service.delete(`roles/${payload.roleId}/rights/${payload.rightId}`)

// 给角色分配权限
export const setRoleRightApi = payload => service.post(`roles/${payload.roleId}/rights`, { rids: payload.idsStr })

// 给用户分配角色
export const setUserRoleApi = payload => service.put(`users/${payload.userId}/role`, { rid: payload.roleId })