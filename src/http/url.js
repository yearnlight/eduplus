const zlurl = {
  // 登录
  saasLogin: "/zl_api/uc/user/saasLogin",
  //退出登录
  zlLogout: "/zl_api/kidscare/user/logOut",
  //获取图形验证码
  getCode: "/zl_api/uc/user/getCode",
  //校易收切换学校
  switchSchool: "/xys_api/home/switchSchool",
  //知了单元的权限
  findByUser: "/zl_api/kidscare/saas/permissionManage/findByUser",
  //知了集团园的权限
  organizationPermission: "/zl_api/kidscare/organization/permission/findByUser",
  // 查询用户 学校信息
  querySchoolList: "/zl_api/kidscare/user/querySchoolList",
  // queryUserInfo: "/zl_api/kidscare/user/queryUserInfo",
  queryUserInfo: "/zl_api/kidscare/user/xjjQueryUserInfo",
  // 获取用户的组织
  getUserAllSchool: "/zl_api/kidscare/user/getUserAllSchool",
  // 获取集团园身份裂变
  queryEmployeeByUserId: "/zl_api/uc/organization/queryEmployeeByUserId",
  // 批次管理-新建批次
  newBatch: "/zl_api/yucai/billBatch/createBillBatch",
  // 批次管理-批次列表
  queryBatchList: "/zl_api/yucai/billBatch/pageBillBatch",
  // 批次管理-删除批次
  deleteBatch: "/zl_api/yucai/billBatch/deleteBillBatch",
  // 批次管理-合并批次
  mergeBatch: "/zl_api/yucai/billBatch/mergeBillBatch",
  // 批次管理-统计
  queryBatchStatistic: "/zl_api/yucai/billBatch/statisticsBillBatch",
  // 批次管理-延期
  delayBatch: "/zl_api/yucai/billBatch/delayBillBatch",
  // 批次管理-取消定时发送
  cancelTimingSendBill: "/zl_api/yucai/billBatch/cancelBatchSend",
  // 当面收-获取班级列表信息
  queryClassList: "/zl_api/yucai/class/getClassListByUserId",
  // queryClassList: "/zl_api/kidscare/saas/employee/getClassList",
  // 当面收-获取年级列表信息
  queryGradeList: "/zl_api/kidscare/saas/classManage/getGradeList",
  // 当面收-获取班号列表信息
  queryClassNum: "/zl_api/kidscare/saas/classManage/getClassNumber",
  // 当面收-获取班级类型列表信息
  queryClassTypeList: "/zl_api/uc/school/getClassTypes",
  // 当面收-新建班级
  addClass: "/zl_api/kidscare/saas/classManage/save",
  // 当面收-获取校验项
  queryVerifyOptions: "/zl_api/yucai/planChargeMain/fetchSchoolCheckOption",
  // 当面收-获取缴费项目列表
  queryChargeItems: "/zl_api/yucai/chargeItem/chargeItemList",
  // 当面收-当面收发送账单
  faceGetSendBill: "/zl_api/yucai/edu/bill/facePayment",
  // 当面收-批次名称校验
  checkBatchName: "/zl_api/yucai/billBatch/checkBatchName",
  // 当面收-当面收获取批次号
  queryFaceGetBatchNo: "/zl_api/yucai/edu/bill/getSchoolBatchNo",
  // 当面收-当面收账单列表
  queryFaceGetBillList: "/zl_api/yucai/planChargeMain/queryPlanChargeMain",
  // 当面收-作废单个账单
  invalidSingleBill: "/zl_api/yucai/planChargeMain/cancelPlanChargeMain",
  // 当面收-查询催缴功能开通状态
  getPayNotifyStatus: "/zl_api/yucai/planChargeMain/urgeNotifyState",
  // 当面收-申请开通催缴功能
  applyOpenPayNotify: "/zl_api/yucai/planChargeMain/urgeNotifyApply",
  // 当面收-查询催缴短信剩余条数
  getNotifyRemains: "/zl_api/yucai/planChargeMain/urgeNotifyRemainAmount",
  // 当面收-催缴
  goPayNotify: "/zl_api/yucai/planChargeMain/urgeNotify",
  // 当面收-编辑重发
  editAndResend: "/zl_api/yucai/edu/bill/deleteAndSend",
  // 获取当面付二维码图片地址
  getFacePayBarcode: "/zl_api/yucai/app/qrcode/getSchoolPersonalQrcode",
  // 获取知了相关参数
  queryZlParams: "/zl_api/yucai/charge/queryCharge",
  /**
   * 上传文件
   */
  uploadFile: () => {
    let token = window.sessionStorage.getItem("saas_token");
    return ` /zl_api/file/upload/savefile.shtml?token=${token}`;
  },
  //更新用户信息
  yxbUploadUserInfo: "/zl_api/uc/user/yxbUploadUserInfo",
  //账单回收站
  billRecycleList: "/zl_api/yucai/planChargeMain/edu/pageTrash",
  delbillRecycle: "/zl_api/yucai/planChargeMain/edu/deleteOneTrash",
  clearbillRecycle: "/zl_api/yucai/planChargeMain/edu/deleteAllTrash",
  getSchoolTermList: "/zl_api/kidscare/saas/controlCenter/getSchoolTermList",
  getClassListByUserId: "/zl_api/yucai/class/getClassListByUserId",
  //知了： 获取验证码
  getSMSCode: "/zl_api/uc/api/user/getSMSCode",
  // 知了：忘记密码
  forgetPassword: "/zl_api/uc/user/forgetPassword",
  // 知了：菜单排序设置
  addMenuManage: "/zl_api/kidscare/eduSaas/menuManage/addMenuManage",

  getOrgSchool: "/zl_api/kidscare/organization/SchoolRoleTemplet/getOrgSchool",
  usersource: "/zl_api/uc/user/usersource",
  checkSmCode: "/zl_api/uc/user/fpasswordCheckSmsCode",
  updatePass: "/zl_api/uc/user/eduChangePassword",
  updatePhone: "/zl_api/uc/user/updateUserPhone",
  fpasswordCheckSmsCode: "/zl_api/uc/user/fpasswordCheckSmsCode",
  // 获取绑定支付宝URL
  getBindUrl: "/zl_api/uc/user/getBindUrl",
  alipayUnbind: "/zl_api/uc/user/alipayUnbind",
  saasOrderListV2: "/zl_api/kidscare/order/saasOrderListV2",
  unReadMessage: "/zl_api/kidscare/material/unReadMessage",
  getBindAlipayId: "/zl_api/uc/user/getBindAlipayId",
  // 机构模式下获取 学校列表

  //知了支付宝登录
  alipayLogin: auth_code => {
    return `/zl_api/uc/user/alipayLogin?auth_code=${auth_code}`;
  },
  //获取知了用户信息
  getUserRefreshInfo: "/zl_api/uc/user/getUserRefreshInfo",
  //获取学校saas版本
  getSchoolSaasVersionV2: "/zl_api/kidscare/boss/menuManage/getSchoolSaasVersionV2",
  //获取引导状态
  getUserGuide: "/zl_api/uc/userGuide/getUserGuide",
  //设置引导状态
  addUserGuide: "/zl_api/uc/userGuide/add"
};

