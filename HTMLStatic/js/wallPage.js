// const host = "http://127.0.0.1:5000";
const maxContentHeight = 100; // px 留言最大高度
const WALL_WIDTH = 6400;
const WALL_HEIGHT = 4800;
const SCREEN_HEIGHT = window.screen.height;
const SCREEN_WIDTH = window.screen.width;
const maxScal = 0.1;
const messageMaxLen = 400;

function submitMsg(that) {
    let CenterRelX = center_rel_point_x;
    let CenterRelY = center_rel_point_y;

    // let editElement = document.getElementById(id);
    let editElement = that.parentElement.getElementsByClassName("editBox")[0];
    let data = {
        content: editElement.value,
        centerRelX: CenterRelX,
        centerRelY: CenterRelY,
        width: parseInt(editElement.style.width.replace("px", "")),
        height: parseInt(editElement.style.height.replace("px", "")),
        fontSize: parseInt(editElement.style.fontSize.replace("px", "")),
        borderRadius: parseInt(editElement.style.borderRadius.replace("px", "")),
        Remark: "",
    };

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/add", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let resp = JSON.parse(xhr.response);
            if (resp.code != 200) {
                showTips(resp.msg);
                return;
            }
            let haraxi_this = document.getElementsByClassName("haraxi_fake")[0];
            haraxi_this.className = "haraxi";
            // haraxi_this.setAttribute("onclike","hanashiPlacement()")
            // haraxi_this.onclick = function () {
            //     // console.log(temp_div_content.innerHTML)
            //     rightBox.getElementsByClassName("detailText")[0].innerHTML = haraxi_this.innerHTML;
            //     rightBox.getElementsByClassName("detailText")[0].style.fontSize = haraxi_this.firstChild.style.fontSize;
            //     detailBox.style.display = "block";
            //     writeBox.style.display = "none";
            //     box_show_animation("rightBox");
            // }
            // location.reload();
            // console.log(xhr.responseText);
            return;
        }
        if (xhr.readyState == 4 && xhr.status != 200) {
            alert("无法连接至服务器");
        }
    };
}

var _LoadingHtml =
    '<div id="loadingDiv" style="display: none; "><div id="over" style=" position: absolute;top: 0;left: 0; width: 200%;height: 200%; background-color: rgba(255,255,255,0.5);opacity:1.0;z-index: 1000;"></div><div id="layout" style="position: absolute;top: 30%; left: 35%;width: 20%; height: 20%;  z-index: 1001;text-align:center;"><img src="https://s3.bmp.ovh/imgs/2022/04/21/ed9142a3c97ba942.gif" style="opacity:0.5;" /></div></div>';
document.write(_LoadingHtml);
function showLoading() {
    document.getElementById("loadingDiv").style.display = "block";
}
function completeLoading() {
    document.getElementById("loadingDiv").style.display = "none";
}
function getMessage() {
    showLoading();
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/getMessage", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        completeLoading();
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.response);
            // console.log(xhr.response)
            // console.log(result)

            if (result.code == 200) {
                for (let i = 0; i < result.data.length; i++) {
                    hanashiPlacement(result.data[i]);
                }
                return;
            }
            alert(result.msg);
        } else {
            if (xhr.readyState == 4 && xhr.status != 200) {
                alert("服务器请求失败");
            }

            // location.reload()
        }
    };
}

function updatePreview(method) {
    let haraxi_fake = document.getElementsByClassName("haraxi_fake");
    let rightContainer = document.getElementById("rightContainer");
    if (method == "off") {
        // console.log(haraxi_fake.length);
        if (haraxi_fake.length > 0) {
            haraxi_fake[0].remove();
            //   console.log(haraxi_fake.length);
            return;
        }
        return;
    }
    // if window closed, terminate this task
    // console.log(rightContainer)
    if (rightContainer.style.display == "none") {
        // clearInterval(id_preview_update_interval);
        // id_preview_update_interval = null;
        if (haraxi_fake.length != 0) {
            document.getElementsByClassName("haraxi_fake")[0].remove();
        }
        return;
    }
    // else, update.
    showPreviewMsg();
}

