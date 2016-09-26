+function(){ //auto function start

SuperBgInit();

function SuperBgInit(){
	var urls = [
		'http://yuanoook.com/cdn/zepto.min.js',
		'http://candy.yuanoook.com/static/js/httpGet.js',
		'http://candy.yuanoook.com/static/js/imgReady.js',
		'http://candy.yuanoook.com/static/js/SogouImageSpider.js'
	];

	Require(urls, SogouBgPrepare);

	fullScreenPrepare(window);
}

function fullScreenPrepare(){
	var arg = arguments[0] || window;

    fullScreenInit();

    function fullScreenInit(){

    	var style = SuperStyle();
    	style.addClass('hide-in-fullscreen', {
    		'display': 'none !important'
    	});

    	if( typeof arg == 'string' ){
        	$('html').on('dblclick', arg, onToggleFullScreen);
    	}else{
    		$(arg).on('dblclick', onToggleFullScreen);
    	}

    	function onToggleFullScreen(){
    		toggleFullScreen(function(){
					$('body').children().not('#super_bg').addClass('hide-in-fullscreen');
    		}, function(){
    				$('body').children().not('#super_bg').removeClass('hide-in-fullscreen');
    		});
    	}
    }

    function toggleFullScreen(on_callback, off_callback){
        if(document.webkitIsFullScreen || document.isFullScreen){
            document.cancelFullScreen && document.cancelFullScreen();
            document.webkitCancelFullScreen && document.webkitCancelFullScreen();
            off_callback && off_callback();
        }else{
            var d = document.documentElement;
            d.requestFullScreen && d.requestFullScreen();
            d.webkitRequestFullScreen && d.webkitRequestFullScreen();
            on_callback && on_callback();
        }
        return false;
    }
}

function SogouBgPrepare(Iquerys){
	var querys, spider, Get_timer, Set_timer;
	SogouBgInit();

	function SogouBgInit(){
		spider && (spider.images = []);
		clearInterval(Get_timer);
		clearInterval(Set_timer);

		querys = Iquerys || [
			'植物',
			'猫咪',
			'动物',
			'小狗',
			'大自然',
			'美丽的风景',
			'国家地理',
			'自然奇观',
			'春天',
			'夏天',
			'冬天',
			'秋天',
			'花',
			'树',
			'大海',
			'可爱',
			'美好',
			'善良',
			'友情',
			'微笑',
			'beautiful',
			'happiness',
			'smile'
		];

		if(localStorage.querys){
			querys = JSON.parse(localStorage.querys);
		}

		spider = new SogouImageSpider();

		get();
		set();

		Get_timer = setInterval(get, 100000);
		Set_timer = setInterval(set, 5000);

		function get(){
			spider.get( querys[ Math.floor(Math.random()*querys.length) ] );
		}

		function set(){
			var url = spider.images[ Math.floor(Math.random()*spider.images.length) ];

			if(url == null) return console.log('还没有图片...');

			imgReady(url, null,function(){
				var img = new Image();
				img.src = url;
				if(img.width*img.height>480000){
					setBg(url);
				}
			});
		}
	}

	function setBg(url){
		var bg = $('#super_bg');
			bg = bg.length ? bg.eq(0) : $('<div id="super_bg">').css({
				position: 'fixed',
				zIndex: -1,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				transition: 'background .5s ease'
			}).appendTo('body');

		bg.css({
			backgroundImage: 'url('+ url +')'
		});
	}
}

}();//auto function end

/**
 * 	公共函数区
 * 	**/

function Require(urls, callback){
	var urls = urls;

	!function(){
		if(urls.length){
			InsertScript( urls.shift() , arguments.callee );
		}else{
			callback && callback();
		}
	}();
}

function InsertScript(url, callback){
	var j = document.createElement('script');
	j.src = url;
	j.onload = callback;
	document.body.appendChild(j);
}

function SuperStyle(){
	var style = document.createElement('style');
	document.body.appendChild(style);

	return {
		addClass: addClass,
		removeClass: removeClass
	};

	function addClass(classname, k2v){
		var styleText = '.' + classname + '{'
		for(k in k2v){
			styleText += ( k + ':' + k2v[k] + ';');
		}
		styleText += '}';

		removeClass(classname);
		style.innerHTML = style.innerHTML + styleText;
	}

	function removeClass(classname){
		var styleText = style.innerHTML;
		var selector = '.'+classname;
		var regexp = selector + '[^\{]*\{[^\}]\}';
		styleText = styleText.replace(regexp, '');
		style.innerHTML = styleText;
	}

	function hasClass(classname){
		var selector = '.'+classname;
		var regexp = selector + '[^\{]*\{[^\}]\}';
		return regexp.test( style.innerHTML );
	}
}
