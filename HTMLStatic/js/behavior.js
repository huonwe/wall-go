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

function likeToggle_(){
    let count = rightContainer.getElementsByClassName("thumbCount")[0]
    console.log(count)
    let like_ = rightContainer.getElementsByClassName("like_")
    // console.log(likeStyle)
    if(like_.length == 1){
        like_[0].className = "liked_"
        count.innerText = parseInt(count.innerText) + 1
    }else{
        rightContainer.getElementsByClassName("liked_")[0].className = "like_"
        count.innerText = parseInt(count.innerText) - 1
        // likeStyle.className = "like_"
    }
}

function likeToggle(that){
    // console.log(that.parentElement.parentElement)
    // console.log(rightContainer)
    rightContainer.getElementsByClassName("likeBtn")[0].setAttribute("disable",true)
    let hanashiID = rightContainer.getElementsByClassName("titleName")[0].id
    let xhr = new XMLHttpRequest()
    let data = {
        "ID":parseInt(hanashiID)
    }
    // let likeStyle = document.getElementsByName("likeStyle")[0]
    likeToggle_()
    let like_ = rightContainer.getElementsByClassName("like_")
    if(like_.length == 0){   // not clicked -> clicked
        xhr.open("POST","/wall/like",true)
    }else { // clicked -> not clicked
        xhr.open("POST","/wall/unlike",true)
    }
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
    try{
        xhr.send(JSON.stringify(data))
    }catch(e){
        // showTips("无法连接至服务器")
        likeToggle_()
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let resp = JSON.parse(xhr.response)
            if (resp.code != 200) {
                likeToggle_()
                rightContainer.getElementsByClassName("likeBtn")[0].setAttribute("disable",false)
                return;
            }                
        }else if(xhr.readyState == 4 && xhr.status != 200){
            likeToggle_()
            rightContainer.getElementsByClassName("likeBtn")[0].setAttribute("disable",false)
            return
        }
    }
    xhr.addEventListener("readystatechange",commonXHRHandler)
}

function showTips(msg){
    let box = document.createElement("div")
    box.className="tips"
    box.innerText = msg
    box.id = "tips"
    document.body.appendChild(box)
    setTimeout(function(){
        document.getElementById("tips").remove()
    },2000)
}