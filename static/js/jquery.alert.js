$(function(){
    $.extend({
        alert: function(){
            var msgWrap = $('<div>').css({
                position:'fixed',
                top:'0',
                zIndex:'10000',
                width:'30%',
                minWidth: '320px',
                margin:'auto',
                left:0,
                right:0,
                background:'#fff'
            }).appendTo($('body'));

            var removeBtn = $('<div><span>×</span></div>').css({
                textAlign: 'right',
                display: 'none',
                fontSize: '1.5em'
            });

            removeBtn.find('span').css({
                cursor: 'pointer',
                display: 'inline-block',
                padding: '0 10px'
            }).on('click',function(){
                msgWrap.find('.msg').remove();
                removeBtn.hide();
            });

            removeBtn.appendTo(msgWrap);

            msgWrap.hover(function(){
                removeBtn.slideDown();
            },function(){
                removeBtn.slideUp();
            });

            return function(msg,goodNews,showTime){
                var options = {
                    msg: msg || 'Jquery Alert, Created by rango@yuanoook.com !',
                    goodNews: $.type(goodNews)=='boolean' ? goodNews : true,
                    showTime: showTime
                };

                if($.type(msg)=='object') for(var i in msg) options[i] = msg[i];
                options.showTime = options.showTime || (options.goodNews?1000:5000);

                var msgDiv = $('<div class="msg">').css({
                    padding: '10px',
                    background: options.goodNews ? '#DEFCD5' : '#F1D7D7',
                    color: options.goodNews ? '#52A954' : '#A95252',
                    fontWeight: '900',
                    textAlign: 'center',
                    overflow: 'hidden',
                    display: 'none',
                    boxShadow: '2px 2px 7px #CCC'
                }).text(options.msg).appendTo(msgWrap);

                msgDiv.slideDown(function(){
                    setTimeout(function(){
                        msgDiv.slideUp(300,function(){
                            msgDiv.remove();
                        });
                    }, options.showTime);
                });
            }
        }()
    });
});
