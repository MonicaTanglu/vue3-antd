const getters = {
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    permissionList: state => state.user.permissionList,

}

export default getters