var userInfo;
function showPreviewMsg() {
    let aera = document.getElementById("editBox");
    let haraxi_fake = document.getElementsByClassName("haraxi_fake");
    let temp_div;
    let temp_div_content;
    // let temp_div_userinfo;
    if (haraxi_fake.length == 0) {
        // 初始化元素
        // console.log("SSSSSSSS");
        userInfo = JSON.parse(window.localStorage.getItem("user"));
        temp_div = document.createElement("div");
        temp_div_content = document.createElement("div");
        temp_div.className = "haraxi_fake";
        temp_div.style.borderRadius = aera.style.borderRadius;
        temp_div_content.className = "text";

        temp_div.appendChild(temp_div_content);
        wall.appendChild(temp_div);
    } else {
        temp_div = haraxi_fake[0];
        temp_div_content = temp_div.getElementsByClassName("text")[0];
    }

    temp_div.style.top = WALL_HEIGHT / 2 + center_rel_point_y + "px";
    temp_div.style.left = WALL_WIDTH / 2 + center_rel_point_x + "px";

    temp_div.style.width = aera.style.width;
    // temp_div_content.style.height = aera.style.height;
    // console.log(int(aera.style.height.replace("px","")))
    if (
        parseInt(aera.style.height.replace("px", "")) <=
        parseInt(aera.parentElement.style.height.replace("px", ""))
    ) {
        // 防止超出范围
        temp_div.style.height = aera.style.height;
    } else {
        temp_div.style.height = aera.parentElement.style.height;
    }

    temp_div_content.innerHTML = convertContent(aera.value)
    // console.log(temp_div_content.innerHTML)
    console.log("rad ",temp_div.style.borderRadius)
    temp_div_content.style.fontSize = aera.style.fontSize;
    // temp_div_content.style.border = aera.style.border;
    temp_div.style.borderRadius = aera.style.borderRadius;
}

function overMask(element) {
    let mask = document.createElement("div");
    mask.className = "mask";

    mask.appendChild(element);
    document.body.appendChild(mask);
}

function showLoginWnd() {
    mask.style.display = "flex";
    loginBox.style.display = "flex";
    regBox.style.display = "none";
    // overMask.style.display="flex";
}

function showRegWnd() {
    mask.style.display = "flex";
    loginBox.style.display = "none";
    regBox.style.display = "flex";
    // overMask.style.display="flex";
}

function closeSignWnd() {
    mask.style.display = "none";
    loginBox.style.display = "none";
    regBox.style.display = "none";
    // overMask.style.display="none";
}

function signIn() {
    let username = document.getElementById("login_username");
    let password = document.getElementById("login_password");
    let items = [username, password];
    for (let i = 0; i < items.length; i++) {
        if (items[i].value == "" || items[i].className == "invalidInput") {
            items[i].style.outline = "red solid 2px";
            return;
        }
    }
    let data = {
        UserName: username.value,
        Password: password.value,
    };
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/signIn", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // console.log(xhr.response)
            let resp = JSON.parse(xhr.response);
            if (resp["code"] != 200) {
                let prop = document.createElement("div");
                prop.innerHTML =
                    "<div name='removeable' class='wndInputRow'>" + resp.msg + "</div>";
                loginBox.appendChild(prop);
                return;
            }
            let prop = document.createElement("div");
            prop.innerHTML =
                "<div name='removeable' class='wndInputRow'>登录成功</div>";
            loginBox.appendChild(prop);
            setTimeout("location.reload()", 1000);
        }
    };
}

