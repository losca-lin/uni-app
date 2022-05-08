<template>
	<view class="my-search-container" :style="{'background-color': bgcolor}" @click="handlerSearch">
		<!-- 使用 view 组件模拟 input 输入框的样式 -->
		<view class="my-search-box" :style="{'border-radius':bradius + 'px'}">
			<uni-icons type="search" size="17"></uni-icons> 
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-searach",
		props:{
			bgcolor:{
				type:String,
				default:'#aa0000'
			},
			bradius:{
				type:Number,
				default:15
			}
			
		},
		data() {
			return {

			};
		},
		methods:{
			handlerSearch(){
				console.log("======")
				// 触发调用此组件的click事件
				this.$emit("myclick")
			}
		}
	}
</script>

<style lang="scss">
.my-search-container{
	// background-color: #aa0000;
	height: 50px;
	display: flex;
	// 纵向居中对齐
	align-items: center;
	padding: 0 10px;
	.my-search-box{
		width: 100%;
		height: 36px;
		background-color: #ffffff;
		// border-radius: 15px;
		display: flex;
		// 横向居中对齐
		justify-content: center;
		align-items: center;
		.placeholder{
			font-size: 15px;
			margin-left: 5px;
		}
	}
	
}
</style>
