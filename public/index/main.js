

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
                showDataToScreen(res.data.newchat)   
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
function showpreiumusermessage(){
        document.getElementById('rzr-button1').style.visibility="hidden";
        document.getElementById('message').innerHTML="You are a premium user";
}






window.addEventListener("DOMContentLoaded",async ()=>{
    try{
        const token = localStorage.getItem("token")
        const decodedtoken = parseJwt(token);
        var res =await axios.get("http://localhost:4000/chats/getchat/",{headers:{"Authorization":token}})
        console.log(res);
        for( var i=0;i<res.data.result.length;i++){
            showDataToScreen(res.data.result[i]);
        }
    }catch(err){
        console.log(err);
    }


})

async function removeItem(e){
    if(e.target.classList.contains("delete")){
        try{
        var li = e.target.parentElement;
        var expenseId=li.id;
        console.log(li.id);
        var token = localStorage.getItem("token")
        await axios.delete("http://localhost:4000/expense/deleteexpense/"+expenseId,{headers:{"Authoriztion":token}})
        items.removeChild(li);

        }catch(err){
            console.log(err);
        }
        

    }
    
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

