var storedb = function(collectionName){
  var cache = [], err, ls; 
  if(localStorage[collectionName]){
    ls = JSON.parse(localStorage[collectionName]);
  }
  
  return {
    insert: function(obj,callback){
      if(ls){
        obj["_id"] = obj["_id"] || new Date().valueOf()+''+Math.random();
        for(var i = 0; i < ls.length; i++){
          cache.push(ls[i])
        }
        cache.push(obj);
        localStorage.setItem(collectionName,JSON.stringify(cache));
        callback(err,obj);
      } else {
        obj["_id"] = new Date().valueOf();
        cache.push(obj);
        localStorage.setItem(collectionName,JSON.stringify(cache));
        callback(err,obj);
      }
    },
    find: function(obj,callback){
      if(arguments.length == 0){
        if(ls){
          var result = [];
          for(var i = 0; i < ls.length; i++){
            cache.push(ls[i]);
          }
          return cache;
        }
      } else {
        if(ls){
          var result = [];

          for(var i = 0; i < ls.length; i++){
            cache.push(ls[i]);
          }
          if( !isOwnEmpty(obj) ){
            for(var i = 0; i < cache.length; i++){
              var isSame = true;
              for(var key in obj){
                if(cache[i][key] != obj[key]){
                  isSame = false;
                  break;
                }
              }
              if(isSame){
                      result.push(cache[i]);
              }
            }
          }else{
            result = cache;
          }

          callback(err,result)
        } else {
          err = 'collection not exist';
          callback(err,result);
        }
        return result;
      }

      function isOwnEmpty(obj) 
      { 
          for(var name in obj) 
          { 
              if(obj.hasOwnProperty(name)) 
              { 
                  return false; 
              } 
          } 
          return true; 
      }
    },

    update: function(obj,upsert,callback){
      if(ls){
        for(var i = 0; i < ls.length; i++){
          cache.push(ls[i]);
        }
        for(var i = 0; i < cache.length; i++){
          var isSame = true;
          for(var key in obj){
            if(cache[i][key] != obj[key]){
                isSame = false;
            }
          }
        
          if(!isSame){
             continue;        
          }else{
              for(var upsrt in upsert){
                switch(upsrt){
                  case "$inc":
                  for(var newkey in upsert[upsrt]){
                    cache[i][newkey] = cache[i][newkey] + upsert[upsrt][newkey]
                  }
                  break;

                  case "$set":
                  for(var newkey in upsert[upsrt]){
                    cache[i][newkey] = upsert[upsrt][newkey]
                  }
                  break;

                  case "$push":
                  for(var newkey in upsert[upsrt]){
                    cache[i][newkey].push(upsert[upsrt][newkey])
                  }
                  break;

                  default:
                  err = 'unknown upsert';

                }
              }                
          }
        }
        localStorage.setItem(collectionName,JSON.stringify(cache))
        callback(err)

      } else {
        err = 'collection not exist';
        callback(err);
      }
    },

    remove: function(obj,callback){
      if(arguments.length == 0){
        localStorage.removeItem(collectionName)
      } else {
        if(ls){
          for(var i = 0; i < ls.length; i++){
            cache.push(ls[i]);
          }
          for(var i = 0; i < cache.length; i++){
             var isSame = true;
             for(var key in obj){
              if(cache[i][key] != obj[key]){
                isSame = false;
              }
            }
            
            if(!isSame){
                continue;
            }else{
                cache.splice(i,1);
            }
          }
          localStorage.setItem(collectionName,JSON.stringify(cache));
          callback(err);
        } else {
          err = 'collection not exist';
          callback(err);
        }
      }
    },
  }
}