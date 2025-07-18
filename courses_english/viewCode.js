const viewCode = document.getElementById("viewCode");
const codeExample = document.getElementById("codeExample");

viewCode.addEventListener("click", function(){
if (codeExample.style.display === "block"){
viewCode.setAttribute("aria-expanded", "false");
codeExample.style.display = "none";

}
else {
codeExample.style.display = "block";
viewCode.setAttribute("aria-expanded", "true");

}
})
