var querystring = require('querystring'),
    mongo = require('./mongoServer'),
    security = require('./security'),
    sessions = require('./sessions');

module.exports = function(request, response){
    var postData = '';
    request.addListener('data',function(postDataChunk){postData += postDataChunk;});
    request.addListener('end',function(){
        //解析执行指令
        var params = querystring.parse(postData);

        //session 验证
        if(params.session && sessions.indexOf(params.session)>-1){
        //通过 session 验证
            console.log(sessions);
        }else if(params.command != 'find'){
        //没有通过 session 验证，并且执行的不是查询命令
            return response.send({err:'登陆失效'});
        }

        //入口安检
        if( security.inputcheck(params) !== params ){
            return repsonse.send({err:'非法请求'});
        }

        var arg = JSON.parse(params.arg);

        //arg 里面的 data 是 mongodb 操作集合的的第一个参数
        if(params.command == 'save'){
            arg.data.person = JSON.parse( params.session ).email;
        }

        //添加回调函数
        arg.success = function( result ){
            //出口安检
            return response.send(security.outputcheck(result));
        };
        arg.fail = function( err ){
            return response.send(err);
        };

        if(params.command == 'remove'){
            mongo.find({
                collection: arg.collection,
                data: arg.data,
                success: function(results){
                    if( !results.length ){
                        arg.success('已经没有记录！');
                        return;
                    }

                    /**
                        查询结果合法性验证，如果不是你生成的内容，不能删除
                    **/
                    var isLegal = true;
                    for(i in results){
                        var result = results[i];
                        if( result.person != JSON.parse(params.session).email ){
                            console.log(result.person);
                            console.log( JSON.parse(params.session).email );
                            isLegal = false;
                        }
                    }
                    if( !isLegal ){
                        arg.fail({err:"非法请求！"});
                        return;
                    }

                    mongo[ params.command ](arg);
                },
                fail: arg.fail
            });
            return;
        }

        mongo[ params.command ]( arg );
        return;
    });

    response.lock();
}