function signUp() {
    removeables = document.getElementsByName("removeable");
    for (let i = 0; i < removeables.length; i++) {
        removeables[i].remove();
    }
    let agreeProt = document.getElementById("reg_agreeProt");
    if (!agreeProt.checked) {
        agreeProt.style.outline = "red solid 2px";
        return;
    }
    let phone = document.getElementById("reg_phone");
    let username = document.getElementById("reg_username");
    let password = document.getElementById("reg_password");
    let password_sec = document.getElementById("reg_password_sec");
    let items = [phone, username, password, password_sec];
    for (let i = 0; i < items.length; i++) {
        if (items[i].value == "" || items[i].className == "invalidInput") {
            items[i].style.outline = "red solid 2px";
            return;
        }
    }

    if (password.value != password_sec.value) {
        let prop = document.createElement("div");
        prop.innerHTML =
            "<div name='removeable' class='wndInputRow'>两次密码不一致</div>";
        regBox.appendChild(prop);
        password_sec.className = "invalidInput";
    }

    let data = {
        phone: phone.value,
        username: username.value,
        password: password.value,
    };
    let prop = document.createElement("div");
    prop.innerHTML = "<div name='removeable' class='wndInputRow'>请求中...</div>";
    regBox.appendChild(prop);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/signUp", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let resp = JSON.parse(xhr.response);
            if (resp.code != 200) {
                prop.innerHTML =
                    "<div name='removeable' class='wndInputRow'>" + resp.msg + "</div>";
                regBox.appendChild(prop);
                return;
            }
            prop.innerHTML =
                "<div name='removeable' class='wndInputRow'>注册成功</div>";
            regBox.appendChild(prop);
            setTimeout("location.reload()", 1000);
        }
    };
}

function convertContent(msg) {
    let re1 = /~[^~]*~/g  // {% ... %}
    // console.log("VALUEA",msg)
    let value = msg.replaceAll(/[\n]/gi, "<br/>");
    value = value.replaceAll(/[\s]/gi, "&nbsp;");
    // console.log("VALUEB:",value)
    value = value.replaceAll(re1,function(match){
        // console.log("MATCH",match)
        let r = match.replaceAll("<br/>"," ")
        r = r.replaceAll("&nbsp;"," ")
        // r = r.replaceAll("")
        r = r.replaceAll(/[\s]+/g," ")
        // console.log("REPED",r)
        return r;
    })
    // console.log("VALUEC:",value)
    value = value.replaceAll("~","")
    // value = value.replaceAll("$","")
    // console.log("VALUE:",value)
    return value
}

window.onload = function () {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/getUserInfo", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let resp = JSON.parse(xhr.response);
            // console.log(resp)
            if (resp.code != 200) {
                if (resp.code == 201) alert(resp.msg);
                return;
            }
            signBox.style.display = "none";
            navBox.style.display = "flex";
            localStorage.setItem("user", JSON.stringify(resp.data));
        }
    };
};

