function getFooter() {
  const footerContent = `
  <footer>
    <p>Accessible World Tutorials &copy; 2024</p>
  </footer>
</div>  
  `;

  return footerContent;
}
document.addEventListener("DOMContentLoaded", function () {
  const footerContent = document.getElementById("footerContent");
  footerContent.innerHTML = getFooter();
});

