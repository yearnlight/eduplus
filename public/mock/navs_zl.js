export default [
    {
        name: "首页",
        path: "/home",
        deadline: "",
        id: "1",
        level: "1",
        children: [
            {
                name: "园所主页",
                id: "111",
                level: "2",
                icon: "",
                deadline: "",
                path: "/home",
                children: [
                    {
                        name: "今日总览",
                        id: "111",
                        level: "3",
                        icon: "iconfont icon-account",
                        deadline: "",
                        path: "/home/todayOverview",
                        href:"/app/home/todayOverview"
                    }
                ]
            }
        ]
    },
    {
        name: "设置",
        path: "/setting",
        deadline: "",
        id: "2",
        level: "1",
        hide: true,
        children: [
            {
                name: "menu.personalSetting",
                id: "21",
                level: "2",
                icon: "iconfont icon-account",
                deadline: "",
                path: "/setting",
                children: [
                    {
                        name: "menu.accountManage",
                        id: "21",
                        level: "2",
                        icon: "iconfont icon-account",
                        deadline: "",
                        path: "/setting/account"
                    }
                ]
            }
        ]
    },
    {
        name: "应用管理",
        path: "/app",
        deadline: "",
        id: "3",
        level: "1",
        children: [
            {
                name: "menu.allApp",
                level: "2",
                icon: "iconfont icon-myapp",
                id: "31",
                deadline: "",
                path: "/app/allApp"
            },
            {
                name: "menu.appMarket",
                level: "2",
                icon: "iconfont icon-market",
                id: "32",
                deadline: "",
                path: "/app/market"
            },
            {
                name: "menu.appDetail",
                level: "2",
                icon: "",
                id: "33",
                deadline: "",
                path: "/app/market/detail",
                hide: true
            },
            {
                name: "menu.menuSetting",
                level: "2",
                icon: "iconfont icon-market",
                id: "34",
                deadline: "",
                path: "/app/menuSetting"
            }
        ]
    },
    {
        name: "老师管理",
        path: "/teacherManage",
        inFrame: true,
        deadline: "",
        id: "11",
        level: "1",
        children: [
            {
                name: "老师信息",
                level: "2",
                icon: "iconfont icon-teaching",
                id: "111",
                deadline: "",
                path: "/teacherManage",
                children: [
                    {
                        name: "老师列表",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/teacherManage/teacherInfo",
                        href: "/app/teacher/employee"
                    }
                ]
            }
        ]
    },
        {
        name: "财务管理",
        path: "/charge",
        deadline: "",
        id: "11",
        level: "1",
        children: [
            {
                name: "收费管理",
                level: "2",
                icon: "",
                id: "111",
                deadline: "",
                path: "/charge",
                children: [
                    {
                        name: "账单发送",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/billSend",
                        href: "/app/charge/billSend"
                    },
                    {
                        name: "账单",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/plan",
                        href: "/app/charge/plan"
                    },
                    {
                        name: "当面付",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/facePay",
                        href: "/app/charge/facePay"
                    },
                    {
                        name: "当面收",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/faceGet"
                    },
                    {
                        name: "收费记录",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/chargeIng",
                        href: "/app/charge/chargeIng"
                    },
                    {
                        name: "提现",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/cash",
                        href: "/app/charge/cash"
                    },
                    {
                        name: "设置",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/setting",
                        href: "/app/charge/setting"
                    },
                    {
                        name: "账单回收站",
                        level: "3",
                        icon: "",
                        id: "1111",
                        deadline: "",
                        path: "/charge/billRecycle"
                    },
                    {
                        name: "menu.batchManage",
                        level: "3",
                        icon: "iconfont icon-bill",
                        id: "42232",
                        deadline: "",
                        path: "/charge/batchManage"
                    }
                ]
            }
        ]
    },
    {
        name: "营养保健",
        path: "/nutritionCare",
        deadline: "",
        inFrame: true,
        id: "6",
        level: "1",
        children: [
            {
                name: "menu.dietaryCatering",
                level: "2",
                icon: "iconfont icon-food",
                id: "61",
                deadline: "",
                path: "/nutritionCare",
                children: [
                    {
                        name: "menu.formulatedRecipes",
                        level: "3",
                        icon: "",
                        id: "611",
                        deadline: "",
                        path: "/nutritionCare/formulatedRecipes",
                        href: "/app/diet/recipes?type=ordinary"
                    },
                    {
                        name: "menu.dietaryStatements",
                        level: "3",
                        icon: "",
                        id: "612",
                        deadline: "",
                        path: "/nutritionCare/dietaryStatements",
                        href: "/app/diet/report"
                    },
                    {
                        name: "menu.dietarySurvey",
                        level: "3",
                        icon: "",
                        id: "613",
                        deadline: "",
                        path: "/nutritionCare/dietarySurvey",
                        href: "/app/diet/survey?type=diningNumber"
                    },
                    {
                        name: "menu.cateringSet",
                        level: "3",
                        icon: "",
                        id: "614",
                        deadline: "",
                        path: "/nutritionCare/cateringSet",
                        href: "/app/diet/setting?type=class"
                    }
                ]
            },
            {
                name: "menu.dailyCare",
                level: "2",
                icon: "iconfont icon-care",
                id: "62",
                deadline: "",
                path: "/nutritionCare1",
                children: [
                    {
                        name: "menu.noonCheck",
                        level: "3",
                        icon: "",
                        id: "621",
                        deadline: "",
                        path: "/nutritionCare/inspect",
                        href: "/app/health/inspect"
                    }
                ]
            },
            {
                name: "menu.physicalTesting",
                level: "2",
                icon: "iconfont icon-physical",
                id: "63",
                deadline: "",
                path: "/nutritionCare1",
                children: [
                    {
                        name: "menu.measurementManage",
                        level: "3",
                        icon: "",
                        id: "631",
                        deadline: "",
                        path: "/nutritionCare/physiqueManage",
                        href: "/app/physique/home"
                    },
                    {
                        name: "menu.measurementReport",
                        level: "3",
                        icon: "",
                        id: "632",
                        deadline: "",
                        path: "/nutritionCare/physiqueReport",
                        href: "/app/physique/report?type=class"
                    }
                ]
            },
            {
                name: "menu.corporeityTesting",
                level: "2",
                icon: "iconfont icon-testing",
                id: "63",
                deadline: "",
                path: "/nutritionCare1",
                children: [
                    {
                        name: "menu.measurementManage",
                        level: "3",
                        icon: "",
                        id: "631",
                        deadline: "",
                        path: "/nutritionCare/corporeityManage",
                        href: "/app/corporeity/home"
                    },
                    {
                        name: "menu.measurementReport",
                        level: "3",
                        icon: "",
                        id: "632",
                        deadline: "",
                        path: "/nutritionCare/corporeityReport",
                        href: "/app/corporeity/report?type=class"
                    }
                ]
            }
        ]
    }
];
