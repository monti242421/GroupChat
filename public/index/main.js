var form = document.getElementById("expenseform");
var items = document.getElementById("items");
form.addEventListener('submit',addexpense);
items.addEventListener('click',removeItem);


async function addexpense(e){
        e.preventDefault();
        var amount = document.getElementById("amount").value;
        var description = document.getElementById("description").value;
        var category = document.getElementById("category").value;
       


        var myobj = {
            amount : amount,
            description: description,
            category: category
        };

        try{
            const token = localStorage.getItem("token")
            var res = await axios.post("http://localhost:4000/expense/addexpense",myobj,{headers:{"Authoriztion":token}})
                console.log(res);
                showDataToScreen(res.data.newexpense)   
            }         
            catch(err){
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

document.getElementById('rzr-button1').onclick = async function(e){
console.log("razor");
const token = localStorage.getItem("token");
const response = await axios.get("http://localhost:4000/purchase/premiummembership",{headers:{"Authoriztion":token}})
console.log(response);
var options={
    "key":response.data.key_id,
    "order_id":response.data.order.id,
    "handler":async function(response){
       var result = await axios.post("http://localhost:4000/purchase/updatetransactionstatus",
        {
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id
        },{headers:{"Authoriztion":token}})
        console.log("result"+result);
        alert("You are premium user now");
        showpreiumusermessage()
        console.log(result.data);
        showLeaderboard();
        localStorage.setItem('token', result.data.token)
    }

}

const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed',function(response){
    console.log(response);
    alert('Something went wrong');

})
}
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

async function download(){
    console.log("download")
    try{
        const token = localStorage.getItem("token")
        var response =  await axios.get('http://localhost:4000/user/download', {headers:{"Authoriztion":token}})
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    }catch(err) {
        showError(err)       
    };
}

document.getElementById('pagelimitbutton').onclick =async function(e){
    var pagelimit = document.getElementById('pagelimit').value;
    if(pagelimit>7){
        pagelimit=7
    }
    document.getElementById('pagelimitvalue').innerHTML=pagelimit;
    localStorage.setItem('pagelimit',pagelimit);
}
