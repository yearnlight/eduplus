export default [
  {
    name: "首页",
    path: "/home",
    deadline: "",
    id: "1",
    level: "1",
    children: [
      {
        name: "首页",
        id: "111",
        level: "2",
        icon: "iconfont icon-account",
        path: "/home",
        href: "indexPage"
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
    name: "收费管理",
    path: "/charge",
    deadline: "",
    inFrame: true,
    id: "4",
    level: "1",
    children: [
      {
        name: "收费",
        level: "2",
        icon: "iconfont icon-faceToPay",
        id: "421",
        deadline: "",
        path: "/charge",
        children: [
          {
            name: "menu.sendBill",
            level: "3",
            icon: "iconfont icon-faceToPay",
            id: "42131",
            deadline: "",
            path: "/charge/sendBill",
            href: "sendBill"
          },
          {
            name: "menu.faceGet",
            level: "2",
            icon: "iconfont icon-bill",
            id: "42132",
            deadline: "",
            path: "/charge/faceGet",
            href: "faceGet"
          },
          {
            name: "menu.faceToPay",
            level: "2",
            icon: "iconfont icon-signup",
            id: "42133",
            deadline: "",
            path: "/charge/facePay",
            href: "facePay"
          }
        ]
      },
      {
        name: "账单管理",
        level: "2",
        icon: "iconfont icon-bill",
        id: "422",
        deadline: "",
        children: [
          {
            name: "menu.checkBill",
            level: "3",
            icon: "iconfont icon-faceToPay",
            id: "42231",
            deadline: "",
            path: "/charge/checkBill",
            href: "checkBill"
          },
          {
            name: "menu.batchManage",
            level: "3",
            icon: "iconfont icon-bill",
            id: "42232",
            deadline: "",
            path: "/charge/batchManage"
          },
          {
            name: "menu.billRecycle",
            level: "3",
            icon: "iconfont icon-signup",
            id: "42233",
            deadline: "",
            path: "/charge/billRecycle",
            href: "billRecycleBin"
          }
        ]
      },
      {
        name: "提现管理",
        level: "2",
        icon: "iconfont icon-signup",
        id: "423",
        deadline: "",
        children: [
          {
            name: "menu.withdraw",
            level: "3",
            icon: "iconfont icon-faceToPay",
            id: "42331",
            deadline: "",
            path: "/charge/withdraw",
            href: "fundsManage"
          },
          {
            name: "menu.withdrawRecord",
            level: "3",
            icon: "iconfont icon-bill",
            id: "42332",
            deadline: "",
            path: "/charge/withdrawRecord",
            href: "widthdrawhis"
          },
          {
            name: "menu.bankCardManage",
            level: "3",
            icon: "iconfont icon-signup",
            id: "42333",
            deadline: "",
            path: "/charge/bankCardManage",
            href: "bankCardManage"
          }
        ]
      },
      {
        name: "电子发票",
        level: "2",
        icon: "iconfont icon-care",
        id: "424",
        deadline: "",
        children: [
          {
            name: "发票管理",
            level: "3",
            icon: "iconfont icon-head",
            id: "42431",
            deadline: "",
            path: "/charge/invoice",
            href: "invoiceInfo"
          },
          {
            name: "发票设置",
            level: "3",
            icon: "iconfont icon-head",
            id: "42432",
            deadline: "",
            path: "/charge/invoiceSetting",
            href: "hasOpenedInvoice"
          }
        ]
      }
    ]
  },
  {
    name: "menu.studentManage",
    path: "/student",
    deadline: "",
    level: "1",
    id: "1",
    children: [
      {
        name: "menu.studentManage",
        id: "11",
        level: "2",
        icon: "iconfont icon-class",
        deadline: "",
        path: "/student/manage",
        href: "stuManage"
      },
      {
        name: "menu.classManage",
        id: "12",
        level: "2",
        icon: "iconfont icon-student",
        deadline: "",
        path: "/student/class",
        href: "classManagement"
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
        name: "老师管理",
        level: "2",
        icon: "iconfont icon-teaching",
        id: "111",
        deadline: "",
        path: "/teacherManage",
        href: "authorityManager"
      }
    ]
  }
];
