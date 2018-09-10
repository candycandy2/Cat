
//清空FunctionList
function clearFunctionList() {
    var function_list = window.localStorage.getItem('FunctionList');

    if(function_list !== null) {
        window.localStorage.removeItem('FunctionList');
    }
}