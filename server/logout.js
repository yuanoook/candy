var querystring = require('querystring'),
    sessions = require('./sessions');

module.exports = function (request, response) {
    var postData = '';
    request.addListener('data', function (postDataChunk) { postData += postDataChunk; });

    request.addListener('end', function () {
        //注销会话
        var session = querystring.parse(postData).session;
        var i = sessions.indexOf(session);
        if (i < 0) {
            //如果没有找到会话
            response.send({
                msg: "已经退出登录"
            });
        } else {
            //找到会话，删除会话信息
            sessions.splice(i, 1);
            response.send({
                msg: "退出登录成功"
            });
        }
    });
}
