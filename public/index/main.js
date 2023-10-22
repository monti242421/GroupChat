

document.getElementById('sendmessage').onclick = async function addexpense(e){
        e.preventDefault();
        const chatmessage = document.getElementById("chatmessage").value
        var myobj = {
            chatmessage : chatmessage
        };
        try {
            const token = localStorage.getItem("token")
            var res = await axios.post("http://localhost:4000/chats/addchat",myobj,{headers:{"Authorization":token}})
                //console.log(res.data.newchat);
                const recentchats = JSON.parse(localStorage.getItem('recentchats'));
                recentchats.pop();
                recentchats.unshift(res.data.newchat)

                //console.log(recentchats);
                localStorage.setItem('recentchats',JSON.stringify(recentchats));
                   
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

async function getchatsfirsttime(){
    try{
        const token = localStorage.getItem("token")
        var recentchats = await axios.get("http://localhost:4000/chats/getchat/",{headers:{"Authorization":token}})
        localStorage.setItem("recentchats",JSON.stringify(recentchats.data.result))
        console.log("aasa");

    }catch(err){
        console.log(err);
    }

}

getchatsfirsttime();

async function getchats(){
        const recentchats = JSON.parse(localStorage.getItem('recentchats'));
        document.getElementById('box-1').innerHTML='';
        for( var i=0;i<recentchats.length;i++){
            showDataToScreen(recentchats[recentchats.length-1-i]);
        }
}

window.addEventListener("DOMContentLoaded", getchats)

setInterval(getchats,1000)



function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

