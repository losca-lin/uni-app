<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="checkALL">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label> <!-- 合计区域 -->
		<view class="amount-box"> 合计:<text class="amount">￥{{checkedGoodsAmount}}</text> </view> <!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view> 
	
</template>

<script>
	import {mapGetters,mapMutations,mapState}from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {
				second:3,
				timer:null
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addressStr']),
			...mapState('m_user',['token']),
			// 是否全选 
			isFullCheck() { return this.total === this.checkedCount },
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			checkALL(){
				this.updateAllGoodsState(!this.isFullCheck)
			},
			async settlement(){
				// 1. 先判断是否勾选了要结算的商品 
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！') 
				// 2. 再判断用户是否选择了收货地址 
				if (!this.addressStr) return uni.$showMsg('请选择收货地址！') 
				// 3. 最后判断用户是否登录了 
				if (!this.token) return this.delayNavigate()
				const [err,succ] = await uni.showModal({
					title:"提示",
					content:"确认进行支付？"
				})
				if(succ && succ.confirm){
					uni.showToast({
						icon:"success",
						title:"支付已完成！"
					})
				}
			},
			// 展示倒计时的提示消息 ,n为秒数
			showTips(n){
				uni.showToast({
					icon:"none",
					title:'请登录后再结算！' + n + '秒后自动跳转到登录页',
					// 页面遮罩，防止点击穿透
					mask:true,
					duration:1500,
					success:()=>{
						this.updateRedirectInfo({
							openType:'switchTab',
							from:'/pages/cart/cart'
						})
					}
				})
			},
			delayNavigate(){
				this.showTips(this.second)
				// 设置定时器 timer为定时器的id
				this.timer = setInterval(()=>{
					this.second--;
					if(this.second <= 0){
						// 清除定时器
						clearInterval(this.timer)
						uni.switchTab({
							url:"/pages/my/my"
						})
						// 重置秒数
						return this.second = 3
					}
					this.showTips(this.second)
				},1000)
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		background-color: white;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
			font-weight: bold;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>
