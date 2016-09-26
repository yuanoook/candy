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
        if( !params.email ){
            return response.send({err: '嘿：这不是邮箱'});
        }

        //首先查询数据库是否已经注册
        var arg = {
            collection: 'persons',
            data: {
                email: params.email
            },
            success: function(result){
                return result.length ? response.send({err: '嘿：邮箱已经注册'}) : login_write_please( params );
            },
            fail: function(err){
                return response.send(err);
            }
        }
        mongo.find(arg);
    });

    function login_write_please(params) {
        var arg = {
            collection: 'persons',
            data: {
                name: params.name,
                email: params.email,
                passwordmd5: security.md5(params.password)
            }
        }

        arg.success = function (result) {
            //注册成功  session 注入
            var session = JSON.stringify({
                md5: security.md5(new Date().getTime() + '' + Math.random()),
                email: result.email,
                time: new Date().getTime()
            });
            sessions.push(session);
            result.session = session;

            //出口安检
            return response.send( security.outputcheck(result) );
        };
        arg.fail = function (err) {
            response.send(err);
        };

        mongo.save(arg);
    }
}
