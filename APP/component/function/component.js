
var component = {

    clear: function (item) {
        
        var function_list = window.localStorage.getItem(item);

        if(function_list !== null) {
            window.localStorage.removeItem(item);
        }
        
    },
    refresh: function (item) {
        if(item == 'FunctionList') {
            getFunctionList();
        }
    }
    
}