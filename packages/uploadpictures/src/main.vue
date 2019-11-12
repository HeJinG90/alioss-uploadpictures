

<template>
    <div class="uploading" v-loading="loading" >
        <div  class="addImgDiv" v-for="(item,index) in imgs" :key="index" >
            <img :src=item @click="showImg"/>
              <svg @click="deleteImg" t="1572952729610" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2286" width="20" height="20"><path d="M499.104 83.392c239.68 0 434.656 194.976 434.656 434.624 0 239.648-195.008 434.656-434.656 434.656S64.448 757.664 64.448 518.016 259.456 83.392 499.104 83.392m0 933.28c274.944 0 498.656-223.712 498.656-498.656S774.08 19.392 499.104 19.392C224.16 19.392 0.448 243.072 0.448 518.016s223.712 498.656 498.656 498.656" p-id="2287"></path><path d="M278.72 704.512h-0.032a31.968 31.968 0 1 0 45.248 45.28l186.496-186.56 186.528 186.56a31.968 31.968 0 1 0 45.248-45.248l-0.032-0.032-186.464-186.496 186.464-186.464 0.032-0.032a31.968 31.968 0 1 0-45.248-45.248l-186.528 186.496-186.496-186.496A31.968 31.968 0 1 0 278.72 331.52l186.464 186.464-186.464 186.496z" p-id="2288"></path></svg>
        </div>
        <div class="imgDiv">
          <input  @change="uploadImg" type="file"  class="img_input"  accept="image/*"  />	
              <svg t="1572953742745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3209" width="64" height="64"><path d="M864 448 512 448 512 96C512 78.08 497.92 64 480 64 462.08 64 448 78.08 448 96L448 448 96 448C78.08 448 64 462.08 64 480 64 497.92 78.08 512 96 512L448 512l0 352C448 881.92 462.08 896 480 896 497.92 896 512 881.92 512 864L512 512l352 0C881.92 512 896 497.92 896 480 896 462.08 881.92 448 864 448z" p-id="3210" fill="#8a8a8a"></path></svg>
        </div>	
       <div @click="concealImage" :style="{display:previewStatus}" class="previewImage" ><img  :src=previewImg /> </div>
    </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue'
import OSS from 'ali-oss';
import Loading from '../../loading/index'
Vue.use(Loading)
import Message from '../../message/index'
Vue.prototype.$message = Message;
import '../../loading/src/loading.css';
import '../../message/src/message.css';
export default {
  name: "uploadPictures",
  data() {
    return {
      client:'',
      previewStatus:'none',
      previewImg:'',
      filename:'',
      loading:false
    };
  },
  props: {
    //图片数组
    imgs: Array,
    //oss配置参数
    ossconfig:Object,
    //压缩质量 0 到 1
    quality:{
      type: Number,
      default: 1
    },
    // 目录
    dir:{
      type: String,
      default: ''
    },
    //限制大小kb
    size:{
      type: Number,
      default: 0
    },
    //限制数量
    num:{
      type: Number,
      default: 0
    }
  },
  created: function() {
    this.configoss();
  },
  methods: {
    uploadImg: function(event) {
      let _this = this;
      _this.loading = true;
      let file = event.currentTarget.files[0];
      if(!file){
        _this.loading = false;
        return
      }
      if(_this.size > 0 && !(_this.size > file.size/1024)){
          _this.$message.error(`请传入小于${_this.size}kb的图片`);
          _this.loading = false;
          return
      }
      if(_this.num > 0 && !(_this.num > _this.imgs.length)){
         _this.$message.error(`最多只能添加${_this.num}张图片`);
         _this.loading = false;
         return
      }
      if (!/image/g.test(file.type)) {
         _this.$message.error("请确保文件为图像文件");
        _this.loading = false;
        return;
      }
      _this.filename = file.name;
      //文件转base64
      _this.filetoDataURL(file,function(url){
        //base64转image对象
       _this.urltoImage(url,function(image){
        //image对象转canvas对象
      let canvas =  _this.imagetoCanvas(image);
         //canvas对象压缩后转blob对象
        _this.canvasResizetoFile(canvas,_this.quality,function(file){
          _this.putBlob(file,_this.dir+_this.filename,function(result){
            if(result){
              _this.imgs.push(result) ;
              _this.$emit('change',_this.imgs)
            }
          });
        })
       })  
      });
    },
    putBlob:function(blob,name,fn){
        let _this = this;
        let result =  _this.client.put(name, blob);
        result.then(function(value) {
          _this.$message({
            message: '上传成功',
            type: 'success'
          });
          _this.loading = false;
          fn(value.url);
        }, function(error) {
          _this.$message.error(error.message);
          _this.loading = false;
          fn('');
        });
    },
    filetoDataURL:function (file,fn){
      var reader = new FileReader();
      reader.onloadend = function(e){
        fn(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    urltoImage:function  (url,fn){
      var img = new Image();
      img.src = url;
      img.onload = function(){
        fn(img);
      }
    },
    imagetoCanvas:function (image){
      var cvs = document.createElement("canvas");
      var ctx = cvs.getContext('2d');
      cvs.width = image.width;
      cvs.height = image.height;
      ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
      return cvs ;
    },
    canvasResizetoFile:function (canvas,quality,fn){
      canvas.toBlob(function(blob) {
        fn(blob);
      },'image/jpeg',quality);
    },

    showImg(event){
        let _this = this;
        _this.previewStatus = 'flex';
        _this.previewImg =event.currentTarget.currentSrc;
        
    },
    concealImage:function(event){
        event.stopPropagation();
        event.preventDefault();
        let _this = this;
        _this.previewStatus = 'none';
        },
    deleteImg(event){
        let _this = this;
        Array.prototype.remove = function(val) {
          var index = this.indexOf(val);
          if (index > -1) {
          this.splice(index, 1);
          }
        }
        _this.imgs.remove(event.currentTarget.parentElement.firstChild.currentSrc);
        _this.$emit('change',_this.imgs)

    },
    configoss(){
      this.client = new OSS(this.ossconfig);
    },
   
    
  }
};
</script>
<style scoped>
.uploading{
    background-color: white;
    display: flex;
    flex-wrap: wrap;
}
.imgDiv {
  position: relative;
  display: inline-block;
  width: 100px;;
  height: 100px;
  text-align: center;
  background-color: #F2F2F2;
  margin: 10px;
}
.imgDiv .icon {
  margin-top: 18px;
}
.img_input {
  width: 100px;;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  -moz-opacity: 0;
  -ms-opacity: 0;
  -webkit-opacity: 0;
  opacity: 0; /*css属性——opcity不透明度，取值0-1*/
  cursor: pointer;
}
.addImgDiv{
  position: relative;
  display: inline-block;
  width: 100px;;
  height: 100px;
  text-align: center;
  margin: 10px;
}
.addImgDiv img {
  width: 100px;
  height: 100px;
}
.addImgDiv .icon{
    position: absolute;
    top: 2px;
    right: 2px;
}
.addImgDiv .icon img{
    width: 20px;
    height: 20px;
}
.previewImage{
        position: fixed;
        display: flex;
        z-index: 999;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        background-color:white;
    }
.previewImage img{
    width: 100vw;
}

</style>

