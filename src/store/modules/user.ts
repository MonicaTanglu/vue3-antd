// import { UserInfo } from '@/api/user'
import { getAction, postAction } from '@/api/api'

interface LoginRes {
    token: string,
    userInfo: object
}
interface PermissionRes {
    menu: Array<object>,
    auth: Array<object>,
    allAuth: Array<object>
}
const user = {
    namespaced: true,
    state: {
        token: localStorage.getItem('token'),
        avatar: '',
        username: '',
        roles: [],
        menus: [],
        userInfo: null,
        permissionList: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_USERNAME: (state, username) => {
            state.username = username
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
        },
        SET_PERMISSIONLIST: (state, menuData) => {
            state.permissionList = menuData
        }
    },

    actions: {
        /* login */
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                postAction<LoginRes>('/sys/login', userInfo).then((res) => {
                    if (res.success) {
                        const result = res.result
                        localStorage.setItem('token', result.token)
                        localStorage.setItem('userInfo', JSON.stringify(result.userInfo))
                        commit('SET_USERINFO', result.userInfo)
                        commit('SET_TOKEN', result.token)
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetPermissionList({ commit }) {
            return new Promise((resolve, reject) => {
                getAction<PermissionRes>('/sys/permission/getUserPermissionByToken').then(res => {
                    const result = res.result
                    const menuData = result.menu
                    const authData = result.auth
                    const allAuthData = result.allAuth
                    sessionStorage.setItem('user_auth', JSON.stringify(authData))
                    sessionStorage.setItem('sys_btn_auth', JSON.stringify(allAuthData))
                    if (menuData && menuData.length > 0) {
                        commit('SET_PERMISSIONLIST', menuData)
                    } else {
                        reject('菜单为空，是否配置权限？')
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        /* 用户登出 */
        Logout({ commit }) {
            commit('SET_TOKEN', '')
            commit('SET_PERMISSIONLIST', [])

            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')

        }

    },


}

export default user