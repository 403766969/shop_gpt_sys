import service from 'network/servce'

export const loginApi = data => service.post('login', data)

export const getMenuListApi = () => service.get('menus')

export const getUserListApi = data => service.get('users', { params: data })

export const editUserStateApi = data => service.put(`users/${data.id}/state/${data.state}`)

export const addUserApi = data => service.post('users', data)

export const getUserApi = data => service.get(`users/${data.id}`)

export const editUserApi = data => service.put(`users/${data.id}`, { email: data.email, mobile: data.mobile })

export const deleteUserApi = data => service.delete(`users/${data.id}`)