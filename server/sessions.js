var sessions = [];

setInterval(function(){
    for(var i=sessions.length-1; i>-1; i--){
        var session = JSON.parse( sessions[i] );
        (new Date().getTime() - session.time) > 3600000 && sessions.splice(i,1);
    }
}, 3600000);

module.exports = sessions;
