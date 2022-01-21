// import { UserInfo } from '@/api/user'
import { getAction, postAction } from '@/api/api'
import router, { asyncRoutes } from '@/router'

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
            console.log('debugger')
            return new Promise((resolve, reject) => {
                postAction<LoginRes>('/sys/login', userInfo).then((res) => {
                    if (res.success) {
                        const result = res.result
                        localStorage.setItem('token', result.token)
                        localStorage.setItem('userInfo', JSON.stringify(result.userInfo))
                        commit('SET_USERINFO', result.userInfo)
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        /* getUserInfo */
        // GetInfo({ commit }, token) {
        //     return new Promise((resolve, reject) => {

        //         UserInfo(token).then(response => {
        //             const { code, data } = response.data

        //             if (code == 200) {
        //                 commit('SET_AVATAR', data.avatar)
        //                 commit('SET_USERNAME', data.username)
        //                 commit('SET_ROLES', data.roles)
        //                 commit('SET_MENUS', data.menus)
        //                 resolve(response.data)
        //             }



        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
        getPermissionList({ commit }) {
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
        LogoutResult({ commit }) {
            commit('SET_TOKEN', '')
            commit('SET_AVATAR', '')
            commit('SET_USERNAME', '')
            commit('SET_ROLES', '')
            commit('SET_MENUS', '')
            // const Routes = router.getRoutes()

            /* 清楚动态路由 */
            asyncRoutes.forEach((item) => {
                router.removeRoute(item.name)
            })

            localStorage.removeItem('token')

        }

    },


}

export default user