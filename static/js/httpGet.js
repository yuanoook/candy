function httpGet(url, encoding, callback){
	var thisFunc = arguments.callee;
	thisFunc.socket = thisFunc.socket || socketStart();
	
	arguments.callee.socket.sendData({
		command: 'curl',
		url: url,
		encoding: encoding
	});

    function socketStart(){
    	var url = "ws://yuanoook.com:8888";
		var socket =  new WebSocket( url );

	    socket.tasks = [];
	    socket.onopen = function(){
	        console.log('伦家连好了，感觉棒棒哒...');
	        while(socket.tasks.length) socket.tasks.pop()();
	    }
	    socket.onmessage = function(msg){
	        var data = msg.data;
	        callback(data);
	    }
	    socket.onclose = function(){
	        console.log('哎呀，不要断开不要断开，伦家要重连要重连。');
	        setTimeout(function(){
	            thisFunc.socket =  socketStart();
	        },1000);
	    }
	    socket.sendData = function(data){
	    	var dataString = JSON.stringify(data);

		    if(socket.readyState==1){
		    	console.log(dataString);
		        socket.send(dataString);
		    }else{
		        socket.tasks.push(function(){
		            socket.send(dataString);
		        });
		    }
	    }

	    return socket;
    }
}
