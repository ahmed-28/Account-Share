const axios = require("axios").default;

let submitButton = document.getElementById("signup-button");

submitButton.addEventListener("click",async ()=>{
    let username = document.getElementById("username").innerText;
    console.log(username);
    axios.post("localhost:3000/createUser",{
        username:username
    })
    .then((res)=>{
        console.log(res.message);
    })
    .catch((err)=>{
        console.log(err);
    });
});