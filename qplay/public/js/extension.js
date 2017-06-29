$(function() {
var extSessionStorage = function(namespace){
    var sessionStorage = window.sessionStorage || {}; //為sessionStorage作向下相容
    if(typeof namespace !== "string") {
            throw new Error("extSessionStorage: Namespace must be a string");
    }
    var getRealKey = function(key){ //產生正確的sessionStorage key
            return [namespace,".",key].join('');
    };
    var mainFunction = function(key, value){
            var realKey = getRealKey(key);
            if(value === undefined){
                    return sessionStorage[realKey];
            } else {
                    return sessionStorage[realKey] = value;
            }
    };
    mainFunction.remove = function(key){
            var realKey = getRealKey(key);
            delete sessionStorage[realKey];
    };
    return mainFunction;
};

window.ExtSessionStorage = extSessionStorage; //開啟對外入口，此範例會開在window.ExtSessionStorage
});