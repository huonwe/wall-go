function wndCloseAnimation(wndID) {
    let wnd = document.getElementById(wndID)
    let count = 0;
    let id = setInterval(frame,5);
    function frame() {
        if(wnd.style.height=="1%"){
            wnd.style.height = "0%"
            clearInterval(id);
        }else{
            console.log(wnd.style.height)
            count++;
            wnd.style.height = parseInt(wnd.style.height.replace("%",""))-count+"%";
        }
    }
}


var rotate = 0;
var rotating = false;
function btn_rotate_animation(elementId){
    var btn = document.getElementById(elementId);
    rotating = true;
    rotate+=1;
    var id = setInterval(frame,5)
    function frame(){
        // console.log(rotating)
        if(rotate % 90 == 0){
            if(rotate % 360 == 0) rotate = 0;
            // rotate += 1;
            clearInterval(id);
            rotating = false;
            // btn.parentElement.style.zIndex = 9;
        }else{
            rotate+=1;
            btn.style.transform = "rotate("+rotate+"deg)";
        }
    }
}






