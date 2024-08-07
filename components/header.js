function addStyles() {
  const styles = `
  body {
    font-family: Arial, sans-serif;
  }
  
  header {
    background-color: #333;
    color: #fff;
    padding: 10px 0;
    text-align: center;
  }
  
  header #branding {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  header #branding #logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  
  header h1 {
    font-size: 24px;
    margin: 0;
  }
  
  header nav ul {
    list-style: none;
    padding: 0;
  }
  
  header nav ul li {
    display: inline;
    margin: 0 10px;
  }
  
  header nav ul li a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
  }
  
  header nav ul li a:hover {
    text-decoration: underline;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function getHeader() {
  const headerContent = `
  <header>
    <div class="container">
      <div id="branding">
        <img src="Accessible_world_logo.jpg" alt="Accessible World Tutorials Logo" id="logo">
        <h1>Welcome to Accessible World Tutorials</h1>
<p>We believe that learning should be inclusive and accessible to everyone. That's why Accessible World Tutorials offers a range of learning options to suit your needs. Whether you prefer free courses, paid courses, or personalized instruction at a nominal fee, we are here to help you on your learning journey. Utilize these features and learn happily with us!</p>
      </div>
      <nav>
        <ul type="none">
          <li><a href="index.html">Home</a></li>
          <li><a href="html_tutorials.html">HTML Tutorials</a></li>
          <li><a href="javascript_tutorials.html">JavaScript Tutorials</a></li>
          <li><a href="Stock_market.html">Stock Market Tutorials</a></li>
          <li><a href="tech_updates.html">Tech Updates</a></li>
<li><a href="paied_courses.html">Paied Courses</a></li>
<li><a href="personal_instructor.html">Personal Instructor</a></li>

        </ul>
      </nav>
    </div>
<artical>
<p>Video of the day:</p>
<br>
<p>We will upload the latest video link here...</p>
</artical>
  </header>
  `;

  return headerContent;
}

document.addEventListener("DOMContentLoaded", function () {
  addStyles();
  const headerContent = document.getElementById("headerContent");
  headerContent.innerHTML = getHeader();
});
