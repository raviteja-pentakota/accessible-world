function getFooter() {
  const footerContent = `
  <footer style="background-color: #282828; color: white; text-align: center; padding: 20px; font-family: Arial, sans-serif;">
    <div style="margin-bottom: 15px;">
      <h3>Accessible World Tutorials</h3>
      <p>&copy; 2024 Accessible World Tutorials. All Rights Reserved.</p>
    </div>
    <div>
      <p>Contact Us: </p>
      <p>Mobile: <a href="tel:+917731879173" style="color: #00aaff;">7731879173</a></p>
      <p>Email: <a href="mailto:raviteja26j@gmail.com" style="color: #00aaff;">raviteja26j@gmail.com</a></p>
    </div>
  </footer>
  `;

  return footerContent;
}

document.addEventListener("DOMContentLoaded", function () {
  const footerContent = document.getElementById("footerContent");
  footerContent.innerHTML = getFooter();
});
