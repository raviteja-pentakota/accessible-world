const englishButton = document.getElementById("englishButton");
const teluguButton = document.getElementById("teluguButton");
const englishTopics = document.getElementById("englishTopics");
const teluguTopics = document.getElementById("teluguTopics");

englishButton.addEventListener("click", function(){
if (englishTopics.style.display === "block"){
englishButton.setAttribute("aria-expanded", "false");
englishTopics.style.display = "none";

}
else {
englishTopics.style.display = "block";
englishButton.setAttribute("aria-expanded", "true");

}
})
teluguButton.addEventListener("click", function () {
if (teluguTopics.style.display === "block"){
teluguButton.setAttribute("aria-expanded", "false");
teluguTopics.style.display = "none";
}
else {
teluguButton.setAttribute("aria-expanded", "true");
teluguTopics.style.display = "block";
}
})