/*!
*工具类 
*2019-08-13 11:37:58 
*yangmx
*/
import Http from "@/http/http";
import qs from "qs";
import vue from "vue";
const VUE = new vue();
import store from "./vuex/store";

const getIndexByAttr = (attrValue, source, filed) => {
  let fileds = [];
  source.forEach(item => {
    fileds.push(item[filed]);
  });
  return fileds.indexOf(attrValue);
};

const setEduplusPage = (target, filePath) => {
  let page = null;
  try {
    page = require(`./components${filePath}/index.vue`).default;
  } catch {
    page = require(`./components/common/noservice.vue`).default;
  }
  target.push({
    path: `/eduplus${filePath}`,
    component: page
  });
};

const getLastLevelConf = (data, target, treelevel) => {
  data.forEach(child => {
    //设置数据层级
    child.treelevel = treelevel + 1;
    if (child.children && child.children.length) {
      getLastLevelConf(child.children, target, child.treelevel);
    } else {
      let paths = child.path.split("/");
      //三级、四级菜单
      if (child.href == 'eduplus' && child.type == '0') {
        target.push({
          path: `/eduplus${child.path}`,
          component: require(`./components${child.path}.vue`).default
        });
      } else if (!child.href && child.type == '1') {
        //没有对应嵌入页面时，尝试调取学加家页面
        setEduplusPage(target, child.path);
      } else {
        //非校易收功能，在学加家新开发功能
        if (child.href == "saas") {
          setEduplusPage(target, child.path);
        } else if (child.href == "eduplus") {
          //知了内部不存在功能，在学加家新开发功能
          setEduplusPage(target, child.path);
        } else {
          target.push({
            path: `/eduplus${child.path}`,
            name: paths[paths.length - 1],
            component: require("./components/frame/index.vue").default
          });
        }
      }
    }
  });
};

const setParentPermission = (source, pPath) => {
  for (let i = 0; i < source.length; i++) {
    let item = source[i];
    //找到一级目录
    if (item.path == pPath) {
      let childs = item.children.filter(n => !n.noPermission);
      //有权限的子目录不存在时，一级目录设置
      if (!childs.length) {
        item.noPermission = true;
        break;
      }
    }
  }
};

//标记权限
const setPermissionTag = (data, navsData) => {
  data.forEach(item => {
    if (item.children && !item.children.length) {
      //二级菜单设置没权限
      item.noPermission = true;
      //倒着推父级权限
      let paths = item.path.split("/");
      let pPath = `/${paths[1]}`;
      setParentPermission(navsData, pPath);
    }
  });
};

//判断当前路由是否存在于生成的路由配置里面(递归寻找)
const isExistPathInRouterConf = (dynamicEoutes, path) => {
  if (dynamicEoutes && dynamicEoutes.length) {
    for (let i = 0; i < dynamicEoutes.length; i++) {
      let item = dynamicEoutes[i];
      if (item.path == path) {
        return true;
      }
      else {
        if (item.children && item.children.length) {
          let finded = isExistPathInRouterConf(item.children, path);
          if (finded) {
            return true;
          }
        }
      }
    }
  }
}

//获取重定向路由
const getLastLevelFirstPath = (data, navsData) => {
  let redirectPath = "";
  for (let i = 0; i < data.length; i++) {
    let child = data[i];
    if (child.children && child.children.length) {
      return getLastLevelFirstPath(child.children);
    } else {
      if (i == 0) {
        redirectPath = child.path;
        break;
      }
    }
  }
  return redirectPath;
};

const getDynamicRoutes = navsData => {
  let routeConfs = [];
  navsData.forEach(item => {
    item.treelevel = 1;
    if (item.children && item.children.length) {
      let redirectPath = getLastLevelFirstPath(item.children, navsData);
      setPermissionTag(item.children, navsData);
      if (!item.noPermission) {
        let routeConf = {
          path: `/eduplus${item.path}`,
          redirect: `/eduplus${redirectPath}`,
          component: require("./components/common/leftMenu.vue").default,
          children: []
        };
        getLastLevelConf(item.children, routeConf.children, item.treelevel);

        routeConfs.push(routeConf);
      }
    } else {
      item.noPermission = true;
    }
  });
  //设置完成菜单权限
  setSStorage("menu_list", navsData);
  return routeConfs;
};

