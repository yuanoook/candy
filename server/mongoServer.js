var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongodb_connect = require('fs').readFileSync(__dirname+'/.mongodb_connect','utf8');

var database;

MongoClient.connect(mongodb_connect, {
    db: {
        native_parser: false
    },
    server: {
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {}
}, function (err, db) {
    if(err) console.log( err.toString() );
    database = db;
});

/**
    插入数据的封装
    insert({
        collection: 'contents',
        data: {
            name: '觅创100',
            detail: '{from:"",main:"",to:""}',
            type: 'topic',
            person: 'yuanoook@foxmail.com',
            topic: '觅创100'
        },
        success: s_callback,
        fail: f_callback
    })
**/

function save() {
    var collection = database.collection( arguments[0]['collection'] );

    var s_callback = arguments[0]['success'] || function () {};
    var f_callback = arguments[0]['fail'] || function () {};

    collection.save(arguments[0]['data'],function(err, result){
        if(err) return f_callback(err);
        s_callback(result);
    });
}

/**
    清除数据的封装
    remove({
        'collection': 'topics',
        '_id': 'xxxxx',
        'success': s_callback,
        'fail': f_callback
    })
**/

function remove() {

    var collection = database.collection( arguments[0]['collection'] );
    var data = arguments[0]['data'];
    var s_callback = arguments[0]['success'] || function () {};
    var f_callback = arguments[0]['fail'] || function () {};

    if(data._id && /^[0-9a-z]{24}$/.test(data._id) ){
    //如果参数里面有 _id 并且是 mongodb 原生的 _id
        data._id = ObjectID( data._id );
    }

    collection.remove(data, function (err, result) {
        if (err) return f_callback(err);
        s_callback(result);
    });
}

/**
    标记删除的封装
    delete({
        'collection': 'comments',
        '_id': 'xxxxxx',
        'person': 'root@mc100.com',
        'success': s_callback,
        'fail': f_callback
    })
**/

function delete_mark(){
    var _id = arguments[0]['_id'];
    var delete_info = arguments[0]['person'] + '|' + new Date().getTime();

    var s_callback = arguments[0]['success'] || function () {};
    var f_callback = arguments[0]['fail'] || function () {};

    update({
        _id: _id,
        collection: arguments[0]['collection'],
        data: {
            'delete_info': delete_info
        },
        success: s_callback,
        fail: f_callback
    });
}

/**
    查询数据的封装
    find({
        'collection': 'person',
        'data': {
            _id: 'xxxxx'
        },
        'success': s_callback,
        'fail': f_callback
    })
**/

function find() {

    var collection = database.collection( arguments[0]['collection'] );
    var data = arguments[0]['data'];
    var s_callback = arguments[0]['success'] || function () {};
    var f_callback = arguments[0]['fail'] || function () {};

    if(data._id && /^[0-9a-z]{24}$/.test(data._id) ){
    //如果参数里面有 _id 并且是 mongodb 原生的 _id
        data._id = ObjectID( data._id );
    }

    collection.find( data ).toArray(function(err,results){
        if(err) return f_callback(err);
        return s_callback(results);
    });
}

/**
    更新数据的封装
    update({
        '_id': 'xxxxxx',
        'collection': 'comments',
        'data': {
            detail: '{}'
        },
        'success': s_callback,
        'fail': f_callback
    })
**/

function update(){
    var _id = arguments[0]['_id'];
    var collection = database.collection( arguments[0]['collection'] );
    var data = arguments[0]['data'];
    var s_callback = arguments[0]['success'] || function () {};
    var f_callback = arguments[0]['fail'] || function () {};

    if(_id && /^[0-9a-z]{24}$/.test(_id) ){
    //如果参数里面有 _id 并且是 mongodb 原生的 _id
        _id = ObjectID( _id );
    }

    collection.update({_id: _id}, { $set: data }, function(err,results){
        if(err) return f_callback(err);
        return s_callback(results);
    });
}

exports.save = save;
exports.remove = remove;
exports.delete_mark = delete_mark;
exports.find = find;
exports.update = update;
