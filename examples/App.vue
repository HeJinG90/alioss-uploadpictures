<template>
  <div id="app">
    <uploadPictures @change = "getimg" :imgs = imgs :ossconfig = ossconfig :quality = 1 :dir = dir :size = 200 :num = 5 ></uploadPictures>
  </div>
</template>

<script>
import Vue from 'vue'
// 导入组件
import uploadPictures from '../packages/index'
// 使用组件
Vue.use(uploadPictures)
export default {
  name: 'app',
  data(){
       return{
           imgs:[], // 图片数组
           ossconfig:{
                accessKeyId: '',
                accessKeySecret: '',
                bucket: '',
                region: 'oss-cn-beijing'
            },
            dir:'/images/' //目录文件夹
       }
       
   },
   methods:{
     getimg(e){
           this.imgs = e;
       },
   }
}
</script>

