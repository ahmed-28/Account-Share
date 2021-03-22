let changeColor = document.getElementById("changeColor");
let welcome = document.getElementById("welcome");
let submitButton = document.getElementById("share-button");
let setButton = document.getElementById("set-button");

setButton.addEventListener("click",async ()=>{
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setCookie,
  });
});

function setCookie(){
  console.log("from set");
  chrome.runtime.sendMessage({greeting: "sample_set"});
}


chrome.storage.local.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

chrome.storage.local.get("id",({id}) => {
  fetch(`http://localhost:3000/getUser?id=${id}`)
  .then(res => res.json())
  .then(res => {
    const username = res.username;
    welcome.innerHTML = username;
  })
  .catch(err => console.log(err));
})

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.local.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }

var CURTAB;
submitButton.addEventListener('click', async () => {
  const to_user = document.getElementById("to_user").value;
  console.log("in share");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  CURTAB = tab;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getCookie,
  });
  
});

async function getCookie(){
  console.log("helllooo");
  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.data);
  });
  
}

