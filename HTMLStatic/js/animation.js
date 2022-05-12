function box_close_animation(elementId){
    var detailBox = document.getElementById(elementId);
    var count = 80;
    var id = setInterval(frame,5);
    function frame() {
        if(detailBox.style.height=="1%"){
            detailBox.style.height = "0%"
            clearInterval(id);
        }else{
            count--;
            detailBox.style.height = count+"%";
        }
    }
}

function box_show_animation(elementId){
    var detailBox = document.getElementById(elementId);
    var count = 0;
    var id = setInterval(frame,5);
    function frame() {
        // console.log(detailBox.style.height)
        if(detailBox.style.height=="80%"){
            clearInterval(id);
        }else{
            count+=2;
            detailBox.style.height = count+"%";
        }
    }
}

function left_box_show_animation(elementId){
    var leftBox = document.getElementById(elementId);
    var count = 0;
    var rate = 10;
    var id = setInterval(frame,5)
    function frame(){
        if(parseFloat(leftBox.style.left.replace("em",""))>=0){
            clearInterval(id)
            leftBox.style.left = "0em";
        }else{
            if(-18+count >=-1){
                count+=0.5*(1/rate+0.001);
                rate++;
            }else{
                count+=0.5;
            }
            leftBox.style.left = (-18+count)+"em";
            // console.log(leftBox.style.left)
        }
    }
}


function left_box_close_animation(elementId){
    var leftBox = document.getElementById(elementId);
    var count = 0;
    var id = setInterval(frame,5)
    function frame(){
        if(parseFloat(leftBox.style.left.replace("em","")) <= -18){
            clearInterval(id)
            leftBox.style.left = "-18em"
        }else{
            if(count >= 17){
                // count+=0.01;
                count+=0.5;    // 消失时不作差异
            }else{
                count+=0.5;
            }
            leftBox.style.left = (-count)+"em";
            // console.log(leftBox.style.left)
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






