var crypto = require('crypto');

//入口安检
function inputcheck(params){

    var arg = JSON.parse(params.arg);

    if( ['contents', 'comments'].indexOf( arg.collection ) < 0 ){
    	return false;
    }

	if(params.command){
		if( ['save', 'delete_mark', 'find', 'update', 'remove'].indexOf( params.command ) < 0 ){
			return false;
		}else{
			return params;
		}
	}

	return false;
}

//出口安检
function outputcheck(result){
	/**
		如果出口数据是数组
	**/
	for(var i=0; i<result.length; i++){

		//清除私人信息
		result[i] = clearPersonal( result[i] );
	}

	/**
		如果出口数据是对象
	**/
	//清除私人信息
	result = clearPersonal( result );

	return result;

	function clearPersonal(result){
		if( result.passwordmd5 ) delete result.passwordmd5;
		if( result.email ){
			result.md5email = md5( result.email );
			delete result.email;
		}
		if( result.person ){
			result.md5person = md5( result.person );
			delete result.person;
		}

		return result;
	}
}

function emailcheck(email){
	/**
		邮箱合法性检查
	**/
	email = email.replace(/(^\s*)|(\s*$)/g,"");

	if( isMail(email) ) return email;

	return false;

	function isMail(str){
    	return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str);
	}
}


/**
    md5 数据加密功能
**/
function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex');
};

exports.inputcheck = inputcheck;
exports.outputcheck = outputcheck;
exports.emailcheck = emailcheck;
exports.md5 = md5;
