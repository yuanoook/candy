//启动配置
$(function(){
    $(window).data('Params_findAllContents',{
        command:'find',
        session:localStorage.person && JSON.parse( localStorage.person ).session,
        arg:'{"collection":"contents","data":{}}'
    });

    $( $.jimuRootFlag ).each(function(){
        $(this).fire('启动初始化！').render();
    });
});
