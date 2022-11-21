import cache from './in_memory_cache';
import AsyncStorage from '@react-native-community/async-storage';

//Helpers
const storeData = async (key, value) => {
  try {
    let saveKey = '@' + key;
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(saveKey, jsonValue)
  } catch (e) {
    console.log(e);
  }
}

const getData = async (key) => {
  try {
    let getKey = "@" + key;
    const jsonValue = await AsyncStorage.getItem(getKey)
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch(e) {
    console.log(e);
  }
}

//Methods
const saveCache = async function(){
  return storeData("cache", cache.in_memory_cache);
}

const loadCache = async function(scope){
  const cache_fetched = await getData("cache");
  cache.in_memory_cache = cache_fetched;
  if(cache_fetched == undefined || cache_fetched == null || (Object.keys(cache_fetched).length === 0 && cache_fetched.constructor === Object)){
    cache.in_memory_cache = {
      "request_count": 0,
      "recent_connections": [],
      "messages_screen": [],
      "pending_requests": [],
      "friends": [],
      "matches": [],
      "sent_requests": [],
      "blocked_users": [],
      "conversations": {},
      "friends_profiles": {},
      "dating_profiles": {},
      "last_audit": 0,
      "notification_count": 0,
      "lastScreen": ""
    };
  }
  auditCache();
}

let auditCache = function(){
  if((Math.round((new Date()).getTime()/1000) - cache.in_memory_cache.last_audit) > 604800){
    //Runs after one week after last_audit
    //Audit friends profiles
    for (var key in cache.in_memory_cache.friends_profiles) {
      var obj = cache.in_memory_cache.friends_profiles[key];
      if((Math.round((new Date()).getTime()/1000) - obj.fetched) > 604800){
        delete cache.in_memory_cache.friends_profiles[key];
      }
    }
    //Audit dating profiles
    for (var key in cache.in_memory_cache.dating_profiles) {
      var obj = cache.in_memory_cache.dating_profiles[key];
      if((Math.round((new Date()).getTime()/1000) - obj.fetched) > 604800){
        delete cache.in_memory_cache.dating_profiles[key];
      }
    }
    //Audit Conversations
    for (var key in cache.in_memory_cache.conversations) {
      var obj = cache.in_memory_cache.conversations[key];
      if((Math.round((new Date()).getTime()/1000) - obj.fetched) > 604800){
        delete cache.in_memory_cache.conversations[key];
      }
    }
    //Replace last_audit time and save
    cache.in_memory_cache.last_audit = Math.round((new Date()).getTime()/1000);
    saveCache();
  }
}

module.exports = {saveCache, loadCache};
