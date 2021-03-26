console.log("this is from bg");
let color = '#3aa757';
let myCookie;

/* ************************ WEBSOCKET IMPLEMENTATION ************************/
var ws = new WebSocket("ws://localhost:8000");
ws.onopen = () => {
  console.log("connected to server");
  ws.send("hello server");
}

ws.onmessage = (ev) => {
  console.log(ev);
}

ws.onclose = () => {
  console.log("connection ended");
}


/* ************************************************************************ */

const properties = [
  'name', 'domain', 'value', 'path', 'secure', 'httpOnly'
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ color });
    chrome.storage.local.set({
      "id":null
    });
  console.log("local_storage is set to 123");
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


chrome.action.onClicked.addListener((tab) => {
  console.log("in listener on click");
  chrome.cookies.getAll({domain:"primevideo.com"},(cookie) => {
    myCookie = cookie;
    chrome.storage.local.set({"myCook":myCookie});
    console.log("hi",cookie);
  });  
  chrome.storage.local.get('id', ({id})=> {
  console.log(id);
  if (id) {
    chrome.action.setPopup({popup: 'popup.html'});
  } 
  else {
    console.log("ui is signup");
    chrome.action.setPopup({popup: 'signup.html'});
  }
  });

});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({data:myCookie});

    
    else if(request.greeting == "sample_set"){
      chrome.storage.local.get("myCook",({myCook}) => {
        myCookie = myCook;
        console.log("hi setting cookie from bg script");
        console.log(myCookie);
        let url = sender.tab.url;
        let storeId;
        var expirationDate = new Date("Thu Mar 24 2022 19:55:12 GMT+0530 (India Standard Time)").getTime() / 1000;

        chrome.cookies.getAllCookieStores().then((stores) => {
          console.log('final tab',sender.tab.id);
          console.log(stores);
          for(let i=0;i<stores.length;i++){
            if(stores[i].tabIds.includes(sender.tab.id))
              storeId = stores[i].id;
          }
          myCook.forEach((tmp)=>{
            let newCookie = Object.assign({ url,expirationDate,storeId }, pick(tmp, properties));
            console.log(newCookie);
            chrome.cookies.set(newCookie,(cookie)=>{
              if(cookie!=null)
                console.log("success",cookie);
            });
          });
        });
        //console.log("found",storeId);
        
        chrome.tabs.create({url});
      });      
    }
  }
);

function pick(base, properties) {
  let newObject = {};
  properties.forEach(key => newObject[key] = base[key]);
  return newObject;
}




