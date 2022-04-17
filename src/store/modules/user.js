//用户模块

export default {
    namespaced: true,
    state: () => {
        return {
            //用户信息
            profile: {
                id: '',
                account: '',
                avatar: '',
                nickname: '',
                account: '',
                mobile: '',
                token: ''
            },
            redirectUrl: '/'
        }

    },
    mutations: {
        setUser(state, payload) {
            state.profile = payload
        },
        setRedirectUrl(state, url) {
            state.redirectUrl = url
        }
    }
}