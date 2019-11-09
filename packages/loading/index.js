import directive from './src/directive';
import Loading from './src/index';

export default {
  install(Vue) {
    Vue.use(directive);
    Vue.prototype.$loading = Loading;
  },
  directive,
  Loading
};
