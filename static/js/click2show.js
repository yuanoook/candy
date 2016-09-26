function clickToShow(selector) {
    var isShowing = false,
        isMouseDown = false;
    var img, tmp_bg, tmp_img, img_start_pos, mouse_start_pos, img_start_state;
 
    $('html').on('click', selector, function () {
        cts_initialize();
 
        img = $(this);
 
        tmp_bg = $('<div id="click_to_show_tmp_bg">').css({
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 1000000000000
        });
 
        //显示缩放状态和关闭按钮
        var title = $('<div>').css({
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%,0)',
            width: '500px',
            height: '60px',
            background: 'rgba(0,0,0,.5)',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '60px',
            fontSize: '24px',
            zIndex: 10000000,
        }).html('鼠标滚动 / 上下键缩放：')
            .append(
            $('<span id="click_to_show_tmp_img_scale">').html('100%')).appendTo(tmp_bg);
 
        title.clone().html('[关闭]').css({
            right: 0,
            left: '',
            width: '120px',
            cursor: 'pointer',
            transform: '',
        }).on('click', tmp_bg.remove)
            .appendTo(tmp_bg);
 
 
        tmp_img = $('<img id="click_to_show_tmp_img">').attr('src', img.attr('src')).on('mousedown', function (event) {
            isMouseDown = true;
            mouse_start_pos = {
                x: event.clientX,
                y: event.clientY
            };
            img_start_pos = {
                x: parseInt(tmp_img.css('left')),
                y: parseInt(tmp_img.css('top'))
            };
            return false;
        }).on('click', function () {
            return false;
        }).on('mouseup', function () {
            isMouseDown = false;
            return false;
        });
 
        /**
            imgReady 能准确判断图片大小，解决 safari 图片长宽读 0 问题
        **/
        imgReady(img.attr('src'), function () {
            tmp_bg.append(tmp_img).appendTo($('body')).click(function () {
                $(this).remove();
            });
     
            img_start_state = {
                width: this.width,
                height: this.height
            };
     
            fix_tmp_img();
     
            isShowing = true;
        });
    });
 
    $('html').on('mousewheel', '#click_to_show_tmp_img', function (event) {
        if (isShowing) {
            var e = event.originalEvent;
            var step = e.wheelDelta;
 
            var start_state = {
                width: parseInt(tmp_img.css('width')),
                height: parseInt(tmp_img.css('height')),
                top: parseInt(tmp_img.css('top')),
                left: parseInt(tmp_img.css('left')),
                offsetX: event.offsetX,
                offsetY: event.offsetY
            }
 
            if (step < 0) {
                if( start_state.width / img_start_state.width > 5 ){
                    return false;
                }
                //放大操作
                tmp_img.css({
                    width: start_state.width * 1.2 + 'px',
                    left: start_state.left - start_state.offsetX * .2 + 'px',
                    top: start_state.top - start_state.offsetY * .2 + 'px'
                });
 
                $('#click_to_show_tmp_img_scale').html(
                (start_state.width * 1.2 / img_start_state.width * 100 + '%').replace(/\.\d*(?=\%)/, ''));
            } else {
                if( start_state.width / img_start_state.width < .2 ){
                    return false;
                }
                //缩小操作
                tmp_img.css({
                    width: start_state.width * .8 + 'px',
                    left: start_state.left + start_state.offsetX * .2 + 'px',
                    top: start_state.top + start_state.offsetY * .2 + 'px'
                });
 
                $('#click_to_show_tmp_img_scale').html(
                (start_state.width * .8 / img_start_state.width * 100 + '%').replace(/\.\d*(?=\%)/, ''));
            }
 
            return false;
        }
    });

    $('html').on('mousewheel', '#click_to_show_tmp_bg', function(){
        return false;
    });
 
    $('html').on('keydown', function (event) {
        if (isShowing) {
            var e = event.originalEvent;
            var step = e.wheelDelta;
 
            if (e.keyCode != 38 && e.keyCode != 40) return;
 
            var start_state = {
                width: parseInt(tmp_img.css('width')),
                height: parseInt(tmp_img.css('height')),
                top: parseInt(tmp_img.css('top')),
                left: parseInt(tmp_img.css('left'))
            }
 
            if (e.keyCode == 38) {
                if( start_state.width / img_start_state.width > 5 ){
                    return false;
                }
                //放大操作
                tmp_img.css({
                    width: start_state.width * 1.2 + 'px',
                    left: start_state.left - start_state.width * .1 + 'px',
                    top: start_state.top - start_state.height * .1 + 'px'
                });
                $('#click_to_show_tmp_img_scale').html(
                (start_state.width * 1.2 / img_start_state.width * 100 + '%').replace(/\.\d*(?=\%)/, ''));
                return false;
 
            } else if (e.keyCode == 40) {
                if( start_state.width / img_start_state.width < .2 ){
                    return false;
                }
                //缩小操作
                tmp_img.css({
                    width: start_state.width * .8 + 'px',
                    left: start_state.left + start_state.width * .1 + 'px',
                    top: start_state.top + start_state.height * .1 + 'px'
                });
                $('#click_to_show_tmp_img_scale').html(
                (start_state.width * .8 / img_start_state.width * 100 + '%').replace(/\.\d*(?=\%)/, ''));
                return false;
            }
 
        }
    });
 
    $('html').on('mousemove', function (event) {
        if (isMouseDown) {
            var change_pos = {
                x: event.clientX - mouse_start_pos.x,
                y: event.clientY - mouse_start_pos.y
            };
 
            tmp_img.css({
                top: img_start_pos.y + change_pos.y + 'px',
                left: img_start_pos.x + change_pos.x + 'px'
            });
        }
    });
 
    $('html').on('mouseup', function () {
        cts_initialize();
        return false;
    });
 
    function fix_tmp_img() {
        var tmp_img = $('#click_to_show_tmp_img');

        tmp_img.css({
            position: 'absolute',
            top: tmp_bg.height() / 2,
            left: tmp_bg.width() / 2,
            marginTop: -img_start_state.height / 2,
            marginLeft: -img_start_state.width / 2
        });
    }
 
    function cts_initialize() {
        img = null;
        tmp_bg = null;
        tmp_img = null;
        isShowing = false;
        isMouseDown = false;
        start_pos = null;
        img_start_state = null;
    }
}

var imgReady = (function () {
    var list = [], intervalId = null,
 
    // 用来执行队列
    tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
            list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
    },
 
    // 停止所有定时器队列
    stop = function () {
        clearInterval(intervalId);
        intervalId = null;
    };
 
    return function (url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
 
        img.src = url;
 
        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        };
 
        width = img.width;
        height = img.height;
 
        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };
 
        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            ) {
                ready.call(img);
                onready.end = true;
            };
        };
        onready();
 
        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
 
            load && load.call(img);
 
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };
 
        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();