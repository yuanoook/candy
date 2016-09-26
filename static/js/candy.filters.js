$(function(){
	localStorage._draft = localStorage._draft || '[]';

    $('html').on('click paste input change', 'textarea', function(){
		var obj = $(this).get(0);
        obj.style.height = obj.scrollHeight - 20 + 'px';
        obj.style.height = obj.scrollHeight + 'px';
	});
});

//自定义命名空间
window._edit = {
	_id: '',
	/**
		获取 edit page 里面的所有数据，用于 本地 localStorage 和 mongodb 存档
	**/
	get: function(){
		var page = $('#page_edit');
		var isEmpty = true;

		var types = [];
		var content = {};

		/**
			第一步：获取所有的 非 templet card
		**/
		var cards = page.children('.card:not(.templet)');

		/**
			第二步：遍历card获取其中的数据
		**/
		for(var i=0; i<cards.length; i++){

			var card = cards[i];
			var type =  $(card).attr('class').replace('card','').trim();
			types.push(type);

			/**
				下面是键名递增的逻辑，防止键名重复
			**/
			var key = type + '_' + types.filter(function(x){return x === type;}).length;

			/**
				下面是获取键值的逻辑
			**/
			var value = null;

			switch(type){
				case 'title':
					value = $(card).children('input').eq(0).val();
					break;
				case 'text':
					value = $(card).children('textarea').eq(0).val();
					break;
				case 'topublic':
					value = function(){
						var topics = $(card).find('.topic:not(.templet)');
						topics = [].map.call(topics, function(topicSpan){
							return $(topicSpan).children('input').val().trim();
						}).filter(function(x){return !!x});

						return topics;
					}();
					break;
				default:
					break;
			}

			/**
				如果获取的值不为空 Content 中去
			**/

			if( ($.type(value)=='string' && !!value) || ($.type(value)=='array' && value.length) ){
				content[key] = value;
				isEmpty = false;
			}
		}

		content._id = _edit._id;

        return !isEmpty && content;
	},

	set: function(content){
		var page = $('#page_edit');

		/**
			第一步：获取 content 的 key value 值
		**/
		for(key in content){
			var value = content[key];

			//解析 key 的类型 type
			var type = key.replace(/_\d+$/,'');

			var card = null;

			//根据不同的 key 填充 page_edit
			switch(type){
				case 'title':
					page.children('.title.card').find('input').eq(0).val( value );
					break;
				case 'text':
					card = page.children('.text.card.templet').clone().removeClass('templet');
					card.find('textarea').eq(0).val( value );
					break;
				case 'topublic':
					/**
						找出所有的 topic 值并展示出来
					**/
					for(i in value){
						var topicSpan = $('#topublic_card').find('.topic.templet').clone().removeClass('templet');
						topicSpan.find('input').val( value[i] );
						$('#topublic_card').find('.topic.templet').eq(0).before( topicSpan );
					}

					//这里的数据直接插入，不用添加新的 card
					continue;
					break;
				case '_id':
					_edit._id = value;
					console.log('set'+value);
					break;
				case 'md5person':
					//判断是否和当前用户相符
					if( localStorage.person && JSON.parse(localStorage.person) && JSON.parse(localStorage.person).md5email == value){
					}else{
					//如果不是当前用户，嘿嘿，不能编辑，不能发表，不能删除
						page.find('.hide-with-guest').addClass('hide');
						page.find('input,textarea').attr('readonly','');
					}
					break;
				default:
					break;
			} //switch end

			page.find('.templet').eq(0).before(card);

		} //for end

        setTimeout(function(){page.find('textarea').change();});
		page.removeClass('no-data');
	}
};

