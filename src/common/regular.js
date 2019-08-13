export default {
    studentName: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{2,15}$/, message: "学生名称支持2-15位中文、英文、数字包括下划线" },
    gradeName: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{0,10}$/, message: "名称支持10位以内中文、英文、数字包括下划线" },
    batchName: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{0,32}$/, message: "批次名称支持32位以内中文、英文、数字包括下划线" },
    className: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{0,20}$/, message: "班级名称支持20位以内中文、英文、数字包括下划线" },
    roleName: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{0,20}$/, message: "角色名称支持20位以内中文、英文、数字包括下划线" },
    familyName: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{2,15}$/, message: "家人名称支持2-15位中文、英文、数字包括下划线" },
    teacherName: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{0,20}$/, message: "老师名称支持20位以内中文、英文、数字包括下划线" },
    cardNumber: { pattern: /^[\d]{10}$/, message: "考勤卡仅限10位数字", label: "考勤卡号" },
    phoneNum: { pattern: /^1\d{10}$/, message: "请输入11位手机号", label: "手机号" },
    studentNum: { pattern: /^[a-zA-Z0-9]{0,32}$/, message: "学号支持32位以内数字、字母", label: "学号" },
    pickupNum: { pattern: /^[0-9]{10}$/, message: "接送卡号支持10位由数字", label: "接送卡号" },
    idNum: { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: "请输入正确的身份证号", label: "身份证号" },
    studentIdNum: { pattern: /^[a-zA-Z0-9]{30}$/, message: "证件号码支持30位数字、字母", label: "证件号码" },
    required: { required: true, message: '此选项必填' },
    requiredChange: { required: true, message: '此选项必填', trigger: 'change' },
    chargeItem:{pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{0,20}$/, message: "收费项支持20位以内中文、英文、数字包括下划线"},
    chargeFee:{pattern: /^[1-9]\d{0,6}(\.\d{1,2})?$|^0(\.\d{1,2})?$/, message: "收费金额支持9位以内数字、小数"}
}