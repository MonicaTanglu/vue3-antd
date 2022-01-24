import router from "@/router"
import store from './store/index'
import { Util } from '@/utils/util'
// import { useStore } from "vuex"

const whiteList = ['/user/login']
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (to.path === '/user/login') {
      next()
    } else {
      // const store = useStore();
      if (store.getters.permissionList.length === 0) {
        store.dispatch('user/GetPermissionList').then(res => {
          const menuData = res.result.menu
          if (menuData === null || menuData === "" || menuData === undefined) {
            return
          }
          let constRoutes: object[] = []
          const utilClass = new Util()
          constRoutes = utilClass.generateIndexRouter(menuData)
          store.dispatch('permission/UpdateAppRouter', { constRoutes }).then((res) => {
            router.addRoute(store.getters.addRoutes)
            const path: string = from.query.redirect?.toString() || to.path
            const redirect = decodeURIComponent(path)
            if (to.path === redirect) {
              next({ ...to, replace: true })
            } else {
              next({ path: redirect })
            }
          })
        }).catch((err) => {
          console.log(err, 'catchErr')
          store.dispatch('user/Logout')
          next({ path: '/user/login', query: { redirect: to.fullPath } })
          //
        })
      }
    }

  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    }
  }

})