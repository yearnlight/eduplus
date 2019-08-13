import Vue from "vue";
import Http from "./http/http";
import Url from "./http/url";
import rules from '@/common/regular';
import enums from '@/common/enum';

Vue.prototype.$http = Http;
Vue.prototype.$url = Url;
Vue.prototype.$rules = rules;
Vue.prototype.$enums = enums;

Vue.prototype.setLStorage = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
}

Vue.prototype.getLStorage = key => {
    let val = window.localStorage.getItem(key);
    if (val == "undefined" || val == "null") {
        return null;
    }
    else {
        try {
            return JSON.parse(val);
        }
        catch{
            return val;
        }
    }
}
Vue.prototype.setSg = (key,value) => {
    window.sessionStorage.setItem(key, value);
}
Vue.prototype.getSg = (key) => {
    return window.sessionStorage.getItem(key);
}
Vue.prototype.setLg = (key,value) => {
    window.localStorage.setItem(key, value);
}
Vue.prototype.getLg = (key) => {
   return window.localStorage.getItem(key);
}
Vue.prototype.removeLg = (key) => {
    window.localStorage.removeItem(key);
} 
Vue.prototype.removeSg = (key) => {
    window.sessionStorage.removeItem(key);
}

Vue.prototype.setSStorage = (key, value) => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
}

Vue.prototype.getSStorage = key => {
    let val = window.sessionStorage.getItem(key);
    if (val == "undefined" || val == "null") {
        return null;
    }
    else {
        try {
            return JSON.parse(val);
        }
        catch{
            return val;
        }
    }
}