const xysurl = {
  // authReturn: "/xys_api/auth_return",
  authReturn: "/xys_api/edu/xys/login",
  switchSchool: "/xys_api/home/switchSchool",
  accountInfo: "/xys_api/personal/accountInfo",
  personalSendSms: "/xys_api/personal/sms/send",
  //校验验证码
  personalSmsValid: "/xys_api/personal/sms/valid",
  modifyPhone: "/xys_api/personal/update/mobile",
  modifyPwd: "/xys_api/personal/update/password",
  unbindAlipay: "/xys_api/personal/unbind/alipay",
  bindAlipay: "/xys_api/personal/redirect/bindAlipay",
  //查询用户是否绑定支付宝
  isBindAlipay: "/xys_api/user/bind/isBindAlipay",
  //校验手机号
  validMobile: "/xys_api/user/valid/mobile",
  //绑定手机号
  bindMobile: "/xys_api/personal/bind/mobile",

  getXYSCode: "/xys_api/callback/alipay/bind",
  //校易收：获取验证码
  sendSms: "/xys_auth_api/rest/sms/send",
  //校易收：校验验证码
  validSms: "/xys_auth_api/rest/sms/valid",
  //校易收:忘记密码
  forgetPwd: "/xys_auth_api/rest/forgetPwd",
  // 首次登陆：新功能提示
  firstLogin: "/xys_api/userAction/firstLogin",

  //校易收绑定支付宝跳转地址
  xysBindAlipaySkipUrl: () => {
    let HOST = window.location.host;
    if (HOST.indexOf('web.imeduplus.com') !== -1) {
      return 'https://www.soeasypay.cn/callback/alipay/bind?taskNo='
    } else {
      return 'https://test1.soeasypay.cn/callback/alipay/bind?taskNo='
    }
  }
};

