$(function(){
    // click-active 指令，排他性地为目标DOM元素添加 active 属性
    $('html').on('click','[·click]',function(){
        $(this).evalAttr('·click');
    });
});
