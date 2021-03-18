let changeColor = document.getElementById("changeColor");
let welcome = document.getElementById("welcome");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

chrome.storage.sync.get("id",({id}) => {
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
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }