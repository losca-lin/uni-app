
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
import store from '@/store/store.js'

Vue.config.productionTip = false

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

$http.baseUrl = "http://www.uinav.com/"

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
  	title:"数据请求中..."
  })
  console.log(store)

// 说明请求的是有权限的接口
  if(options.url.indexOf() != -1){
	  options.header = {
		  Authorization:store.state.m_user.token
	  }
  }
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}

uni.$showMsg = function(title = '请求失败',duration = 1500){
	uni.showToast({
		title,
		duration,
		icon:"none"
	})
}
App.mpType = 'app'

const app = new Vue({
    ...App,
	// 挂载store
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif