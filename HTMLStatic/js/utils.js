function commonXHRHandler (xhr, ev){
    if (xhr.readyState == 4 && xhr.status == 200) {
        let resp = JSON.parse(xhr.response);
        // console.log(resp);
        if (resp.code != 200) {
            showTips(resp.msg);
            return;
        }
    }else if(xhr.readyState == 4 && xhr.status != 200){
        showTips("无法连接到服务器");
        return;
    }
}

function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
    location.reload()
}