const host = "http://127.0.0.1:5000";
const maxContentHeight = 100        // px 留言最大高度
const WALL_WIDTH = 6400
const WALL_HEIGHT = 4800
const SCREEN_HEIGHT = window.screen.height;
const SCREEN_WIDTH = window.screen.width;
const maxScal = 0.1
const messageMaxLen = 400

function submitMsg(id){    
    let CenterRelX = center_rel_point_x;
    let CenterRelY = center_rel_point_y;

    let editElement = document.getElementById(id);

    let data = {
        "content":editElement.value,
        "centerRelX":CenterRelX,
        "centerRelY":CenterRelY,
        "width":parseInt(editElement.style.width.replace("px","")),
        "height":parseInt(editElement.style.height.replace("px","")),
        "fontSize":parseInt(editElement.style.fontSize.replace("px","")),
        "borderRadius":parseInt(editElement.style.borderRadius.replace("px","")),
        "Remark":""
    };
    
    let xhr = new XMLHttpRequest();
    
    xhr.open("POST","/add",true)
    xhr.setRequestHeader("Content-Type","application/json;charset=utf-8")
    xhr.send(JSON.stringify(data))

    xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            let resp = JSON.parse(xhr.response)
            if(resp.code!=200){
                alert(resp.msg);
                return;
            }
            let haraxi_this = document.getElementsByClassName("haraxi_fake")[0];
            haraxi_this.className = "haraxi";
            haraxi_this.onclick = function(){
                    // console.log(temp_div_content.innerHTML)
                    rightBox.getElementsByClassName("detailText")[0].innerHTML=haraxi_this.innerHTML;
                    rightBox.getElementsByClassName("detailText")[0].style.fontSize=haraxi_this.firstChild.style.fontSize;
                    detailBox.style.display="block";
                    writeBox.style.display="none";
                    box_show_animation("rightBox");
                }
                // location.reload();
            // console.log(xhr.responseText);
            return;
        }
        if(xhr.readyState==4&&xhr.status!=200){
            alert("无法连接至服务器");
        }
    }
}

var _LoadingHtml = '<div id="loadingDiv" style="display: none; "><div id="over" style=" position: absolute;top: 0;left: 0; width: 200%;height: 200%; background-color: rgba(255,255,255,0.5);opacity:1.0;z-index: 1000;"></div><div id="layout" style="position: absolute;top: 30%; left: 35%;width: 20%; height: 20%;  z-index: 1001;text-align:center;"><img src="https://s3.bmp.ovh/imgs/2022/04/21/ed9142a3c97ba942.gif" style="opacity:0.5;" /></div></div>'
document.write(_LoadingHtml);
function showLoading(){
    document.getElementById("loadingDiv").style.display="block";
}
function completeLoading() {  
    document.getElementById("loadingDiv").style.display="none";
}
function getMessage(){
    showLoading()
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/getMessage",true);
    xhr.send();
    xhr.onreadystatechange = function(){
        completeLoading();
        if(xhr.readyState==4 && xhr.status==200){
            let result = JSON.parse(xhr.response)
            // console.log(xhr.response)
            // console.log(result)

            if(result.code == 200){
                for(let i = 0;i<result.data.length;i++){
                    let temp_div = document.createElement("div");
                    let temp_div_content = document.createElement("div");
                    let temp_div_userinfo = document.createElement("div");
                    
                    temp_div_content.innerHTML = convertContent(result.data[i].Content);
                    temp_div_content.className = "text";
                    temp_div_userinfo.className = "userinfo_E";
                    temp_div_userinfo.innerText = "---by---" + result.data[i].User.UserName;

                    temp_div.className = "haraxi";
                    temp_div.style.top = WALL_HEIGHT/2 + result.data[i].CenterRelY+"px";
                    temp_div.style.left = WALL_WIDTH/2 + result.data[i].CenterRelX+"px";
                    temp_div.style.borderRadius = result.data[i].BorderRadius+"px"
                    temp_div.style.width = result.data[i].Width+"px";
                    temp_div.style.height = result.data[i].Height+"px";
                    temp_div_content.style.fontSize = result.data[i].FontSize+"px";
                    
                    temp_div.onclick = function(){
                        // console.log(temp_div_content.innerHTML)
                        rightBox.getElementsByClassName("detailText")[0].innerHTML=temp_div_content.innerHTML;
                        rightBox.getElementsByClassName("detailText")[0].style.fontSize=temp_div_content.style.fontSize
                        detailBox.style.display="block";
                        writeBox.style.display="none";
                        box_show_animation("rightBox");
                    }

                    temp_div.appendChild(temp_div_content);
                    temp_div.appendChild(temp_div_userinfo)
                    wall.appendChild(temp_div);
                    
                }
                return;
            }
            alert(result.msg);
        }else{
            if(xhr.readyState==4 && xhr.status!=200){
                alert("服务器请求失败");
            }
            
            // location.reload()

        }
    }
}