const blueurl = {
  querySchool: "/bluewhale/rest/permission/querySchool",
  queryMenu: "bluewhale/rest/permission/queryMenu"
};

const eduurl = {
  teacherList:"/zl_api/kidscare/saas/employee/employeeList",//老师列表
  delTeacher:"/zl_api/kidscare/saas/employee/delSchoolTeacher",//删除老师
  roleList:"/zl_api/uc/personal/user/getRoles",//角色列表
  delRole:"/zl_api/kidscare/saas/roleManage/del",//删除角色
  addRole:"/zl_api/kidscare/saas/permissionManage/user/addRole",//新增角色
  editRole:"/zl_api/kidscare/saas/roleManage/add",//编辑角色 //Todo
  classList:"/zl_api/uc/personal/gradeClass/classes",//班级列表
  exportClass:"/zl_api/uc/personal/class/exportExcel",//班级导出
  gradeList:"/zl_api/kidscare/saas/classManage/getGradeList",//年级列表
  classInGrade:"/zl_api/uc/personal/greadIdForClassId",//年级下班级列表
  classesInGrades:"/zl_api/uc/personal/getGradeListAndClass",//年级下班级列表(重写)
  addTeacher:"/zl_api/kidscare/saas/employee/addEmployee",//添加老师
  editTeacher:"/zl_api/kidscare/saas/employee/modifyEmployee",//编辑老师
  rolePermissions:"/zl_api/kidscare/saas/permissionManage/findByRoleId",//角色权限
  studentList:"/zl_api/uc/personal/studentList",//学生列表
  addStudent:"/zl_api/kidscare/saas/childManage/save",//添加学生
  delClass:"/zl_api/uc/personal/deleteAllClass",//删除班级
  delStudent:"/zl_api/kidscare/saas/childManage/delChildByChildId",//删除单个学生
  delAllStudent:"/zl_api/uc/personal/delChildist",//批量删除学生
  studentInfo:"/zl_api/kidscare/saas/childManage/getChildInfo",//学生详情
  leaveSchoolAll:"/zl_api/uc/personal/leaveSchoolAll",//批量离校
  outStudentList:"/zl_api/kidscare/saas/childManage/queryAwayFromParkChild",//离园学生列表
  changeClassToIn:"/zl_api/uc/personal/changeClass",//调班 -->在班
  changeClassToNot:"/zl_api/uc/personal/batchClassToGroup",//调班 -->未分班
  restoreSchool:"/zl_api/uc/personal/leaveReJoinSchool",//离园再入园
  getCheckItem:"/zl_api/uc/personal/getCheckXys",//校易收校验项
  addClass:"/zl_api/kidscare/saas/classManage/save",//新增班级
  classEnum:"/zl_api/kidscare/saas/classManage/getClassNumber",//班级枚举
  classbill:"/xys_api/bill/sendClassBills",//班级收费
  downloadBillNote:"/xys_api/student/exportPdf",//下载缴费通知单
  downloadBillExport:"/xys_api/common/downloadExport",//下载缴费通知单
  importStudent:"/zl_api/uc/personal/student/import",//导入学生
  importProgress:"/zl_api/uc/personal/student/import/Exception",//获取导入进度
  exportStudent:"/zl_api/uc/personal/student/exportExcel",//导出学生
  studentCharge:"/xys_api/bill/charge",//学生收费
  addFace:"/zl_api//kidscare/face/addFace",//添加人脸

}

const tempurl = {
  "studentExcelPhone":"https://static.imzhiliao.com/%E5%AD%A6%E7%94%9F%E5%90%8D%E5%8D%95%28%E6%89%8B%E6%9C%BA%E5%8F%B7%E6%A0%A1%E9%AA%8C%E9%A1%B9%29.xlsx",
  "studentExcelStudentNum":"https://static.imzhiliao.com/%E5%AD%A6%E7%94%9F%E5%AF%BC%E5%85%A5%EF%BC%88%E5%AD%A6%E5%8F%B7%E6%A0%A1%E9%AA%8C%E9%A1%B9%EF%BC%89.xlsx",
  "studentExcelId":"https://static.imzhiliao.com/%E5%AD%A6%E7%94%9F%E5%90%8D%E5%8D%95%EF%BC%88%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%E6%A0%A1%E9%AA%8C%EF%BC%89.xlsx"
}

export default {
  zlurl: zlurl,
  xysurl: xysurl,
  blueurl: blueurl,
  eduurl:eduurl,
  tempurl:tempurl
};