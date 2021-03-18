console.log("this is from bg");
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
    chrome.storage.sync.set({
      "id":null
    });
  console.log("local_storage is set to 123");
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

// setting page according to status of user login

chrome.action.onClicked.addListener(() => {
  console.log("heyyy");
  chrome.storage.sync.get('id', ({id})=> {
    console.log(id);
    if (id) {
      chrome.action.setPopup({popup: 'popup.html'});
    } 
    else {
      console.log("ui is signup");
      chrome.action.setPopup({popup: 'signup.html'});
    }
  
  });
})
