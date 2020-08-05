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

// 获取商品分类列表
export const getCateListApi = payload => service.get('categories', { params: payload })

// 获取商品分类
export const getCategory = payload => service.get(`categories/${payload.cat_id}`)

// 添加商品分类
export const addCategoryApi = payload => service.post('categories', payload)

// 编辑商品分类
export const editCategoryApi = payload => service.put(`categories/${payload.cat_id}`, payload)

// 删除商品分类
export const deleteCategoryApi = payload => service.delete(`categories/${payload.cat_id}`)

// 获取分类参数列表
export const getParamListApi = payload => service.get(`categories/${payload.cat_id}/attributes`, { params: { sel: payload.sel } })

// 获取分类参数
export const getParamApi = payload => service.get(`categories/${payload.cat_id}/attributes/${payload.attr_id}`, { params: { attr_sel: payload.attr_sel } })

// 添加分类参数
export const addParamApi = payload => service.post(`categories/${payload.cat_id}/attributes`, payload)

// 编辑分类参数
export const editParamApi = payload => service.put(`categories/${payload.cat_id}/attributes/${payload.attr_id}`, payload)

// 删除分类参数
export const deleteParamApi = payload => service.delete(`categories/${payload.cat_id}/attributes/${payload.attr_id}`)

// 获取商品列表
export const getGoodListApi = payload => service.get('goods', { params: payload })

// 获取商品
export const getGoodApi = payload => service.get(`goods/${payload.goods_id}`)

// 添加商品
export const addGoodApi = payload => service.post('goods', payload)

// 编辑商品
export const editGoodApi = payload => service.put(`goods/${payload.goods_id}`, payload)

// 删除商品
export const deleteGoodApi = payload => service.delete(`goods/${payload.goods_id}`)

// 获取订单列表
export const getOrderListApi = payload => service.get('orders', { params: payload })

// 获取物流信息
export const getLogisticsApi = () => service.get(`kuaidi/1106975712662`)