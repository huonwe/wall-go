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