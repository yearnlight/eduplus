const _fs = require('fs');
const _path = require('path');
const _http = require('http');
const _mime = require('mime');
const _url = require('url');

const Koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const marked = require('marked');

const app = new Koa();
app.use(
  views('zmenu', {
    extension: 'ejs',
  })
);

let cache = {};
let cache_config = true;

//初始
const _root = _path.join(__dirname, '../');
var rootPath = _path.join(__dirname, '../src');
var rootPaths = rootPath.split('\\');

var res = [{
  children: [],
  name: rootPaths[rootPaths.length - 1],
  path: rootPath,
  isfile: false,
  id: '0',
}];
var resHtml = `<div class="logs-dir"><span style="margin:0 10px 0 7px;"> |————</span>${rootPaths[rootPaths.length - 1]}</div>`;
var allCount = 0;

function build() {
  function findFile(path, result = res[0].children, deep = '01') {
    let prev = new Array(deep).join(' |');
    let prevHtml = new Array(deep.length).join(
      "<span style='margin-left:7px;'>|</span>"
    );
    let curfiles = [];
    let curdirs = [];
    let files = _fs.readdirSync(path);
    files.forEach((item, index) => {
      let fpath = _path.join(path, item);
      let stat = _fs.statSync(fpath);
      //文件夹
      let nextdeep = `${deep}${index + 1}`;
      if (stat.isDirectory() === true) {
        if (fpath && !fpath.includes('node_modules') && !fpath.includes('.git')) {
          resHtml += `<div class="logs-dir">${prevHtml}<span style="margin:0 10px 0 7px;">|————</span>${item}</div>`;
          let temp = {
            name: item,
            isfile: false,
            children: [],
            id: nextdeep,
          };
          findFile(fpath, temp.children, nextdeep);
          result.push(temp);
          curdirs.push(temp);
        }
      }
      //文件
      if (stat.isFile() === true) {
        let currentFile = _fs.readFileSync(fpath, 'utf-8');
        //文件备注信息
        let descs = null;
        let rows = currentFile.split('\n');
        let rowCount = rows.length;
        let noteCount = getCommentCount(rows);
        if (
          (item.includes('.vue') || item.includes('.js')) &&
          (fpath &&
            !fpath.includes('node_modules') &&
            !fpath.includes('.git'))
        ) {
          //正则匹配注释
          let matchReg = /\/\*\!.*?\*\//gi;
          let desc = currentFile.split('\n').join('').match(matchReg);
          //匹配到注释
          if (desc && desc.length) {
            desc = desc[0];
            desc = desc.replace(/\s+/g, '');
            let mergeDesc = desc.match(/\/\*\!(\S*)\*\//)[1];
            descs = mergeDesc.split('*');
          }
        }

        let output;
        if (descs && descs.length) {
          output = {
            name: item,
            isfile: true,
            remark: descs[1],
            createTime: descs[2],
            author: descs[3],
            id: nextdeep,
            count: rowCount,
            noteRate: (noteCount / rowCount * 100).toFixed(2),
            noteCount: noteCount,
            path: fpath
          };
        } else {
          output = {
            name: item,
            isfile: true,
            id: nextdeep,
            count: rowCount,
            noteRate: (noteCount / rowCount * 100).toFixed(2),
            noteCount: noteCount,
            path: fpath
          };
        }
        allCount += rowCount;
        result.push(output);
        curfiles.push(output);
      }
    });

    curfiles.forEach((fileObj, i) => {
      let desc = fileObj.remark ?
        `---备注:${fileObj.remark} 创建者:${fileObj.author}` :
        '';
      resHtml += `<div class="logs-file">${prevHtml}<span style="margin:2px 20px 0 7px;">└───</span>${fileObj.name} ${desc}</div>`;
    });
  }

  findFile(rootPath);
}

build();

//-------------------------------
app.use(async (ctx, next) => {
  let filePath = false;
  let _content;
  let mime;
  if (ctx.method === 'POST') {
    let pastData = await parsePstData(ctx);
    ctx.request.body = pastData;
  } else if (ctx.method === 'GET') {
    //静态资源 or 接口
    if (ctx.req.url.includes('.')) {
      filePath = `zmenu${ctx.req.url}`;
      _content = await serveStatic(ctx.res, cache, filePath);
      mime = _mime.getType(_path.basename(filePath));
      if (mime) {
        ctx.type = mime;
      }
      if (mime && (mime.includes('font/') || mime.includes('image/'))) {
        ctx.res.writeHead(200);
        ctx.res.write(_content, 'binary');
        ctx.res.end();
      }
      else {
        ctx.body = _content;
      }
    } else { }
  }
  await next();
});

//路由
router.get('/', async ctx => {
  await ctx.response.redirect('/home');
});

router.get('/home', async ctx => {
  await ctx.render('readme', {
    title: '项目协助开发系统',
  });
});

//接口
//首页数据接口
router.get('/home/data', async ctx => {
  ctx.body = {
    code: 1,
    msg: '',
    result: {
      treeData: res,
      rootPath: rootPath,
      allCount: allCount,
    },
  };
});

router.get('/logs/data', async ctx => {
  ctx.body = {
    code: 1,
    msg: '',
    result: resHtml,
  };
});
//获取readme.md文件内容
router.get('/logs/md', async ctx => {
  let _content = '';
  let mdPath = `${_root}/README.md`;
  let exists = _fs.readFileSync(mdPath, 'utf-8');
  if (exists) {
    _content = _fs.readFileSync(mdPath, 'utf-8');
  }
  ctx.body = {
    code: 1,
    msg: '',
    result: _content,
  };
});
//保存readme
router.post('/logs/saveMd', async ctx => {
  let {
    content
  } = JSON.parse(ctx.request.body);
  _fs.writeFileSync(`${_root}/README.md`, content);
  refresh(ctx);
});
//md格式转html输出
router.post('/logs/mdtohtml', async ctx => {
  let {
    content
  } = JSON.parse(ctx.request.body);
  let contentHtml = marked(content, {
    sanitize: true
  });
  ctx.body = {
    code: 1,
    msg: "",
    result: contentHtml
  }
})

//保存自定义配置
router.post('/config/save', async ctx => {
  let {
    path,
    fileTypes
  } = JSON.parse(ctx.request.body);
  _path.resolve(__dirname).replace(/\\\\/g, '\\');
  rootPath = _path.resolve(__dirname) + path ? path : '';
  rootPaths = rootPath.split('\\');
  refresh(ctx);
});
//保存注释
router.post('/remark/save', async ctx => {
  let {
    name,
    path,
    isfile,
    id,
    createTime,
    author,
    remark
  } = JSON.parse(
    ctx.request.body
  );
  if (isfile) {
    let currentFile = _fs.readFileSync(path, 'utf-8');
    let matchReg = /\/\*\![\s\S]*?\*\//gi;
    let desc = currentFile.match(matchReg);
    if (desc) {
      if (currentFile.indexOf(`${desc[0]}\n`) != -1) {
        currentFile = currentFile.substr(`${desc[0]}\n`.length);
      } else {
        currentFile = currentFile.substr(desc[0].length);
      }
    }

    let insertPart = `/*!\n*${remark} \n*${createTime} \n*${author}\n*/\n`;
    _fs.writeFileSync(path, insertPart + currentFile);
    refresh(ctx);
  } else { }
});
//读取选中文件内容
router.post("/file/content", async ctx => {
  let {
    path
  } = JSON.parse(ctx.request.body);
  let currentFile = null;
  if (/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga|webp)$/.test(path)) {
    //吐血
    currentFile = _fs.readFileSync(path, null);
    //二进制流
    let mime = _mime.getType(_path.basename(path));
    let base64Data = currentFile.toString('base64');
    let base64 = 'data:' + mime + ';base64,' + base64Data;
    currentFile = base64;
  }
  else{
    currentFile = _fs.readFileSync(path, 'utf-8');
  }
  ctx.body = {
    code: 1,
    msg: "",
    result: currentFile
  };
})

