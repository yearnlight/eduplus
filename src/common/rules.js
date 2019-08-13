const validateTelphone = function(rule, value, callback) {
  const reg = new RegExp("^[1][3,4,5,6,7,8,9][0-9]{9}$");
  if (!value) {
    callback(new Error("请输入手机号码"));
  }
  if (!reg.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};

// const validatePwd = function (rule, value, callback) {
//     //   const reg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$')
//     const reg = new RegExp('(?!^(\\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\\w~!@#$%^&*?]{8,16}$');
//     if(!value){
//         callback(new Error('请输入密码'))
//     }
//     if (!reg.test(value)) {
//         callback(new Error('请输入正确的8-16位字母数字字符组合密码'))
//     } else {
//         callback()
//     }
// }

const validatePwd = function(rule, value, callback) {
  const reg = new RegExp("^[\\w@*_!#]{6,18}$");
  if (!value) {
    callback(new Error("请输入密码"));
  }
  if (!reg.test(value)) {
    callback(new Error("请输入正确的6-18位密码"));
  } else {
    callback();
  }
};

export { validateTelphone, validatePwd };
