var component = {

    clear: function() {

        var function_list = window.localStorage.getItem('FunctionList');
        if (function_list !== null) {
            window.localStorage.removeItem(item);
        }

    },
    refresh: function() {
        getFunctionList();
    }

}