function updatePreview(method){
    let haraxi_fake = document.getElementsByClassName("haraxi_fake");
    if(method=="off"){
        if(haraxi_fake.length>0){
            document.getElementsByClassName("haraxi_fake")[0].remove();
            return;
        }
    }
    // if window closed, terminate this task
    if(writeBox.style.display=="none" || rightBox.style.height<"80%"){
        // clearInterval(id_preview_update_interval);
        // id_preview_update_interval = null;
        if(haraxi_fake.length!=0){
            document.getElementsByClassName("haraxi_fake")[0].remove();
        }
        return;
    }
    // else, update.
    showPreviewMsg();

}

var userInfo;
function showPreviewMsg(){
    let aera = document.getElementById("editBox");
    let haraxi_fake = document.getElementsByClassName("haraxi_fake");
    let temp_div;
    let temp_div_content;
    let temp_div_userinfo;
    if(haraxi_fake.length == 0){    // 初始化元素
        userInfo = JSON.parse(window.localStorage.getItem("user"));
        temp_div = document.createElement("div");
        temp_div_content = document.createElement("div");
        temp_div_userinfo = document.createElement("div");
        temp_div.className = "haraxi_fake";
        temp_div.style.borderRadius = aera.style.borderRadius;
        temp_div_content.className="text";
        temp_div_userinfo.className = "userinfo_E";

        // console.log(userInfo)
        try {
            temp_div_userinfo.innerText = "---by---" +userInfo.UserName;
        } catch (error) {
            temp_div_userinfo.innerText = "您还未登录哦，登陆后才可发布";
        }

        temp_div.appendChild(temp_div_content);
        temp_div.appendChild(temp_div_userinfo);
        wall.appendChild(temp_div);

    }else{
        temp_div = haraxi_fake[0];
        temp_div_content = temp_div.getElementsByClassName("text")[0];
        temp_div_userinfo = temp_div.getElementsByClassName("userinfo_E")[0];
    }

    temp_div.style.top = WALL_HEIGHT/2 + center_rel_point_y+"px";
    temp_div.style.left = WALL_WIDTH/2 + center_rel_point_x+"px";

    temp_div.style.width = aera.style.width;
    // temp_div_content.style.height = aera.style.height;
    // console.log(int(aera.style.height.replace("px","")))
    if(parseInt(aera.style.height.replace("px",""))<=parseInt(aera.parentElement.style.height.replace("px",""))){ // 防止超出范围
        temp_div.style.height = aera.style.height;
    }else{
        temp_div.style.height = aera.parentElement.style.height;
    }

    temp_div_content.innerHTML = convertContent(aera.value);

    temp_div_content.style.fontSize = aera.style.fontSize;
    // temp_div_content.style.border = aera.style.border;
    temp_div.style.borderRadius = aera.style.borderRadius;
    
}


function showLoginWnd(){
    mask.style.display="flex";
    loginBox.style.display="flex";
    regBox.style.display="none";
    // overMask.style.display="flex";
}

function showRegWnd(){
    mask.style.display="flex";
    loginBox.style.display="none";
    regBox.style.display="flex";
    // overMask.style.display="flex";
}

function closeSignWnd(){
    mask.style.display="none";
    loginBox.style.display="none";
    regBox.style.display="none";
    // overMask.style.display="none";
}

