<template>
	<view>
		<view class="searchBox">
			<!-- 基本用法 -->
			<uni-search-bar @input="input" cancelButton="none" :radius="100" focus></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length != 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<view class="historyBox" v-else>
			<view class="historyTitle">
				<text>搜索历史</text>
				<uni-icons type="trash" size="16" @click="clear"></uni-icons>
			</view>
			<view class="historyContent">
				<uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				searchResults: [],
				searchHistory:[]
			};
		},
		//TODO 搜索历史
		computed:{
			histories(){
				return [...this.searchHistory].reverse()
			}
		},
		onLoad() {
			this.searchHistory = JSON.parse(uni.getStorageSync("histories") || '[]')	
		},
		methods: {
			input(e) {
				// 清除延时器
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					console.log(e)
					this.kw = e
					this.getSearchResults()
				}, 500)
			},
			async getSearchResults() {
				if (this.kw.trim() == '') {
					this.searchResults = []
					return
				}
				const {
					data: res
				} = await uni.$http.get("api/public/v1/goods/qsearch", {
					query: this.kw
				})
				if (res.meta.status == 200) {
					this.searchResults = res.message
					this.saveSearchHistory();
				}
			},
			saveSearchHistory(){
				const set = new Set(this.searchHistory)
				// 先对重复的进行删除
				set.delete(this.kw)
				// 在末尾进行添加，实现重复元素添加排到第一位
				set.add(this.kw)
				// 将set转化为集合
				// this.searchHistory = [...set]
				this.searchHistory = Array.from(set)
				// 对搜索历史进行持久化存储
				uni.setStorageSync("histories",JSON.stringify(this.searchHistory))
				
			},
			gotoDetail(item){
				console.log(item)
				uni.navigateTo({
					url:"/subpkg/goods_detail/goods_detail?good_id=" + item.goods_id
				})
			},
			clear(){
				this.searchHistory = []
				uni.setStorageSync("histories","[]")
			},
			gotoGoodsList(item){
				uni.navigateTo({
					url:"/subpkg/goods_list/goods_list?query="+item
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.searchBox {
		background-color: #c00000;
	}

	.sugg-list {
		padding: 5 0px;
		.sugg-item {
			border-bottom: 1px solid #efefef;
			font-size: 12px; 
			padding: 13px 0;
			display: flex;
			// 纵向中心
			align-items: center;
			// 两边对齐
			justify-content: space-between;
			.goods-name {
				// 文字不允许换行（单行文本） 
				white-space: nowrap; 
				// 溢出部分隐藏 
				overflow: hidden; 
				// 文本溢出后，使用 ... 代替 
				text-overflow: ellipsis;
			}
		}
	}
	
	.historyBox{
		padding: 0 5px;
		font-size: 13px;
		.historyTitle{
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #efefef;
		}
		.historyContent{
			display: flex;
			flex-wrap: wrap;
			margin-top: 10px;
			.uni-tag{
				margin-left: 5px;
			}
		}
		
	}
</style>