//全局过滤器配置
$(function(){
    //交互指令里面的过滤器
    $(window).data('active',function(noop,select){
        $(select).addClass('active').siblings().removeClass('active');
    }).data('unactive',function(noop,select){
        $(select).removeClass('active');
    });

    //需用的方法
    $(window).data('getUserInfo',function(){$.callCount['getUserInfo'] = ($.callCount['getUserInfo']||0)+1;
        var userInfo = JSON.parse( localStorage.person || '{}' );
        return userInfo;
    }).data('resetEditPage',function(_id){$.callCount['resetEditPage'] = ($.callCount['resetEditPage']||0)+1;
        console.log(_id);

        //初始化数据
        var page = $('#page_edit');
		page.addClass('no-data');
		page.find('.card:not(.templet):not(.topublic):not(.title)').remove();
		$('#topublic_card').find('.topic:not(.templet)').remove();
		page.find('.hide-with-guest').removeClass('hide');
		page.find('input,textarea').removeAttr('readonly');

        //有id开id，没id开草稿，没草稿开空窗
        if(_id){
            findContent({_id: _id}, function(results){
                console.log(results);
                _edit.set(
                    (results && results[0]) || {
                        title_1: '没有找到数据',
                        text_1: ''
                    }
                );
            });
        }else{
            storedb('_draft').find({},function(err, results){
                _edit.set(
                    (results && results[0]) || {
                        _id: new Date().valueOf()+''+Math.random(),
                        title_1: '',
                        text_1: ''
                    }
                );
            });
        }
    });

    //编辑窗口交互逻辑
    $(window).data('addCard',function(){
		var type = $(this).attr('type');

		var page = $('#page_edit');
		var newCard = page.children('.templet.card.'+type).clone().removeClass('templet');
		page.children('.card.templet').eq(0).before( newCard );
		newCard.find('input,textarea').eq(0).focus();
    }).data('deleteCard',function(){
		var deleteBtn = $(this);
		var card = deleteBtn.closest('.card');

		/**
			标题卡片判断，如果是标题卡片，尝试删除整片文章
		**/

        var content = card.find('input,textarea').eq(0).val().trim();
        var isTitle = card.hasClass('title');

        if(isTitle){
            confirm('删除后将无法恢复！\n你确定删除整篇内容？') && removeContent({_id: _edit._id}, function(data){
				if(data.err){
					$.alert(data.err);
				}else if(data==1){
					$.alert( '成功删除'+data+'条记录！' );
                    $('#page_topic').update('删除文章成功！');
                    $('#page_edit .cancel').click();
				}
    		})
        }else if(content){
            confirm('已经填写了一些东西了\n你确定删除吗？') && card.remove()
        }else{
            card.remove()
        }
	}).data('addTopic',function(){
		var addBtn = $('#add_topic');
		var newTopic = $('#topublic_card').find('.topic.templet').clone().removeClass('templet');
		addBtn.before( newTopic );
		newTopic.find('input').focus();
    }).data('deleteTopic',function(){
		$(this).closest('.topic').remove();
    }).data('publishTopic',function(){
		var content = _edit.get();
		if( !!content ){
			console.log('cid'+content._id);
			console.log('eid'+_edit._id);

			saveContent( content , function(data){
				if(data==1){
					localStorage._draft = '[]';
					$.alert('发布成功');
                    $('#page_topic').update('新文章发布成功！');
                    $('#page_edit .cancel').click();
				}else{
					data.err && $.alert(data.err);
				}
			});
		}else{
			$.alert('没有保存任何内容！',false);
		}
    });

    //登录注册专用
    $(window).data('login',function(){
        //发送请求，取到 session 值
    	$.post('/login', $('#form_login').serialize(), function(data){
    		localStorage.person = JSON.stringify(data);
    		if(data.session){
                $('.cancel').click();
                $.alert('Login Success !');
    			$('#main_header').update('login success');
    		}else{
    			//登录失败
    			$.alert(data.err,false);
    		}
    		$('input[type=password]').val('');
    	});
    }).data('logout',function(){
    	var session = JSON.parse( localStorage.person ).session;
        delete localStorage.person;
        $.alert('本地数据清理成功！');
    	$.post('/logout',{session:session},function(data){
            $.alert(data);
    	});
        $('#main_header').update('logout success');
    }).data('register',function(){
    	//发送请求，取到 session 值
    	$.post('/register', $('#form_register').serialize(), function(data){
    		localStorage.person = JSON.stringify(data);
    		if(data.session){
    			//注册成功
                $.alert('恭喜你，注册成功！');
    			$('#main_header').update('register success');
                $('.cancel').click();
    		}else{
    			//注册失败
    			$.alert(data.err,false);
    		}
    		$('input[type=password]').val('');
    	});
    });
});

/**
	发表
	saveContent({
		name: 'yuanoook',
		email: 'yuanoook@foxmail.com',
		password: 'ilovemc100'
	});
**/
function saveContent(content, callback){
	/**
		session 时间验证，超过一个小时要求重新登陆
	**/
	if( localStorage.person && JSON.parse( localStorage.person ).session){
		if( JSON.parse(JSON.parse(localStorage.person).session).time < new Date().valueOf() - 3600000 ){
			return $.alert("登陆已经失效，请重新登陆！");
		}
	}else{
		return $.alert("你还没有登陆！");
	}

	if( localStorage.person && JSON.parse( localStorage.person ).session ){
	//已经有过登陆记录
	}else{
	//没有登陆记录
		return $.alert('你还没有登陆呢，亲！');
	}

	var session = JSON.parse( localStorage.person ).session,
		command = 'save',
		arg = {
			collection: 'contents',
	       	data: arguments[0]
	    };

	//Post 数据
	$.post('/post', {
		session: session,
	    command: command,
	    arg: JSON.stringify( arg )
	}, function (data) {
	    typeof callback == 'function' && callback(data);
	});
}

/**
	查询内容
	findContent({
	    _id: '54f92bf386d72d42022edf7a'
	});
**/
function findContent(data, callback){
    console.log(data);
	//Post 数据
    $.ajax({
        url: '/post',
        type: 'POST',
        cache: true,
        data: {
    		session: localStorage.person && JSON.parse( localStorage.person ).session,
    	    command: 'find',
    	    arg: JSON.stringify({
    			collection: 'contents',
    	       	data: data
    	    })
    	},
        success: callback || $.noop
    });
}

function removeContent(data, callback){

	var session = localStorage.person && JSON.parse( localStorage.person ).session;

	var command = 'remove',
		arg = {
			collection: 'contents',
	       	data: arguments[0]
	    };

	//Post 数据
	$.post('/post', {
		session: session,
	    command: command,
	    arg: JSON.stringify( arg )
	}, function (data) {
	    typeof callback=='function' && callback(data);
	});
}
