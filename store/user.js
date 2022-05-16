export default {
	// 为当前模块开启命名空间 
	namespaced: true,
	// 模块的 state 数据  ()=>({})返回的是一个对象
	state: () => ({
		address: JSON.parse(uni.getStorageSync("address") || '{}'),
		token: uni.getStorageSync("token") || "",
		userinfo:JSON.parse(uni.getStorageSync("userinfo") || '{}'),
		redirectInfo:null
	}),
	// 模块的 mutations 方法 
	mutations: {
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddress')
		},
		saveAddress(state) {
			uni.setStorageSync("address", JSON.stringify(state.address))
		},
		updateUserinfo(state,userinfo){
			state.userinfo = userinfo
			this.commit('m_user/saveUserinfo')
		},
		saveUserinfo(state){
			uni.setStorageSync("userinfo", JSON.stringify(state.userinfo))
		},
		updateToken(state,token){
			state.token = token
			this.commit('m_user/saveToken')
		},
		saveToken(state){
			uni.setStorageSync("token", state.token)
		},
		updateRedirectInfo(state,info){
			state.redirectInfo = info
		}
	},
	getters: {
		addressStr(state) {
			if (JSON.stringify(state.address) == '{}') return '';
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	},
}
