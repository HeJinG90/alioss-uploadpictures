import uploadPictures from './src/main';

uploadPictures.install = function(Vue) {
  Vue.component(uploadPictures.name, uploadPictures);
};

export default uploadPictures;