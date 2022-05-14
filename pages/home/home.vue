<template>
	<view>
		<view class="mysearch">
			<my-searach @myclick="gotoSearch"></my-searach>
		</view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>

		</swiper>

		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i">
				<image :src="item.image_src" class="nav-img" @click="navClickHandler(item)"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator> <!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<view class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"
								@click="clickToGoodsList(item2)">
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				color: "blue",
				swiperList: [],
				// 列表
				navList: [],
				//楼层
				floorList: []
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get("api/public/v1/home/swiperdata")
				if (res.meta.status != 200) {
					return uni.$showMsg()
				}
				this.swiperList = res.message

			},
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get("api/public/v1/home/catitems")
				if (res.meta.status != 200) {
					return uni.$showMsg()
				}
				this.navList = res.message
			},
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get("api/public/v1/home/floordata")
				if (res.meta.status != 200) {
					return uni.$showMsg()
				}
				// debugger
				res.message.forEach(item => {
					item.product_list.forEach(product => {
						product.url = '/subpkg/goods_list/goods_list?' + product.navigator_url.split(
							'?')[1]
					})
				})
				this.floorList = res.message
			},
			navClickHandler(e) {
				if (e.name == '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},

			clickToGoodsList(e) {
				uni.navigateTo({
					url: e.url
				})
			},
			gotoSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			height: 100%;
			width: 100%;

		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;

	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}
	.mysearch{
		// 固定位置
		position: sticky;
		// 固定在顶部
		top: 0;
		z-index: 999;
	}
</style>
