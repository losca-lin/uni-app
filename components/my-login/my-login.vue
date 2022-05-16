<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" @click="login">一键登录</button>
		<!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapMutations,mapState
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed:{
			...mapState('m_user',['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserinfo','updateToken','updateRedirectInfo']),
			async login() {
				const [err, succ] = await uni.getUserProfile({
					desc: "登录"
				});
				if (err == null && succ.errMsg == "getUserProfile:ok") {
					this.updateUserinfo(succ.userInfo)
					this.getToken(succ);
				} else {
					return uni.$showMsg("您取消了登录授权！")
				}

			},
			async getToken(info) {
				const [err, res] = await uni.login().catch(err => err)
				if (err || res.errMsg != "login:ok") return uni.$showMsg("登录错误")
				// 准备参数对象 
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				this.updateToken("1245432easfdgddgfzsgh")
				if(this.redirectInfo && this.redirectInfo.openType == 'switchTab'){
					uni.switchTab({
						url:this.redirectInfo.from,
						complete:()=> {
							this.updateRedirectInfo(null)
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 750rpx;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.btn-login {
			width: 90%;
			background-color: #c00000;
			border-radius: 100px;
			margin: 15px 0;
		}

		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
