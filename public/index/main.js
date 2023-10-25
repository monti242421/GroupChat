const token = localStorage.getItem("token")
const socket = io({auth: {
    token: token
}});

document.getElementById('sendmessage').onclick = async function addmessage(e){
        e.preventDefault();
        const token = localStorage.getItem("token")
        const chatmessage = document.getElementById("chatmessage").value
        const groupname = document.getElementById("groupmessages").innerHTML
        const decodedtoken = parseJwt(token);
        var myobj = {
            chatmessage : decodedtoken.username+'- '+chatmessage,
            groupname:groupname
        };
        try {
           
            socket.emit('user-message',myobj,{headers:{"Authorization":token}});
            
            // var res = await axios.post("http://localhost:4000/chats/addchat",myobj,{headers:{"Authorization":token}})
            //     //console.log(res.data.newchat);
            //     const recentchats = JSON.parse(localStorage.getItem('recentchats'));
                
                
            //     recentchats.unshift(res.data.newchat)
            //     if(recentchats.length>10){
            //         recentchats.pop();
            //     }

            //     //console.log(recentchats);
            //     localStorage.setItem('recentchats',JSON.stringify(recentchats));
                   
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
    document.getElementById('chatbox').appendChild(div);
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
        var recentchats = await axios.get("http://localhost:4000/chats/getchat/",{headers:{"Authorization":token}})
        localStorage.setItem("recentchats",JSON.stringify(recentchats.data.result))
        displaychats();
    }catch(err){
        console.log(err);
    }

}


async function displaychats(){
        const recentchats = JSON.parse(localStorage.getItem('recentchats'));
        document.getElementById('chatbox').innerHTML='';
        for( var i=0;i<recentchats.length;i++){
            showDataToScreen(recentchats[recentchats.length-1-i]);
        }
}

async function showmygroups(){
    try{

    
    const token = localStorage.getItem("token")
    var mygroups = await axios.get("http://localhost:4000/groups/getgroups/",{headers:{"Authorization":token}})
    for(let i=0;i<mygroups.data.mynewgroups.length;i++){
        displaygroups(mygroups.data.mynewgroups[i].name);
    }
    }catch(err){
        console.log(err);
    }
    
}
window.addEventListener("DOMContentLoaded", getchats,showmygroups())

//setInterval(displaychats,10)
socket.on('message',(message)=>{
                if(message.groupname ==document.getElementById("groupmessages").innerHTML){
                var chat = message.chatmessage;
                var div =document.createElement("div");
                div.className="messages"
                div.innerHTML=chat;
                document.getElementById('chatbox').appendChild(div);

                }
                

                const recentchats = JSON.parse(localStorage.getItem('recentchats'));              
                recentchats.unshift(message)
                if(recentchats.length>10){
                    recentchats.pop();
                }
                localStorage.setItem('recentchats',JSON.stringify(recentchats));
})


function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

document.getElementById('creategroup').onclick =async function createGroup (e){
    e.preventDefault();
    try{
    const groupname= document.getElementById('groupname').value

    var myobj = {
        groupname : groupname
    };
    const token = localStorage.getItem("token")
    var res = await axios.post("http://localhost:4000/groups/addgroup",myobj,{headers:{"Authorization":token}})

    displaygroups(groupname);

    document.getElementById("error").textContent="New Group Created"
}catch(err){
          console.log(err)
          document.getElementById("error").textContent=err.response.data.message;
}
}

document.getElementById('inviteuser').onclick =async function invite (e){
    e.preventDefault();
    try{
    const groupname= document.getElementById('groupname').value
    const inviteemail= document.getElementById('inviteemail').value

    var myobj = {
        groupname : groupname,
        inviteemail:inviteemail
    };
    const token = localStorage.getItem("token")
    var res = await axios.post("http://localhost:4000/groups/groupinvite",myobj,{headers:{"Authorization":token}})

    document.getElementById("error").textContent="User Added"

}catch(err){
          console.log(err)
          document.getElementById("error").textContent=err.response.data.message;
}
}

function displaygroups(groupname){
    const button = document.createElement('button');
    button.className="newgroup"
    
    button.innerHTML=groupname;
    document.getElementById('box-2').appendChild(button);
}

document.getElementById('box-2').addEventListener('click',groupchat);

async function groupchat(e){
        e.preventDefault();
        if(e.target.classList.contains("newgroup")){
            console.log(e.target.innerHTML);
            try{
                
                const groupname= e.target.innerHTML
                document.getElementById('groupmessages').innerHTML = groupname;
                document.getElementById('loggedgroupname').innerHTML=groupname;
            
                var myobj = {
                    groupname : groupname
                };
                const token = localStorage.getItem("token")
                const thisgroupchat = await axios.post("http://localhost:4000/groups/getchats",myobj,{headers:{"Authorization":token}})
                const allgroupmembers = await axios.post("http://localhost:4000/groups/getmembers",myobj,{headers:{"Authorization":token}})
                document.getElementById('allmembers').innerHTML=''
                document.getElementById("error2").textContent='You are admin of this group'
                for(let i=0;i<allgroupmembers.data.allmembers.length;i++){
                    displayMembers(allgroupmembers.data.allmembers[i],allgroupmembers.data.isadmin)
                }
                if(allgroupmembers.data.isadmin==false){
                    document.getElementById("error2").textContent='You are not admin of this group';
                }
                localStorage.setItem("recentchats",JSON.stringify(thisgroupchat.data.result))
                displaychats();
            }catch(err){
                    console.log(err)
            }
        }

}

function displayMembers(data, isadmin){
    const div = document.createElement('div');
    const lable = document.createElement('label');
    lable.innerHTML=data.username;
    div.appendChild(lable);
    if(isadmin==true){
    const delbutton = document.createElement('button');
    delbutton.className = 'deluser'
    delbutton.innerHTML = 'Delete'

    const adminbutton = document.createElement('button');
    adminbutton.className="makeadmin";
    adminbutton.innerHTML= 'Make Admin'
    const allmembers = document.getElementById('allmembers')
   
    div.appendChild(delbutton)
    div.appendChild(adminbutton);
    }
    const br = document.createElement('br');
    allmembers.appendChild(div);
}

document.getElementById('allmembers').addEventListener('click',makeadmin);

async function makeadmin(e){
        e.preventDefault();
        try{
        if(e.target.classList.contains("makeadmin")){
        //console.log(e.target.previousSibling.previousSibling.innerHTML);
        const username = e.target.previousSibling.previousSibling.innerHTML
        const groupname= document.getElementById('loggedgroupname').innerHTML;
        var myobj = {
            username : username,
            groupname: groupname
        };
        const token = localStorage.getItem("token")
        const result = await axios.post("http://localhost:4000/user/makeadmin",myobj,{headers:{"Authorization":token}})
        document.getElementById("error2").textContent=result.data.message;
        }}catch(err){
          console.log(err)
          document.getElementById("error2").textContent=err.response.data.message;
        }

        try{
            if(e.target.classList.contains("deluser")){
                const username = e.target.previousSibling.innerHTML
                const groupname= document.getElementById('loggedgroupname').innerHTML;
                    var myobj = {
                        username : username,
                        groupname: groupname
                    };
                const token = localStorage.getItem("token")
                await axios.post("http://localhost:4000/groups/deleteuser",myobj,{headers:{"Authorization":token}})
                e.target.parentNode.remove()
            }
        }catch(err){
            console.log(err);
        }
}


