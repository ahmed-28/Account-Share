console.log("this is from bg");
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  chrome.storage.sync.set({
    "logged_in":false
  });
  console.log("local_storage is set");
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

// setting page according to status of user login
chrome.storage.local.get('logged_in', ({logged_in})=> {
  if (logged_in) {
    chrome.action.setPopup({popup: 'popup.html'});
  } 
  else {
    console.log("ui is signup");
    chrome.action.setPopup({popup: 'signup.html'});
  }
});