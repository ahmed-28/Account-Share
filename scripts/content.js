console.log("this is front");
console.log(document.cookie);
var first = document.createElement("button");
first.innerText = "pls show up";
first.id = "first";

document.querySelector("body").appendChild(first);