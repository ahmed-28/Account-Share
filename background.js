console.log("this is from bg");
let color = '#3aa757';
let myCookie;

const properties = [
  'name', 'domain', 'value', 'path', 'secure', 'httpOnly', 'expirationDate'
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

        //let newCookie = Object.assign({ url }, pick(tmp, properties));
        chrome.cookies.getAllCookieStores().then((stores) => {
          console.log('final tab',sender.tab.id);
          console.log(stores);
          var incognitoStores = stores.map(store => store.incognito);
          console.log(`Of ${stores.length} cookie stores, ${incognitoStores.length} are incognito.`);
        });
        var expirationDate = new Date("Tue Mar 22 2022 22:38:00 GMT+0530 (India Standard Time)").getTime() / 1000;
        chrome.cookies.set({
        url:"https://www.primevideo.com/",
        domain: "primevideo.com",
        expirationDate: expirationDate,
        httpOnly: false,
        name: "x-main-av",
        path: "/",
        sameSite: "unspecified",
        secure: true,
        storeId:"1",
        value: '8jQgrbFyTSxihI0ADiNqpQco4IFsQVAKpdFIlh4kzOfBBqdKPZ2uvzeItkVGhDm3'},(cookie)=>{
          if(cookie!=null)
            console.log("success",cookie);
        });
          
        chrome.tabs.create({url});
        //sendResponse({data:"setting done"});
      });     
      //return true; 
    }
  }
);

function pick(base, properties) {
  let newObject = {};
  properties.forEach(key => newObject[key] = base[key]);
  return newObject;
}




