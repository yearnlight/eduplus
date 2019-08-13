//设置常量枚举
const enums = {
    "cardType": [
        { name: "居民身份证", id: 1 },
        { name: "香港特区护照/身份证明", id: 2 },
        { name: "澳门特区护照/身份证明", id: 3 },
        { name: "台湾居民来往大陆通行证", id: 4 },
        { name: "境外永久居住证", id: 5 },
        { name: "护照", id: 6 },
        { name: "其他", id: 7 }
    ],
    "familyContact": [
        { name: "爸爸", id: 3 },
        { name: "妈妈", id: 3 },
        { name: "爷爷", id: 2 },
        { name: "奶奶", id: 2 },
        { name: "外公", id: 1 },
        { name: "外婆", id: 1 },
        { name: "其他", id: 0 }
    ],
    "paymentMethods":[
        { name: "现金", id: 2 },
        { name: "POS机", id: 3 },
        { name: "银行汇款转账", id: 4 },
        { name: "微信转账", id: 5 },
        { name: "其它", id: 7 }
    ]
};
export default enums;