import BaseModel from './baseModel.vue';

BaseModel.install = function(Vue){
    Vue.component(BaseModel.name, BaseModel);
}
export default  BaseModel;