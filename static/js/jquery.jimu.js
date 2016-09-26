//jQuery $ 扩展
$.extend({
    jimuRootFlag: '[·root]', //启动器
    jimuSrcFlag: '[·],[·for]', //决定 srcData Context，自定义作用域链
    jimuKidFlags: '[·],[·if],[·for],[·href],[·follow]', //决定 getKids
    jimuFlags: '[·],[·if],[·for],[·href],[·follow],[·root]', //供统计使用
    jimuRepeatMsgsLimit: 2,
    callCount: {},
    generateId: function(){
        return ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
    },
    findElementBySrcId: function(srcId){
        var result;
        $( $.jimuFlags ).each(function(){
            if( $(this).data('·id')===srcId ){
                result = this;
                return false;
            }
        });
        return result;
    }
});

//jQuery $.fn 扩展
$.fn.extend({
    ajaxCache: function(url){$.callCount['ajaxCache'] = ($.callCount['ajaxCache']||0)+1;
        var callback,result = {then:function(func){callback=func;}};
        var method = 'GET';
        var data = {};
        var form = $(this).attr('·form');
        if(form){
            method = $(form).attr('method') || 'GET';
            data = $(form).serialize();
        }

        $.ajax({
            type: method,
            dataType: 'json',
            cache: $(this).attr('cache') ? true : false,
            url: url,
            data: data
        }).then(function(data){
            callback(data);
        });

        return result;
    },
    lineUpToAjax: function(url){$.callCount['lineUpToAjax'] = ($.callCount['lineUpToAjax']||0)+1;
        var _this = this;
        var callback ={lineUpTime: new Date().valueOf(),func: $.noop};
        var result = {then:function(func){callback.func=func;}};
        $(this).ajaxCache(url).then(function(data){
            var latestCallBackLineUpTime = $(_this).data('·lastCallBackLineUpTime') || 0;
            if( latestCallBackLineUpTime < callback.lineUpTime ){
                $(_this).data('·lastCallBackLineUpTime',callback.lineUpTime);
                callback.func(data);
            }else{
                console.warn(
                    'Try callback too late' +
                    '\nMore info: $.findElementBySrcId("' + $(_this).getSrcId() + '")'
                );
            }
        });
        return result;
    },
    getRemoteData: function(url){$.callCount['getRemoteData'] = ($.callCount['getRemoteData']||0)+1;
        var callback,result = {then:function(func){callback=func;}};
        $(this).lineUpToAjax(url).then(function(data){
            callback(data);
        });
        return result;
    },
    lookslikeInput: function(){$.callCount['lookslikeInput'] = ($.callCount['lookslikeInput']||0)+1;
        return ['OPTION','SELECT','INPUT','TEXTAREA'].indexOf( $(this).prop('tagName') )>-1;
    },
    getKids: function(){$.callCount['getKids'] = ($.callCount['getKids']||0)+1;
        var _thisDom = $(this).get(0);
        //增加合法的 kid 类型 · ·href，合法的 parent 类型为 · ·root ·href
        return $(this).find( $.jimuKidFlags ).filter(function(){
            return $(this).parent().closest( $.jimuFlags ).get(0) === _thisDom;
        });
    },
    getSrcId: function(){$.callCount['getSrcId'] = ($.callCount['getSrcId']||0)+1;
        return $(this).data('·id') || $(this).data('·id',$.generateId()).data('·id');
    },
    getFollowers: function(){$.callCount['getFollowers'] = ($.callCount['getFollowers']||0)+1;
        return $(this).data('·followers') || $(this).data('·followers',[]).data('·followers');
    },
    follow: function($partner){$.callCount['follow'] = ($.callCount['follow']||0)+1;
        var _this = this;
        $(this).each(function(){
            var newFollower = $(this).get(0), followers = $partner.getFollowers();
            for(var i in followers) if(followers[i] === newFollower || $.contains(followers[i],newFollower)) return;
            followers.push( newFollower );
        });
        return this;
    },
    update: function(reason){$.callCount['update'] = ($.callCount['update']||0)+1;
        $(this).fire(reason).render();
    },
    fire: function(reason){$.callCount['fire'] = ($.callCount['fire']||0)+1;
        var originId = $.generateId();
        var newMsg = $.cache[originId] = {
            time: new Date().valueOf(),
            reason: reason,
            originId: originId,
            flowChain: [$(this).get(0)]
        };
        $(this).getUpdateMsgs().push(newMsg);
        return this;
    },
    getUpdateMsgs: function(){$.callCount['getUpdateMsgs'] = ($.callCount['getUpdateMsgs']||0)+1;
        return $(this).data('·updateMsgs') || $(this).data('·updateMsgs',[]).data('·updateMsgs');
    },
    getMsgByOriginId: function(originId){$.callCount['getMsgByOriginId'] = ($.callCount['getMsgByOriginId']||0)+1;
        var msgs = $(this).getUpdateMsgs();
        var result;
        msgs.forEach(function(msg){
            if(msg.originId === originId){
                result = msg;
            }
        });
        return result;
    },
    declare: function(audience){$.callCount['declare'] = ($.callCount['declare']||0)+1;
        var updateMsgs = $(this).getUpdateMsgs();
        var lastMsg = updateMsgs[updateMsgs.length-1];
        if(!lastMsg){ throw 'No motivate to update!';}
        var _this = this;
        var time = new Date().valueOf();
        $(audience).each(function(){
            if( lastMsg.flowChain.indexOf($(this).get(0))>-1 ) throw(
                'Declare update msg cyclically！\n' +
                'More info: ' +
                '\n$.findElementBySrcId("'+ $(this).getSrcId() +'")'+
                '\n$.cache["'+ lastMsg.originId +'"]'
            );
            $(this).acceptUpdateMsg({
                time: time,
                originId: lastMsg.originId,
                flowChain: lastMsg.flowChain.concat($(this).get(0))
            });
        });
        return this;
    },
    declareUpdate: function(){$.callCount['declareUpdate'] = ($.callCount['declareUpdate']||0)+1;
        return $(this).declare( $(this).getKids().add($(this).getFollowers()) );
    },
    declareKids: function(){$.callCount['declareKids'] = ($.callCount['declareKids']||0)+1;
        return $(this).declare( $(this).getKids() );
    },
    declareFollowers: function(){$.callCount['declareFollowers'] = ($.callCount['declareFollowers']||0)+1;
        return $(this).declare( $(this).getFollowers() );
    },
    acceptUpdateMsg: function(updateMsg){$.callCount['acceptUpdateMsg'] = ($.callCount['acceptUpdateMsg']||0)+1;
        var updateMsgs = $(this).getUpdateMsgs();
        var length = updateMsgs.push(updateMsg);

        var repeatMsgCount = 0;
        for(var i=length-2;i>=0;i--) updateMsgs[i]['originId'] === updateMsg['originId'] && repeatMsgCount++;

        repeatMsgCount>0 && console.warn(
            'Accept ' + (repeatMsgCount+1) +
            ' update msgs from one originId'+
            ' !\n' +
            'More info: ' +
            '\n$.findElementBySrcId("' + $(this).getSrcId() + '")'+
            '\n$.cache["'+ updateMsg.originId +'"]'
        );

        if(repeatMsgCount>=$.jimuRepeatMsgsLimit) throw 'Accept too much msgs from one originId！';

        return $(this).render();
    },
    getContext: function(){$.callCount['getContext'] = ($.callCount['getContext']||0)+1;
        return (
            $(this).parent().closest($.jimuSrcFlag).length ? $(this).parent().closest($.jimuSrcFlag) : $(window)
        );
    },
    getVariable: function(name){$.callCount['getVariable'] = ($.callCount['getVariable']||0)+1;
        //通过层层上溯来找到对象
        return $(this).data(name) || $(this).getContext().getData(name);
    },
    setVariable: function(name,obj){$.callCount['getVariable'] = ($.callCount['getVariable']||0)+1;
        // .data 的同义词
        return $(this).data(name,obj);
    },
    getData: function(name){$.callCount['getData'] = ($.callCount['getData']||0)+1;
        //类 input 中查找 value
        if( name==='value' && $(this).lookslikeInput() ){
            return $(this).val();
        }

        if( name==='$value' ){
            //特殊模式，取当前数据源
            return $(this).getCoreValue();
        }

        if( name==="$key" ){
            //特殊模式，取当前数据源的 key
            return $(this).getCoreKey();
        }

        var nameArray = name.split('.');
        if(nameArray.length === 1){

            //全局变量中查找 目标变量
            if( $.isWindow($(this).get(0)) ){
                return $(this).data(name) || window[name];
            }

            return ( $(this).data('·') && $(this).data('·')[name] ) || $(this).getVariable(name);
        }else{
            var nameRoot = nameArray.shift();
            var subData = $(this).getData(nameRoot);
            nameArray.forEach(function(name){
                subData = !/null|undefined/.test( $.type(subData) ) ? subData[name] : subData;
            });
            return subData;
        }
    },
    setData: function(data){$.callCount['setData'] = ($.callCount['setData']||0)+1;
        var _this = this;
        var filtered = false;
        var filteredData;
        $(this).data('filters') && $(this).data('filters').forEach(function(filterName){
            var filter = $(_this).getVariable(filterName);
            if( $.type(filter)==='function' ){
                filteredData = filter(!filtered ? data : filteredData);
                filtered = true;
            }
        });
        data = filtered ? filteredData : data;

        /null|undefined/.test($.type(data)) && (data='');
        /boolean/.test($.type(data)) && ( data=data.toString() );

        $(this).data('·', data);
        return this;
    },
    eval: function(expression){$.callCount['eval'] = ($.callCount['eval']||0)+1;
        var _this = this;
        var exprArray = expression.split('|');
        var evalbreak = false;
        var result;

        exprArray.forEach(function(expr){
            if(evalbreak){return;}

            var subExprArray = expr.split(':');
            var rootExpr = subExprArray.shift();
            var rootExprData = $(_this).getData(rootExpr);
            var tmpResult;
            switch( $.type(rootExprData) ){
                case 'function':
                    tmpResult = rootExprData.apply(_this,[result].concat(subExprArray));
                    evalbreak = tmpResult === '·reject' ? true : evalbreak;
                    result = !evalbreak ? tmpResult : result;
                    break;
                default:
                    result = rootExprData;
                    break;
            }
        });

        return result;
    },
    evalAttr: function(attrName){$.callCount['evalAttr'] = ($.callCount['evalAttr']||0)+1;
        return $(this).eval($(this).attr(attrName));
    },
    getCoreValue: function(){$.callCount['getCoreValue'] = ($.callCount['getCoreValue']||0)+1;
        return $(this).data('·');
    },
    getCoreKey: function(){$.callCount['getCoreKey'] = ($.callCount['getCoreKey']||0)+1;
        return $(this).attr('·') || $(this).attr('·for');
    },
    render: function(){$.callCount['render'] = ($.callCount['render']||0)+1;
        if( this.length>1 ){ return this.each(function(){
            $(this).render();
        });}

        var _this = this;
        var src = $(this).getCoreKey();

        if( $.type(src)!=='string' ){
            //没有指明数据源，直接showData 往下走
            return this.showData();
        }

        var allReady = true;
        var srcArray = src.split('|');
        var dataSrc = srcArray.shift();
        $(this).data('filters',srcArray);

        // dataSrc = "/data/detail?stockid=@(#stockid){value}&start=@(#startPageIndex){value}&length=@(#rowsPerPage){value}";
        // @( contextSelector ){ keyname }
        dataSrc = dataSrc.replace(/\@\(([^\)]*)?\)\{([^\}]*)?\}/g,function(str,selector,key,start){
            $(_this).follow( $(selector) );
            var result = $(selector).getData(key).toString();
            allReady = !!result && allReady;
            return result;
        });

        if( !allReady ){
            return console.warn( 'Dependences are not allReady !\n' + 'More info: $.findElementBySrcId("' + $(this).getSrcId() + '")');
        }

        this.addClass('rendering').removeClass('rendered');

        if( /^\//.test(dataSrc) ){
            //远程数据模式
            $(this).getRemoteData(dataSrc).then(function(data){
                _this.setData(data).showData();
            });
        }else{
            $(this).setData( $(this).getContext().getData(dataSrc) ).showData();
        }

        return this;
    },
    showData: function(){$.callCount['showData'] = ($.callCount['showData']||0)+1;
        var _this = this;
        $(this).data('·tplReady') || $(this).data( '·tpl', $(this).html() ).data('·tplReady',true);
        var data = $(this).data('·');
        var tpl = $(this).data('·tpl');

        // 特殊 Flag 优先
        if( $(this).attr('·if') ){
            if( !$(this).evalAttr('·if') ){
                $.type($(this).data('·afterRender'))==='function' && $(this).data('·afterRender')(); //todo: 增加不管 render 成功失败的 default 执行功能选项
                return $(this).removeClass('if-pass').addClass('if-stuck').hide();
            }else{
                $(this).addClass('if-pass').removeClass('if-stuck').show();
            }
        }

        $(this).attr('·follow') && $($(this).attr('·follow')).each(function(){
            $(_this).follow( $(this) );
        });

        //特殊DOM元素行为及回调设置
        switch( $(this).prop('tagName') ){
            case 'A':
                if( $(this).attr('·href') ){
                    var allReady = true;
                    var href = $(this).attr('·href').replace(/\@\(([^\)]*)?\)\{([^\}]*)?\}/g,function(str,selector,key,start){
                        $(_this).follow( $(selector) );
                        var result = $(selector).getData(key).toString();
                        allReady = !!result && allReady;
                        return result;
                    });
                    if(allReady){
                        $(this).attr('href',href);
                    }else{
                        $(this).attr('href','javascript:;');
                        return console.warn( 'Dependences are not allReady !\n' + 'More info: $.findElementBySrcId("' + $(this).getSrcId() + '")');
                    }
                }
                break;
            case 'INPUT':
                $(this).on('change',function(){
                    $(this).fire( 'Input value changed!' ).declareFollowers();
                });
                break;
            case 'SELECT':
                $(this).on('change',function(){
                    $(this).fire( 'Select value changed!' ).declareFollowers();
                });
                break;
        }

        if( $(this).attr('·for') && tpl ){
            //数组单独设置内部渲染结束逻辑
            $(this).data('·afterRender',function(){
                //后行 declareFollowers
                $(_this).declareFollowers();
                $(_this).attr('·afterRender') && $(_this).evalAttr('·afterRender');
                return $(_this).removeClass('rendering').addClass('rendered');
            });

            //上面这个 if 判断是为了ie7
            if( $.type(data)==='array' ){
                $(this).html(
                    data.map(function(value,key){
                        var kid = $( tpl.replace(/\·each(\=\"\")?/, "·=\'" + key + "\'") );
                        //最后一个元素设置渲染回调，通知父对象渲染结束
                        key==data.length-1 && kid.data('·afterRender',function(){
                            $.type($(_this).data('·afterRender'))==='function' && $(_this).data('·afterRender')();
                        });
                        return kid;
                    })
                );
            }else{
                var kidsStr = '';
                for(var key in data) kidsStr += tpl.replace(/\·each(\=\"\")?/, "·=\'" + key + "\'");
                var $kids = $(kidsStr);
                $kids.last().data('·afterRender',function(){
                    $.type($(_this).data('·afterRender'))==='function' && $(_this).data('·afterRender')();
                });
                $(this).html($kids);
            }

            //先行 declareKids
            return $(this).declareKids();
        }

        !tpl && (
            $(this).lookslikeInput() ? $(this).val(data) : $(this).html(data||'')
        );
        $(this).declareUpdate();
        $.type($(this).data('·afterRender'))==='function' && $(this).data('·afterRender')();
        $(this).attr('·afterRender') && $(this).evalAttr('·afterRender');
        return this.removeClass('rendering').addClass('rendered');
    }
});
