let submitButton = document.getElementById("signup-button");
let checkdiv = document.getElementById("checkdiv");

submitButton.addEventListener("click",async ()=>{
    let username = document.getElementById("username").value;
    console.log(username);
    //checkdiv.innerHTML = username;
    const res = await fetch("http://localhost:3000/createUser",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({username:username})
    }); 
    const response = await res.json();
    if(response.status == 200){
        console.log(response.data);
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
        chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setStorage(response)
        });
        
        window.location.href = './popup.html';
        
    }
});

function setStorage(response){
    chrome.storage.sync.set({
        "id":response.data[0].id
    });
}