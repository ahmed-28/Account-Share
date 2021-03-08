function changepage(){
    console.log("hi");
    document.location.href = "signup.html";
}
window.onload = function () {
    document.getElementsByTagName("button")[0].onclick = changepage;
}