app.use(router.routes());
app.use(router.allowedMethods());
app.use(bodyParser());
app.listen(3001);
console.log('\033[42;30m 服务 \033[40;32m 启动完成 localhost:3001 \033[0m')

//统计注释数量
function getCommentCount(rows) {
  let reg = /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g;
  let count = 0;
  rows.forEach(item => {
    let res = item.match(reg);
    if (res && res.length) {
      count++;
    }
  });
  return count;
}

//重置初始值
function reset() {
  res = [{
    children: [],
    name: rootPaths[rootPaths.length - 1],
    path: rootPath,
    isfile: false,
    id: '0',
  },];

  resHtml = `<div class="logs-dir"><span style="margin:0 10px 0 7px;"> |————</span>${rootPaths[rootPaths.length - 1]}</div>`;
  allCount = 0;
}

//重新读取文件信息
function refresh(ctx) {
  ctx.body = {
    code: 1,
    msg: "保存成功"
  };
  reset();
  build();
}

//404时渲染
function send404(response) {
  return "Error 404: Resource not found";
}

function sendFile(response, filePath, fileContents) {
  return fileContents;
}

//读取静态文件
function serveStatic(response, cache, absPath) {
  let _content;
  if (cache[absPath] && cache_config) {
    _content = sendFile(response, absPath, cache[absPath]);
  } else {
    let exists = _fs.readFileSync(absPath);
    if (exists) {
      let mime = _mime.getType(_path.basename(absPath));
      if (mime && (mime.indexOf('image/') >= 0 || mime.indexOf('font/') >= 0)) {
        _content = _fs.readFileSync(absPath, 'binary');
      } else {
        _content = _fs.readFileSync(absPath, 'utf-8');
      }
    } else {
      _content = send404(response);
    }
  }
  return _content;
}

function parsePstData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.on('data', data => {
        postdata += data;
      })

      ctx.req.addListener("end", () => {
        resolve(postdata);
      })
    } catch (error) {
      reject(error);
    }
  })
}
