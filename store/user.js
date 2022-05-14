export default {
	// 为当前模块开启命名空间 
	namespaced: true,
	// 模块的 state 数据  ()=>({})返回的是一个对象
	state: () => ({
		address: JSON.parse(uni.getStorageSync("address") || '{}'),
	}),
	// 模块的 mutations 方法 
	mutations: {
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddress')
		},
		saveAddress(state) {
			uni.setStorageSync("address", JSON.stringify(state.address))
		}
	},
	getters: {
		addressStr(state) {
			if (JSON.stringify(state.address) == '{}') return '';
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	},
}
