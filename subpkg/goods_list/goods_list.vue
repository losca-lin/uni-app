<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodList" :key="i" @click="gotoGoodsDetail(goods)">
				<my-good :goods="goods"></my-good>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					// 查询关键词 
					query: '',
					// 商品分类Id 
					cid: '',
					// 页码值 
					pagenum: 1,
					// 每页显示多少条数据 
					pagesize: 10
				},
				goodList: [],
				total: 0,
				// 节流阀
				isloading:false
			};
		},
		
		onLoad(obj) {
			this.queryObj.cid = obj.cid || ''
			this.queryObj.query = obj.query || ''
			this.getGoodList();
		},
		methods: {
			async getGoodList(cb) {
				// 开启节流阀
				this.isloading = true;
				const {
					data: res
				} = await uni.$http.get("api/public/v1/goods/search", this.queryObj);
				// 请求成功关闭节流阀
				this.isloading = false;
				cb&&cb();
				if (res.meta.status != 200) return uni.$showMsg()
				this.goodList = [...this.goodList,...res.message.goods]
				this.total = res.message.total
			},
			gotoGoodsDetail(goods){
				uni.navigateTo({
					url:"/subpkg/goods_detail/goods_detail?goods_id=" + goods.goods_id
				})
			}
		},
		onReachBottom() {
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("数据加载完毕！")
			if(this.isloading) return
			this.queryObj.pagenum++;
			this.getGoodList();
		},
		onPullDownRefresh() {
			this.queryObj.pagenum = 1;
			this.total = 0;
			this.goodList = [];
			this.getGoodList(()=> uni.stopPullDownRefresh()) 
		}
	}
</script>

<style lang="scss">

</style>
