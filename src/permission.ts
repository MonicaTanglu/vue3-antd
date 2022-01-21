import router from "@/router"
import store from './store'

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('token')
  if(token) {
    if(to.path === '/login') {
      next()
    } else {
      if(store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
          
        })
      }
    }

  } else {
    if(whiteList.indexOf(to.path) !== -1) {
      next()
    }
  }

})