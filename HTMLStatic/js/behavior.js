function input_Validate(e){
    switch(e.placeholder){
        case "手机号":
            if(e.value.length==11){
                e.className = "validInput"
            }else{
                e.className = "invalidInput"
            }
            break;
        case "密码":
            if(e.value.length>6){
                e.className = "validInput"
            }else{
                e.className = "invalidInput"
                
                let prop = document.createElement("div");
                prop.innerHTML = "<div name='removeable' class='wndInputRow'>密码太短啦</div>"
                regBox.appendChild(prop);
            }
            break;
        case "用户名":
            if(e.value.length>3){
                e.className = "validInput"
            }else{
                e.className = "invalidInput"
            }
            break;
    }
    

    
}


function likeToggle(that){
    // console.log(that.parentElement.parentElement)
    
    let hanashiID = rightContainer.getElementsByClassName("titleName")[0].id
    let xhr = new XMLHttpRequest()
    let data = {
        "ID":parseInt(hanashiID)
    }
    // console.log("SSS")
    let like = that.getElementsByClassName("like")
    // console.log(like.length)

    if(like.length == 1){   // not clicked -> clicked
        // console.log(that.getElementsByClassName("smiley")[0].className)
        document.getElementsByName("likeCombine_ico")[0].className = "ok"
        // console.log(that)
        like[0].className = "liked"
        xhr.open("POST","/wall/like",true)
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
        xhr.send(JSON.stringify(data))
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let resp = JSON.parse(xhr.response)
                if (resp.code != 200) {
                    if(resp.code == 201) alert(resp.msg);
                    return;
                }                
            }else if(xhr.readyState == 4 && xhr.status != 200){
                alert("无法连接到服务器")
                return
            }
        }
    }else { // clicked -> not clicked
        // console.log(that)
        document.getElementsByName("likeCombine_ico")[0].className = "smiley"
        let liked = that.getElementsByClassName("liked")
        liked[0].className = "like"
        xhr.open("POST","/wall/unlike",true)
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
        xhr.send(JSON.stringify(data))
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let resp = JSON.parse(xhr.response)
                if (resp.code != 200) {
                    if(resp.code == 201) alert(resp.msg);
                    return;
                }
                
            }else if(xhr.readyState == 4 && xhr.status != 200){
                alert("无法连接到服务器")
                return
            }
        }
    }
    
}