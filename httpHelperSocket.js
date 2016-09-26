var http = require('http');
var url = require('url');
var iconv = require('iconv-lite');
var bufferHelper = require('bufferhelper');
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8888});

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
    	var arg = JSON.parse(message);
        if( !(arg.command == 'curl' && arg.url) ){return;}
        var src = url.parse(arg.url);
        http.request({
            hostname: src.hostname,
            path: src.path
        },function(res){
            var data = new bufferHelper();
            res.on('data',function(chunk){data.concat(chunk);});
            res.on('end',function(){
                ws.send(iconv.decode(data.toBuffer(),arg.encoding||'utf8'));
            });
        }).on('error', function(e){
            ws.send(JSON.stringify(e));
        }).end();
    });
});
