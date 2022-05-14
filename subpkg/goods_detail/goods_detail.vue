<template>
	<view v-if="goods_info.goods_price" class="goodContainer">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item,i) in goods_info.pics" :key='i'>
				<image class="swiper-item" :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>

		</swiper>

		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view> <!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view> <!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>

		<view>
			<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		</view>
		<view class="goods-carts">
			<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>

	</view>
</template>

<script>
	// 从 vuex 中按需导出 mapState 辅助方法 
	import {
		mapState,
		mapMutations,
		mapGetters,
	} from 'vuex'
	export default {
		computed: {
			// 完成函数映射
			...mapState('m_cart', ['cart']),
			...mapGetters('m_cart', ['total'])
		},
		watch: {
			// total(newVal){
			// 	debugger
			// 	this.options[1].info = newVal
			// }
			total: {
				// handler 属性用来定义侦听器的 function 处理函数 
				handler(newVal) {
					this.options[1].info = newVal
				},
				// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用 
				immediate: true
			}
		},
		data() {
			return {
				goods_info: {},
				options: [{
						icon: 'shop',
						text: '店铺',
						infoBackgroundColor: '#007aff',
						infoColor: "#f5f5f5"
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 0
					}
				],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
						color: '#fff'
					}
				],

			};
		},
		onLoad(obj) {
			this.getGoodsInfo(obj.goods_id)
		},
		methods: {
			...mapMutations('m_cart', ['addToCart']),
			async getGoodsInfo(goods_id) {
				const {
					data: res
				} = await uni.$http.get("api/public/v1/goods/detail", {
					goods_id
				});
				if (res.meta.status != 200) return uni.$showMsg()
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ').replace(/webp/g, 'jpg')
				this.goods_info = res.message
			},
			preview(i) {
				uni.previewImage({
					current: i,
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			onClick(e) {
				console.log(e)
				if (e.content.text == '购物车') {
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				}
			},
			buttonClick(e) {
				if (e.content.text == '加入购物车') {
					// 2. 组织一个商品的信息对象 
					const goods = {
						goods_id: this.goods_info.goods_id,

						goods_name: this.goods_info.goods_name,

						goods_price: this.goods_info.goods_price,

						goods_count: 1,

						goods_small_logo: this.goods_info.goods_small_logo,

						goods_state: true,
					}
					// 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中 
					this.addToCart(goods)
				}
			}
		},

	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.goods-info-box {
		padding: 0 5px;

		.price {
			font-size: 18px;
			color: red;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 12px;
				margin-right: 5px;
			}

			.favi {
				width: 120px;
				display: flex;
				flex-direction: column;
				font-size: 12px;
				align-items: center;
				justify-content: center;
				color: gray;
				border-left: 5px solid #efefef;

			}
		}

		.yf {
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}

	.goods-carts {
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	.goodContainer {
		padding-bottom: 50px;
	}
</style>
