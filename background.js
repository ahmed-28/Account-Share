console.log("this is from bg");
let color = '#3aa757';
let myCookie;

/* ************************ WEBSOCKET IMPLEMENTATION ************************/
var ws = new WebSocket("ws://localhost:8000");
ws.onopen = () => {
  console.log("connected to server");
  ws.send(JSON.stringify({
    id:"hello",
    data : "hello server"
  }));
}

ws.onmessage = async (ev) => {
  console.log(ev);
  const data = JSON.parse(String(ev.data));
  if(data.task=="final_set"){
    console.log("setting finally cookie");
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab.url,tab.id);
    let url = tab.url;
    let storeId;
    var expirationDate = new Date().getTime() / 1000 + 87000;
    chrome.cookies.getAllCookieStores().then((stores) => {
      console.log('final tab',tab.id);
      console.log(stores);
      for(let i=0;i<stores.length;i++){
        if(stores[i].tabIds.includes(tab.id))
          storeId = stores[i].id;
      }
      let myCook = data.data_cookie;
      myCook.forEach((tmp)=>{
        let newCookie = Object.assign({ url,expirationDate,storeId }, pick(tmp, properties));
        console.log(newCookie);
        chrome.cookies.set(newCookie,(cookie)=>{
          if(cookie!=null)
            console.log("success",cookie);
        });
      });
    });
    chrome.tabs.create({url});
  }
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
  //let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let cur_url = new URL(tab.url);
  let domain = cur_url.hostname.replace('www.','');
  chrome.cookies.getAll({domain:domain},(cookie) => {
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
  async function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({data:myCookie});
    
    else if(request.name == "set_user_socket"){
      const user_id = request.user_id;
      ws.send(JSON.stringify({
        id:"set_socket",
        data: user_id
      }));
    }

    else if(request.name == "send_cookie"){
      let to_user = request.to_user;
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      let cur_url = new URL(tab.url);
      let domain = cur_url.hostname.replace('www.','');
      chrome.cookies.getAll({domain:domain},(cookie) => {
        myCookie = cookie;
        chrome.storage.local.set({"myCook":myCookie});
        console.log("sendjhi",cookie);
        ws.send(JSON.stringify({
          id:"send_cookie",
          data:{
            cookie:cookie,
            to_user:to_user
          }
        }));
      });
    }
    
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




