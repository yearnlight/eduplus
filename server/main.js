const query = require('./pool'),
Koa = require('koa'),
router = require('koa-router')(),
bodyParser = require('koa-bodyparser')

const app = new Koa()

router.post('/menu/get', async (ctx) => {
    let params = ctx.request.body;
    let res = await query('select * from menu', "")
    console.log(res);
    ctx.response.body = { status: 200, msg: '', data: res };
})

app.use(bodyParser());

app.use(router.routes());

app.use(router.allowedMethods());

app.listen(3003, () => {
    console.log('\033[42;37m SUCCESS \033[42;37m 服务端启动成功,localhost:3003\033[0m')
    // console.log('服务端启动成功,localhost:3003')
});