function signIn() {
    let username = document.getElementById("login_username");
    let password = document.getElementById("login_password");
    let items = [username, password]
    for(let i=0;i<items.length;i++){
        if(items[i].value=="" || items[i].className=="invalidInput"){
            items[i].style.outline="red solid 2px"
            return;
        }
    }
    let data = {
        "UserName":username.value,
        "Password":password.value
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST","/signIn",true)
    xhr.setRequestHeader("Content-Type","application/json;charset=utf-8")
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            // console.log(xhr.response)
            let resp = JSON.parse(xhr.response);
            if(resp['code']!=200){
                let prop = document.createElement("div");
                prop.innerHTML = "<div name='removeable' class='wndInputRow'>"+resp.msg+"</div>"
                loginBox.appendChild(prop);
                return;
            }
            let prop = document.createElement("div");
            prop.innerHTML = "<div name='removeable' class='wndInputRow'>登录成功</div>"
            loginBox.appendChild(prop);
            setTimeout("location.reload()",1000)
        }
    }

}


function signUp() {
    removeables = document.getElementsByName("removeable");
    for(let i=0;i<removeables.length;i++){
        removeables[i].remove();
    }
    let agreeProt = document.getElementById("reg_agreeProt");
    if(!agreeProt.checked){
        agreeProt.style.outline="red solid 2px"
        return;
    };
    let phone = document.getElementById("reg_phone");
    let username = document.getElementById("reg_username");
    let password = document.getElementById("reg_password");
    let password_sec = document.getElementById("reg_password_sec");
    let items = [phone, username, password, password_sec]
    for(let i=0;i<items.length;i++){
        if(items[i].value=="" || items[i].className=="invalidInput"){
            items[i].style.outline="red solid 2px"
            return;
        }
    }

    if(password.value != password_sec.value){
        let prop = document.createElement("div");
        prop.innerHTML = "<div name='removeable' class='wndInputRow'>两次密码不一致</div>"
        regBox.appendChild(prop);
        password_sec.className="invalidInput"
    }

    let data = {
        "phone":phone.value,
        "username":username.value,
        "password":password.value
    }
    let prop = document.createElement("div");
    prop.innerHTML = "<div name='removeable' class='wndInputRow'>请求中...</div>"
    regBox.appendChild(prop);
    let xhr = new XMLHttpRequest();
    xhr.open("POST","/signUp",true)
    xhr.setRequestHeader("Content-Type","application/json;charset=utf-8")
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            let resp = JSON.parse(xhr.response)
            if(resp.code != 200){
                prop.innerHTML = "<div name='removeable' class='wndInputRow'>"+resp.msg+"</div>";
                regBox.appendChild(prop);
                return;
            }
            prop.innerHTML = "<div name='removeable' class='wndInputRow'>注册成功</div>";
            regBox.appendChild(prop);
            setTimeout("location.reload()",1000)
        }
    }

}


//创建XMLHttpRequest 对象
//参数：无
//返回值：XMLHttpRequest 对象
function createXHR () {
    var XHR = [  //兼容不同浏览器和版本得创建函数数组
        function () { return new XMLHttpRequest () },
        function () { return new ActiveXObject ("Msxml2.XMLHTTP") },
        function () { return new ActiveXObject ("Msxml3.XMLHTTP") },
        function () { return new ActiveXObject ("Microsoft.XMLHTTP") }
    ];
    var xhr = null;
    //尝试调用函数，如果成功则返回XMLHttpRequest对象，否则继续尝试
    for (var i = 0; i < XHR.length; i ++) {
        try {
            xhr = XHR[i]();
        } catch(e) {
            continue  //如果发生异常，则继续下一个函数调用
        }
        break;  //如果成功，则中止循环
    }
    return xhr;  //返回对象实例
}

function convertContent(msg){
    var regObj = new RegExp("(<[a-z]+&nbsp;[\\s\\S]+</[a-z]+>)+","g")
    let value = msg.replaceAll(/[\n]/gi, "<br/>");
    value = value.replaceAll(/[\s]/gi, "&nbsp;");
    value = value.replaceAll(regObj,function(rs){
        // console.log("RS:"+rs)
        return rs.replaceAll("&nbsp;"," ")
    })
    // console.log("RESULT:"+value)
    return value;
}

window.onload = function(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/getUserInfo",true)
    xhr.setRequestHeader("Content-Type","application/json;charset=utf-8")
    xhr.send()
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            let resp = JSON.parse(xhr.response)
            // console.log(resp)
            if(resp.code != 200){
                alert(resp.msg);
                return;
            }
            signBox.style.display = "none";
            navBox.style.display = "flex";
            window.localStorage.setItem('user',JSON.stringify(resp.data))
            console.log(resp.data)
        }
    }
}


