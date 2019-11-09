# alioss-uploadpictures
[![NPM Version]](https://www.npmjs.com/package/alioss-uploadpictures)](https://img.shields.io/badge/NPM-1.0.0-blue)
![](https://img.shields.io/badge/licence-MIT-blue)
Introduction

一个通过传递alioss配置参数即可上传图片的插件。附件功能包括限制图片大小（kb），限制上传张数，压缩图片质量（0-1）

## example
![Image text](examples/assets/example.png)
Quick start
```
yarn add alioss-uploadpictures
```
import Vue from 'vue'
```
import uploadPictures from 'alioss-uploadpictures'
```
Vue.use(uploadPictures)


