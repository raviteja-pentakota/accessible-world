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
        <img src="Accessible_world_logo.jpg" height="83" alt="Accessible World Tutorials Logo">
        <h1>Welcome to Accessible World Tutorials</h1>
        <p>Learning should be inclusive and accessible for all. At Accessible World Tutorials, we offer free courses, paid courses, and personalized instruction to meet your needs. Follow the links below to explore and start your learning journey with us!</p>
      </div>
      <hr role="separator">
      <nav>
        <ul>
     <li><a href="https://accessibleworld.in/index.html">Home</a></li>
          <li><a href="https://accessibleworld.in/html_tutorials.html">HTML Tutorials</a></li>
          <li><a href="https://accessibleworld.in/javascript_tutorials.html">JavaScript Tutorials</a></li>
          <li><a href="https://accessibleworld.in/Stock_market.html">Stock Market Tutorials</a></li>
          <li><a href="https://accessibleworld.in/tech_updates.html">Tech Updates</a></li>
          <li><a href="https://accessibleworld.in/paid_courses.html">Paid Courses</a></li>
          <li><a href="https://accessibleworld.in/personal_instructor.html">Personal Instructor</a></li>
        </ul>
      </nav>
      <hr role="separator">
      <article>
        <h2>Latest Update:</h2>

        <br>
        <p>Our next Accessibility Testing Batch starts on December 2nd!<br>For full details, visit the Paid Courses section.</p>
      </article>
      <hr role="separator">
    </div>
  </header>
  `;

  return headerContent;
}

document.addEventListener("DOMContentLoaded", function () {
  addStyles();
  const headerContent = document.getElementById("headerContent");
  headerContent.insertAdjacentHTML('beforeend', getHeader());
});
