function SogouImageSpider() {
	this.initialize.apply(this, arguments);
}

SogouImageSpider.prototype = {
    constructor: SogouImageSpider,
	initialize: function(){
	    this.url = "http://pic.sogou.com/pics";
		this.images = [];
    	this.blacklist = [
    		'baidu.com',
    		'bdimg',
    		'image.baidu',
    		'.gif',
    		'nipic',
    		'gexing.com',
    		'iyi8.com',
			'huitu.com',
			'safedog',
			'404',
			'pconline',
    		'jj20.com',
			'zhuoku.com'
    	];
	},
	get: function(query, width, height){
		var images = [];
		var data = {
			reqType: "ajax",
			query: query || '美女',
			cwidth: width || 0,
			cheight: height || 0
		}
		var url = this.setGetURL(this.url, data);

		/**
			遭遇美女，启用特殊情况
		**/
		if(query == '美女'){
			url = "http://image.sogou.com/pics/channel/getAllRecomPicByTag.jsp?category=%E7%BE%8E%E5%A5%B3&start=0&len=4262";
			httpGet(url, 'GBK', function(data){
				data = JSON.parse(data);

				if(!data.all_items){
					return console.log('没有数据');
				}

				var items = data.all_items;

				items.forEach(function(x,i,a){
					var src = x.pic_url || x.ori_pic_url;
					if(src && !this.blacklistHas(src) && this.images.indexOf(src)<0 ){
						this.images.push(src);
					}
				}.bind(this));

			}.bind(this));
			return;
		}


		httpGet(url, 'GBK', function(data){
			data = JSON.parse(data);

			// console.log(data);

			if(data.isForbiden){
				console.log('isForbiden');
			}

			if(!data.items){
				return console.log('没有数据');
			}

			var items = data.items;

			items.forEach(function(x,i,a){
				var src = x.pic_url_noredirect;
				if( !this.blacklistHas(src) && this.images.indexOf(src)<0 ){
					this.images.push(src);
				}
			}.bind(this));

		}.bind(this));
	},
    setGetURL: function(url, data){
        var search = '';
        for(i in data){
            search += ( i + '=' + encodeURIComponent( data[i] ) + '&' );
        }
        return url + "?" + search;
    },
    blacklistHas: function(src){
    	var isBlack = false;

    	for(i=0; i<this.blacklist.length; i++){
    		if( src.indexOf( this.blacklist[i] ) > -1 ){
    			isBlack = true;
    			break;
    		}
    	}

    	return isBlack;
    }
}