function hanashiPlacement(data) {
    let temp_div = document.createElement("div");
    let temp_div_content = document.createElement("div");
    let titleStore = document.createElement("a");
    // console.log(data)
    temp_div.className = "haraxi";
    temp_div.style.top = WALL_HEIGHT / 2 + data.CenterRelY + "px";
    temp_div.style.left = WALL_WIDTH / 2 + data.CenterRelX + "px";
    temp_div.style.borderRadius = data.BorderRadius + "px";
    temp_div.style.width = data.Width + "px";
    temp_div.style.height = data.Height + "px";
    temp_div_content.style.fontSize = data.FontSize + "px";

    titleStore.style.display = "none";
    titleStore.className = "titleStore";

    // let thumb = document.createElement("div")
    // thumb.className = "thumb"
    // thumb.onclick =

    let avatar = document.createElement("img");
    if (data.User.Avatar != "") {
        avatar.src = data.User.Avatar;
    } else {
        avatar.src = "/static/default/avatar.jpg";
    }

    let username = document.createElement("span");
    username.innerText = data.User.UserName;
    username.className = "userName";

    let createTime = document.createElement("span");
    createTime.innerText = data.CreatedAt.split(".")[0].replace("T", " ");
    createTime.className = "createTime";
    // console.log(data.User)
    // console.log(thumb)
    titleStore.append(createTime, avatar, username); // username avatar
    // titleStore.innerText = titleStore.innerHTML

    temp_div_content.innerHTML = convertContent(data.Content);
    temp_div_content.className = "text";
    temp_div_content.style.fontSize = data.FontSize + "px";
    temp_div_content.style.borderRadius = data.BorderRadius + "px";

    temp_div.append(temp_div_content, titleStore);
    temp_div.name = data.ID;
    // temp_div.appendChild(temp_div_content);
    // console.log(data)
    temp_div.onclick = function () {
        // console.log(data)
        updatePreview("off");
        // document.getElementsByClassName("haraxi_fake")[0].remove()
        // rightContainer.getElementsByClassName("titleName")[0].innerHTML = this.getElementsByClassName("titleStore")[0].innerHTML
        rightContainer.getElementsByClassName("titleName")[0].innerHTML =
            titleStore.innerHTML;
        rightContainer.getElementsByClassName("titleName")[0].id = data.ID;
        rightContainer.getElementsByClassName("body")[0].innerHTML = convertContent(
            data.Content
        );
        let btns = document.createElement("div");
        let btn = document.createElement("button");
        btn.setAttribute("onclick", "likeToggle(this)");
        // btn.onclick =
        btn.className = "likeBtn";
        let style = document.createElement("div");
        style.name = "likeStyle";

        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        // console.log(user.Administrator)
        if(user.Administrator){
            // console.log("Admin")
            let delBtn = document.createElement("button")
            delBtn.innerText="del"
            delBtn.className="delBtn"
            delBtn.setAttribute("onclick", "delHanashi("+data.ID+")");
            btns.appendChild(delBtn)
        }
        
        let data_ = {
            MessageID: data.ID,
        };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/wall/impact", true);
        xhr.send(JSON.stringify(data_));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let resp = JSON.parse(xhr.response);
                console.log(resp);
                if (resp.code != 200) {
                    showTips(resp.msg);
                    return;
                }
                style.className = resp.msg + "_";
                // if(resp.msg == "liked"){
                //     style.className = "liked_"
                // }else{
                //     style.className = "like_"
                // }
                let thumbCount = document.createElement("div")
                thumbCount.className = "thumbCount"
                thumbCount.innerText = data.Thumbs

                btn.appendChild(style);
                
                btns.appendChild(btn);
                btns.appendChild(thumbCount)
                rightContainer.getElementsByClassName("btnGroup")[0].innerHTML =
                    btns.innerHTML;
                rightContainer.style.display = "flex";
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                showTips("无法连接到服务器");
                rightContainer.style.display = "flex";
                rightContainer.getElementsByClassName("btnGroup")[0].innerHTML = "";
                return;
            }
        };
        // writeBox.style.display = "none";
        // box_show_animation("rightBox");
    };
    wall.appendChild(temp_div);
}

function showWrite() {
    rightContainer = document.getElementById("rightContainer");
    rightContainer.getElementsByClassName("titleName")[0].innerText = "发布信息";
    // let temp_ = document.createElement("div")
    rightContainer.getElementsByClassName("body")[0].innerHTML =
        document.getElementsByName("_writeBox")[0].innerHTML;
    rightContainer.getElementsByClassName("btnGroup")[0].innerHTML = "";
    rightContainer.style.display = "flex";
}


function delHanashi(hanashiID){
    let xhr = new XMLHttpRequest()
    let data = {
        "MessageID":hanashiID
    }
    xhr.open("POST","/wall/delete",true)
    xhr.send(JSON.stringify(data))
    xhr.onload = function(){
        if(xhr.status == 200){
            console.log(xhr.response)
            let result = JSON.parse(xhr.response)
            showTips(result.msg)
        }
    }
}