//设置localStorage
const setLStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
// 获取localStorage
const getLStorage = key => {
  let val = window.localStorage.getItem(key);
  if (val == "undefined" || val == "null") {
    return null;
  } else {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
};
// 设置 sessionStorage
const setSStorage = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value));
};
// 获取 sessionStorage
const getSStorage = key => {
  let val = window.sessionStorage.getItem(key);
  if (val == "undefined" || val == "null") {
    return null;
  } else {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
};
// 校易收 切换学校验证
const xysSwitchSchool = () => {
  let promise = new Promise((resolve, reject) => {
    VUE.$http
      .post(
        VUE.$url.xysurl.switchSchool, {},
        qs.stringify({
          schoolNo: VUE.getSStorage("saas_currentSchool").externalSchoolNo
        }),
        "application/x-www-form-urlencoded"
      )
      .then(res => {
        if (0 === res.status) {
          let curSchool = getSStorage("saas_currentSchool");
          curSchool.logo = res.data.logo;
          setSStorage("saas_currentSchool", curSchool);
          resolve(res)
        } else if (res.status === 42) {
          store.commit("setLastSchoolInfo", "");
          // window.webapp.$router.push({
          //   path: `/eduplus/noPid/indexNoPid`
          // });
          resolve(res);
        } else {
          store.commit("setLastSchoolInfo", "");
          reject(res);
        }
      });
  });
  return promise;
};
// 知了切换学校
const zlSwitchSchool = () => {
  //  单元权限
  var accountModalType = VUE.getSg("accountModalType");
  if (accountModalType == "isSingle") {
    return VUE.$http.post(VUE.$url.zlurl.findByUser).then(res => {
      VUE.setSStorage("saas_currentMode", "分园模式");
      VUE.setSStorage("saas_permission", res.bizData);
    });
  }
  // 集团园权限
  else {
    return VUE.$http.post(VUE.$url.zlurl.organizationPermission).then(res => {
      VUE.setSStorage("saas_currentMode", "机构模式");
      VUE.setSStorage("saas_permission", res.bizData);
    });
  }
};

//初始化学校信息
const getSchoolList = () => {
  let token = getSStorage("saas_token") || getSStorage("_TOKEN_COOKIE");
  if (token) {
    let promise = VUE.$http.post(VUE.$url.zlurl.querySchoolList).then(res => {
      if (res.rtnCode == "0000000") {
        //设置默认选中学校
        setSStorage("school_list", res.bizData);
        let curSchoolInfo = res.bizData[0];
        setSStorage("saas_currentSchool", {
          schoolId: curSchoolInfo.schoolId,
          schoolNo: curSchoolInfo.schoolId,
          ...curSchoolInfo
        });
        //学加家 or 校易收
        if (curSchoolInfo.source == "XJJ") {
          zlSwitchSchool(curSchoolInfo);
        } else if (curSchoolInfo.source == "XYS") {
          xysSwitchSchool().then(() => { });
        }
      } else {
        window.sessionStorage.clear();
        window.localStorage.clear();
      }
    });
    return promise;
  }
};

const requireMenuData = (curSchool, token) => {
  let schoolList = getSStorage("school_list");
  let showXysOrg = 0; //是否展示校易收集团概览：只有校易收学校&学校数>1
  if (schoolList) {
    let zlSchool = schoolList.find(school => {
      return school.source == 'XJJ';
    })
    if (!zlSchool && schoolList.length > 1) {
      showXysOrg = 1;
    }
  }
  return Http.post(
    VUE.$url.blueurl.queryMenu, {},
    qs.stringify({
      token: token,
      appCode: "eduplus_saas",
      schoolNo: curSchool.schoolId,
      orgId: curSchool.orgId,
      menuFlag: 'zl',//写死读取知了
      showXysOrg: showXysOrg,
      externalSchoolNo: curSchool.externalSchoolNo,
      schoolId: curSchool.schoolId
    }),
    "application/x-www-form-urlencoded"
  ).then(res => {
    let menu = res.data ? res.data.menuDtoList : [];
    setSStorage("menu_list", menu);
    return res;
  });
};

//获取菜单信息
const getMenuList = () => {
  //获取token
  let token = getSStorage("saas_token") || getSStorage("_TOKEN_COOKIE");
  let code = VUE.getSg("code");
  if (code) {
    var obj = {
      schoolNo: "",
      orgId: code,
      productCode: "zl",
    };
    //拉取知了按钮权限
    if (obj.productCode == "zl") {
      zlSwitchSchool(obj);
    }
    return requireMenuData(obj, token);
  } else {
    //获取当前学校
    let curSchool = getSStorage("saas_currentSchool");
    if (curSchool) {
      return requireMenuData(curSchool, token);
    } else {
      return getSchoolList().then(() => {
        curSchool = getSStorage("saas_currentSchool");
        if (curSchool) {
          return requireMenuData(curSchool, token);
        }
      });
    }
  }
};

const download = (data, name, type) => {
  if (!data) {
    return
  }
  let $URL = window.URL || window.webkitURL;
  let blob = null;
  if (type == 'pdf') {
    blob = new Blob([data], {
      type: `application/pdf;charset-UTF-8` //word文档为msword,pdf文档为pdf
    });
  }
  else {
    blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  }
  var url = $URL.createObjectURL(blob);
  var aLink = document.createElement("a");
  aLink.style.display = "none";
  aLink.href = url;
  let suffix = type || "xls";
  aLink.setAttribute("download", `${name}.${suffix}`);
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink); //下载完成移除元素
  window.URL.revokeObjectURL(url); //释放掉blob对象
}

