<template>
	<view>
		<!-- 自定义组件 -->
		<!-- <my-searach :bgcolor="'#ff557f'" :bradius="0"></my-searach> -->
		<my-searach @myclick="gotoSearch"></my-searach>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<div v-for="(item,index) in cateList" :key="index">
					<view :class="['left-scroll-view-item',active==index?'active':'']" @click="changeActive(index)">
						{{item.cat_name}}
					</view>
				</div>
			</scroll-view> <!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,index2) in cateListLv2" :key="index2">
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>

					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3"
							@click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image> <!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
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
				wh: 0,
				cateList: [],
				active: 0,
				// 二级分类
				cateListLv2: [],
				scrollTop: 0
			};
		},
		onLoad() {
			const info = uni.getSystemInfoSync()
			console.log(info)
			this.wh = info.windowHeight - 50;
			this.getCateList();
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get("api/public/v1/categories")
				if (res.meta.status != 200) return uni.$showMsg()
				this.cateList = res.message
				this.cateListLv2 = res.message[0].children
			},
			changeActive(index) {
				this.active = index
				this.cateListLv2 = this.cateList[index].children
				// 修改bug 页面切换置顶
				this.scrollTop = this.scrollTop == 0 ? 1 : 0
			},
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: "/subpkg/goods_list/goods_list?cid=" + item3.cat_id
				})
			},
			gotoSearch(){
				uni.navigateTo({
					url:"/subpkg/search/search"
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #ffffff;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}
	}

	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
