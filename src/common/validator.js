//校验电话
const checkTel = tel => {
  var mobile = /^1\d{10}$/,
    phone = /^0\d{2,3}-?\d{7,8}$/;
  return mobile.test(tel) || phone.test(tel);
};

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
export { checkTel, validateTelphone };