const deepClone = obj => {
  var buf;
  if (obj instanceof Array) {
    buf = [];	//创建一个空数组
    var i = obj.length;
    while (i--) {
      buf[i] = deepClone(obj[i]);
    }
    return buf;
  }
  else if (obj instanceof Object) {
    buf = {};
    for (var k in obj) {
      buf[k] = deepClone(obj[k]);
    }
    return buf;
  } else {
    return obj;
  }
}

const translateParams = (param, key, encode) => {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += translateParams(param[i], k, encode);
    }
  }
  return paramStr;
}
//手机号脱敏
const desensitization = phoneNum => {
  phoneNum = "" + phoneNum;
  return phoneNum.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
}

const getPropInArray = (source, field) => {
  let temp = [];
  source.forEach(n => {
    temp.push(n[field])
  })
  return temp;
}

const getLoading = (n) => {
  let keys = Object.keys(n);
  keys.forEach(k => {
    if (/.*(l|L)oading$/.test(k) && n[k] === !!n[k]) {
      n[k] = false;
    }
  })
}
//递归当前所有组件去掉loading
const unLoading = (vueComponents) => {
  let temp = [];
  if (!Array.isArray(vueComponents)) {
    temp.push(vueComponents)
  }
  else {
    temp = vueComponents;
  }
  temp.forEach(n => {
    getLoading(n);
    if (n && n.$children && n.$children.length) {
      unLoading(n.$children)
    }
  })
}

/**
 * 校验日期
 * @param startDate
 * @param endDate
 * @param checkNull  是否判断日期为空
 */
const checkDateValid = (_startDate, _endDate, checkNull) => {
  let message = "";
  let startDate, endDate;
  if (_startDate) {
    startDate = new Date(_startDate);
    startDate.setHours(0, 0, 0);
  }
  if (_endDate) {
    endDate = new Date(_endDate);
    endDate.setHours(23, 59, 59);
  }
  if (startDate && endDate && startDate > endDate) {
    message = "开始时间不能大于结束时间";
  }

  if (checkNull) {
    if (startDate && !endDate) {
      message = "请选择结束时间";
    }
    if (!startDate && endDate) {
      message = "请选择开始时间";
    }
  }
  return message;
};

const groupBy = (source, field) => {
  let res = {}
  source.forEach(item => {
    if (!res[item[field]]) {
      res[item[field]] = [item];
    }
    else {
      res[item[field]].push(item);
    }
  })
  return res;
}
//你是阿刁，你是自由的鸟
const getBase64 = (img) => {
  function getBase64Image(img, width, height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
  }
  var image = new Image();
  image.crossOrigin = '';
  image.src = img;
  if (img) {
    var promise = new Promise((resolve, reject) => {
      image.onload = function () {
        resolve(getBase64Image(image));//将base64传给done上传处理
      }
    });
    return promise;//问题要让onload完成后再return sessionStorage['imgTest']
  }
}
//埋点
const BuriedPoint = (eventType,urlParams) => {
  let pageNames = [];
  let _self = window.webapp;
  if(_self.$root.crumbs && _self.$root.crumbs.length){
    _self.$root.crumbs.forEach(c =>{
      pageNames.push(c.name);
    })
  }
  let params = {
    user_id: VUE.getSStorage("userId"),
    distinct_id: "",
    time: (new Date()).valueOf(),
    type: "click" || eventType,
    event: config.event,
    app_code: "eduplus",
    plateform: "pc",
    version: "2.0.0",
    bid: "",
    page_name: pageNames.join("/"),//塞入面包屑完整名称，eg:首页/总览
    url: "",
    referer: "",
    element_name: "",
    element_id: "",
    ip: "",
    figerprint: "",
    duration_time: "",
    mac: "",
    properties: ""//接口入参
  }

  Vue.$http.post('/event/commev2.0',{},params);
}


export default {
  getIndexByAttr,//判断对象数组某属性值在数组里面的索引
  getDynamicRoutes,//生成路由配置
  getSchoolList,//获取学校列表
  getMenuList,//获取菜单列表
  xysSwitchSchool,//校易收学校校验
  zlSwitchSchool,//知了切换学校
  checkDateValid,//时间校验（开始时间小于结束时间）
  isExistPathInRouterConf,//判断目标路由是否存在于路由配置中
  groupBy,//对象数组按照属性分组
  download,//模拟a便签下载（blob）
  translateParams,//xxx-form请求参数组装
  deepClone, //深度克隆
  getPropInArray,//对象数组里面抓出某个属性的值组成数组
  unLoading,//去掉界面loading效果
  desensitization, //手机号中间加密
  getBase64,//url生成base64
  BuriedPoint
};