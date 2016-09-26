var querystring = require('querystring'),
    mongo = require('./mongoServer'),
    security = require('./security'),
    sessions = require('./sessions');

module.exports = function(request, response){
    var postData = '';
    request.addListener('data',function(postDataChunk){postData += postDataChunk;});
    request.addListener('end',function(){
        var params = querystring.parse(postData);

        //入口安全检查
        params.email = security.emailcheck( params.email );
        if( !params.email ){return response.send({err: '嘿：这不是邮箱'});}

        var arg = {
            collection: 'persons',
            data: {
                email: params.email
            }
        }

        arg.success = function( result ){
            if( result.length != 1 ){
                //查找数据异常
                return response.send({err: result.length==0 ? '嘿：邮箱没注册' : '嘿：注册过多咯'});
            }else if( result[0].passwordmd5 == security.md5(params.password) ){
                //找到数据，尝试匹配密码
                //登录成功，session 注入
                var session = JSON.stringify({
                    md5: security.md5( new Date().getTime() + '' + Math.random() ),
                    email: params.email,
                    time: new Date().getTime() });

                sessions.push(session);
                result[0].session = session;

                //出口安检
                return response.send( security.outputcheck(result[0]) );
            }else{
                //密码错误
                return response.send({err: '嘿：密码不对啊'})
            }
        };

        arg.fail = function( err ){
            var res_json = JSON.stringify( err );
            res(response, 200, 'text/json', res_json);
        };

        mongo.find(arg);
    });

    response.lock();
}
