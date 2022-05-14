<template>
	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioChangeHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view> <!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
				<!-- 商品数量 -->
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showNumber" @change="numberChange">
				</uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-good",
		props: {
			goods: {
				type: Object,
				default: {}
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			showNumber: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters: {
			// 把数字处理为带两位小数点的数字 
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			radioChangeHandler() {
				this.$emit("checkRadio", {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			numberChange(val) {
				this.$emit("numberchange", {
					goods_id: this.goods.goods_id,
					goods_count: val - 0
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		border-bottom: 1px solid #efefef;

		.goods-item-left {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-pic {
				height: 100px;
				width: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 5px;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.goods-price {
					font-size: 16px;
					color: #c00000;
				}
			}


		}

	}
</style>
