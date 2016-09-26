//全局过滤器配置
$(function(){
    $(window).data('equalNum',function(num1,num2){$.callCount['equalNum'] = ($.callCount['equalNum']||0)+1;
        return parseFloat(num1)===parseFloat(num2);
    }).data('largeThan',function(num1,num2){$.callCount['_largeThan'] = ($.callCount['_largeThan']||0)+1;
        return parseFloat(num1) > parseFloat(num2);
    }).data('noHTML',function(str){
        return (str||'').replace(/\</g,'&lt').replace(/\>/g,'&gt');
    }).data('parseJSON',function(str){
        var result;
        try{result = JSON.parse(str)}catch(e){};
        return result;
    }).data('isEmpty',function(str){
        return !str;
    }).data('isNotEmpty',function(str){
        return !!str;
    });
});
