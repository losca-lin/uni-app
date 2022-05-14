export default {
	// 为当前模块开启命名空间 
	namespaced: true,
	// 模块的 state 数据  ()=>({})返回的是一个对象
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象 
		// 每个商品的信息对象，都包含如下 6 个属性： // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state } 
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	// 模块的 mutations 方法 
	mutations: {
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id == goods.goods_id)
			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++;
			}
			// 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法 
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车中的数据持久化存储到本地 
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		updateGoodsState(state,goods){
			const findResult = state.cart.find(x => x.goods_id == goods.goods_id)
			if(findResult){
				findResult.goods_state = goods.goods_state
				this.commit('m_cart/saveToStorage')
			}
		},
		updateGoodsCount(state,goods){
			const findResult = state.cart.find(x => x.goods_id == goods.goods_id)
			if(findResult){
				findResult.goods_count = goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		delGoods(state,goods_id){
			const findResult = state.cart.filter(x => x.goods_id != goods_id)
			state.cart = findResult
			this.commit('m_cart/saveToStorage')
		},
		updateAllGoodsState(state,newState){
			state.cart.forEach(item=>{
				item.goods_state = newState 
			})
			this.commit('m_cart/saveToStorage')
		}
	},
	getters: {
		total(state) {
			let total = 0;
			state.cart.forEach(item => {
				total += item.goods_count
			})
			return total;
		},
		// 勾选的商品的总数量 
		checkedCount(state){
			return state.cart.filter(x => x.goods_state).reduce((total,item)=> total += item.goods_count,0);
		},
		// 总价格
		checkedGoodsAmount(state){
			return state.cart.filter(x=>x.goods_state).reduce((total,item)=> total += item.goods_count*item.goods_price,0).toFixed(2)
		}
	},
}
