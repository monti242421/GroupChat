

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
               // showDataToScreen(res.data.newexpense)   
            }         
        catch(err)
            {
                  console.log(err)
            };

            
}

function showDataToScreen(data){
   
    var category = data.category;
    var description = data.description;
    var amount = data.amount;
    var li =document.createElement("li");
    li.className="delete"
    li.id = data.id;
    var div1 = document.createElement("div");
    div1.appendChild(document.createTextNode(amount));
    div1.className="filecontent";
    var div2 = document.createElement("div");
    div2.appendChild(document.createTextNode(description));
    div2.className="filecontent";
    var div3 = document.createElement("div");
    div3.appendChild(document.createTextNode(category));
    div3.className="filecontent";

   // li.appendChild(document.createTextNode(amount +"-"+description+"-"+category   ));
   li.appendChild(div1);
   li.appendChild(div2);
   li.appendChild(div3);
    var deletebtn = document.createElement("button");
    deletebtn.className="btn btn-danger btn-sm btn-space delete";
    deletebtn.appendChild(document.createTextNode("Del"));

    li.appendChild(deletebtn);
    items.appendChild(li);
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

function showLeaderboard(){
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value="Show Leaderboard";
    inputElement.onclick = async() =>{
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get("http://localhost:4000/premium/showleaderboard",{headers:{"Authoriztion":token}})
        console.log(userLeaderBoardArray);

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML +='<h1> Leader Board</h1>'
        userLeaderBoardArray.data.forEach(userDetails => {
            leaderboardElem.innerHTML +=`<li>Name - ${userDetails.username} :   Total Expense - ${userDetails.totalExpenses}`
        });
    }
    document.getElementById("message").appendChild(inputElement);
}


var pagination = document.getElementById("pagination");
function showPagination(currentPage,hasNextPage,nextPage,hasPreviosPage,previousPage,lastPage){
    pagination.innerHTML = '';
    if(hasPreviosPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML=previousPage
        btn2.addEventListener('click',()=>getProducts(previousPage))
        pagination.appendChild(btn2);
    }
        const btn1 = document.createElement('button');
        btn1.innerHTML=currentPage
        btn1.addEventListener('click',()=>getProducts(currentPage))
        pagination.appendChild(btn1);

    if(hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=>getProducts(nextPage))
        pagination.appendChild(btn3);
    }

}

async function getProducts(page){
    try{    
    items.innerHTML='';
    var pagelimit=localStorage.getItem("pagelimit");
    const token = localStorage.getItem("token")
    var res =await axios.get("http://localhost:4000/expense/getexpense/"+page,{headers:{"Authoriztion":token},params:{pagelimit:pagelimit}})
    showPagination(res.data.currentPage,res.data.hasNextPage,res.data.nextPage,res.data.hasPreviousPage,res.data.previousPage)
    for( var i=0;i<res.data.result.length;i++){
        showDataToScreen(res.data.result[i]);
    }
    document.getElementById('pagelimitvalue').innerHTML=pagelimit;
    }
    catch(err){
        console.log(err);
    }
    
}


window.addEventListener("DOMContentLoaded",async ()=>{
    try{
        const token = localStorage.getItem("token")
        const decodedtoken = parseJwt(token);
        //console.log(decodedtoken);
        const ispremiumuser = decodedtoken.ispremiumuser;
        if(ispremiumuser){
            showpreiumusermessage();
            showLeaderboard();
        }
        const page=1;
        var pagelimit=localStorage.getItem("pagelimit");
        var res =await axios.get("http://localhost:4000/expense/getexpense/"+page,{headers:{"Authoriztion":token},params:{pagelimit:pagelimit}})
        console.log(res);
        showPagination(res.data.currentPage,res.data.hasNextPage,res.data.nextPage,res.data.hasPreviousPage,res.data.previousPage)
        for( var i=0;i<res.data.result.length;i++){
            showDataToScreen(res.data.result[i]);
        }
        document.getElementById('pagelimitvalue').innerHTML=pagelimit;
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

