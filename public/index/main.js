

document.getElementById('sendmessage').onclick = async function addexpense(e){
        e.preventDefault();
        const chatmessage = document.getElementById("chatmessage").value
        var myobj = {
            chatmessage : chatmessage
        };
        try {
            const token = localStorage.getItem("token")
            var res = await axios.post("http://localhost:4000/chats/addchat",myobj,{headers:{"Authorization":token}})
                console.log(res);
                //showDataToScreen(res.data.newchat)   
            }         
        catch(err)
            {
                  console.log(err)
            };

            
}

function showDataToScreen(data){
   
    var chat = data.text;
    var div =document.createElement("div");
    const token = localStorage.getItem('token');
    const decodedtoken = parseJwt(token);
    const username = decodedtoken.username;
    div.className="messages"
    div.innerHTML=chat;
    document.getElementById('box-1').appendChild(div);
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getchats(){
    try{
        const token = localStorage.getItem("token")
        const decodedtoken = parseJwt(token);
        var res =await axios.get("http://localhost:4000/chats/getchat/",{headers:{"Authorization":token}})
        console.log(res);
        document.getElementById('box-1').innerHTML='';
        for( var i=0;i<res.data.result.length;i++){
            showDataToScreen(res.data.result[i]);
        }
    }catch(err){
        console.log(err);
    }

}

window.addEventListener("DOMContentLoaded", ()=>{
    getchats();
})

setInterval(async ()=>{
    getchats();
},1000)



function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

