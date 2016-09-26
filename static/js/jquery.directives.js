/*
Create by Rango [ yuanoook@foxmail.com yuanoook.com ]
Dependences:
	jquery.js
*/

// 自定义指令集合，click 触发生效
$(function(){
    // click-active 指令，排他性地为目标DOM元素添加 active 属性
    $('html').on('click','[click-active]',function(){
        var select = $(this).attr('click-active');
        $(select).addClass('active').siblings().removeClass('active');
    });

    // click-unactive 指令，去除 active 属性
    $('html').on('click','[click-unactive]',function(){
        var select = $(this).attr('click-unactive');
        $(select).removeClass('active');
    });

    // click-toggleclass 指令，点击切换指定类名
    $('html').on('click','[click-toggleclass]',function(){
        var className = $(this).attr('click-toggleclass');
        $(this).toggleClass(className);
    });

    // clickout-removeclass 指令，点击切换类名
    $('html').on('click',function($event){
    	$('[clickout-removeclass]').each(function(){
    		if( $(this)[0] === $event.target || $(this)[0].contains($event.target) ){
    			return;
    		}
	        var className = $(this).attr('clickout-removeclass');
	        $(this).removeClass(className);
    	});
    });

    // gmf-action:contact_customer_service
    $('html').on('click','[gmf-action="contact_customer_service"]',function(){
		if( !$.magnificPopup ){ window.console.log('缺乏 jquery.magnific-popup 模块'); return; };

		setTimeout(function(){
			$.magnificPopup.instance.open({
	            items: {
	                src: "#win_contact_customer_service",
	                type: "inline",
	                midClick: true
	            }
			}, 0);
		}, 10);
    });
});

// 自定义组件集合，页面初次渲染完成之后自动生效
$(function(){
	// focus-class 指令组件，获得焦点时添加 class，失去焦点时 移除 class
	$('[focus-class]').each(function(){
		var className = $(this).attr('focus-class');
		$(this).attr({
			'click-toggleclass': className,
			'clickout-removeclass': className
		});
	});

	// active-slide 指令组件，激活时
	$('[active-slide]').each(function(){
		var $this = $(this);
		var targetSelector = $this.attr('active-slide');
		$('html').on('click',function(){
			setTimeout(function(){
				if( $this.hasClass('active') ){
					$(targetSelector).slideDown(300);
				}else{
					$(targetSelector).slideUp(300);
				}
			},0);
		});
	});
});
