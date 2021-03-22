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

// setting page according to status of user login



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

        myCookie.forEach(function(tmp) {
          let url = sender.tab.url;
          let newCookie = Object.assign({ url }, pick(tmp, properties))
          chrome.cookies.set(newCookie,(cookie)=>{
            if(cookie!=null)
              console.log("success");
          });
        });
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




