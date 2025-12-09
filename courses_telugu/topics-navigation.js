/* -------------------------------
   HTML Topics Navigation
--------------------------------*/
const htmlPages = document.querySelectorAll('.intro-page');
const htmlPrev = document.getElementById('prevBtn');
const htmlNext = document.getElementById('nextBtn');
const htmlIndicator = document.getElementById('pageIndicator');
const htmlDropdown = document.getElementById('topicDropdown');

let htmlCurrentPage = 1;
const htmlTotal = htmlPages.length;

function showHtmlPage(num) {
    htmlPages.forEach((p, i) => {
        p.classList.toggle('active', i + 1 === num);
    });

    htmlDropdown.value = num;
    htmlIndicator.textContent = `Page ${num} of ${htmlTotal}`;
    htmlPrev.disabled = num === 1;
    htmlNext.disabled = num === htmlTotal;
}

htmlPrev.addEventListener('click', () => {
    if (htmlCurrentPage > 1) {
        htmlCurrentPage--;
        showHtmlPage(htmlCurrentPage);
    }
});

htmlNext.addEventListener('click', () => {
    if (htmlCurrentPage < htmlTotal) {
        htmlCurrentPage++;
        showHtmlPage(htmlCurrentPage);
    }
});

htmlDropdown.addEventListener('change', function () {
    htmlCurrentPage = parseInt(this.value);
    showHtmlPage(htmlCurrentPage);
});

showHtmlPage(htmlCurrentPage);


/* -------------------------------
   JavaScript Topics Navigation
--------------------------------*/
const jsPages = document.querySelectorAll('.javascript-page');
const jsPrev = document.getElementById('jsprevBtn');
const jsNext = document.getElementById('jsnextBtn');
const jsIndicator = document.getElementById('jspageIndicator');
const jsDropdown = document.getElementById('jstopicDropdown');

let jsCurrentPage = 1;
const jsTotal = jsPages.length;

function showJsPage(num) {
    jsPages.forEach((p, i) => {
        p.classList.toggle('active', i + 1 === num);
    });

    jsDropdown.value = num;
    jsIndicator.textContent = `Page ${num} of ${jsTotal}`;
    jsPrev.disabled = num === 1;
    jsNext.disabled = num === jsTotal;
}

jsPrev.addEventListener('click', () => {
    if (jsCurrentPage > 1) {
        jsCurrentPage--;
        showJsPage(jsCurrentPage);
    }
});

jsNext.addEventListener('click', () => {
    if (jsCurrentPage < jsTotal) {
        jsCurrentPage++;
        showJsPage(jsCurrentPage);
    }
});

jsDropdown.addEventListener('change', function () {
    jsCurrentPage = parseInt(this.value);
    showJsPage(jsCurrentPage);
});

// Initialize JS pagination
showJsPage(jsCurrentPage);
//HTML search
document.addEventListener("DOMContentLoaded", function() {

  const htmlSearchInput = document.getElementById("htmlSearch");
  const htmlResultsList = document.getElementById("htmlResults");
  const htmlResultCount = document.getElementById("htmlResultCount");

  const htmlPages = document.querySelectorAll(".intro-page"); // your HTML pages
  let htmlLessons = [];

  htmlPages.forEach((page, index) => {
      const h2 = page.querySelector("h2");
      const title = h2 ? h2.innerText.trim() : `Lesson ${index + 1}`;
      htmlLessons.push({ id: index + 1, title, page });
  });

  // Function to show HTML page
function showHtmlPage(id) {
    htmlPages.forEach(p => p.classList.remove("active"));
    const selected = document.getElementById(`intro-page${id}`);
    if (selected) selected.classList.add("active");

    // Move focus to the main heading of the page
    const heading = selected.querySelector("h2");
    if (heading) {
        heading.setAttribute("tabindex", "-1"); // make focusable if not already
        heading.focus();
    }

    // Clear search results
    htmlResultsList.innerHTML = "";
    htmlSearchInput.value = "";
}
  // Input search event
  htmlSearchInput.addEventListener("input", function() {
      const query = this.value.toLowerCase().trim();
      htmlResultsList.innerHTML = "";
      htmlResultCount.textContent = "";

      if (!query) return;

      const matches = htmlLessons.filter(lesson => lesson.title.toLowerCase().includes(query));

      // Update screen reader count
      if (matches.length === 0) {
          htmlResultCount.textContent = "No results found";
          htmlResultsList.innerHTML = `<li>No results found</li>`;
          return;
      } else if (matches.length === 1) {
          htmlResultCount.textContent = "1 result found";
      } else {
          htmlResultCount.textContent = `${matches.length} results found`;
      }

      // Populate results
      matches.forEach(lesson => {
          const li = document.createElement("li");
          li.textContent = lesson.title;
          li.tabIndex = -1; // initially not focusable
          li.style.cursor = "pointer";
          li.style.padding = "4px 0";
          htmlResultsList.appendChild(li);

          li.addEventListener("click", () => showHtmlPage(lesson.id));
      });
  });

  // Arrow key navigation
  htmlSearchInput.addEventListener("keydown", function(e) {
      const items = htmlResultsList.querySelectorAll("li");
      if (!items.length) return;

      let currentIndex = Array.from(items).findIndex(item => item === document.activeElement);

      if (e.key === "ArrowDown") {
          e.preventDefault();
          if (currentIndex === -1) items[0].focus();
          else if (currentIndex < items.length - 1) items[currentIndex + 1].focus();
      } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (currentIndex > 0) items[currentIndex - 1].focus();
          else htmlSearchInput.focus();
      } else if (e.key === "Escape") {
          htmlResultsList.innerHTML = "";
          htmlResultCount.textContent = "";
          htmlSearchInput.value = "";
      } else if (e.key === "Enter") {
          if (currentIndex >= 0) {
              showHtmlPage(currentIndex + 1);
          }
      }
  });

});

// JS search
const jsSearchInput = document.getElementById("jsSearch");
const jsResultsList = document.getElementById("jsResults");
const jsResultCount = document.getElementById("jsResultCount");

// Collect JS lessons dynamically
let jsLessons = [];
jsPages.forEach((page, index) => {
    const title = page.querySelector("h2").innerText;
    jsLessons.push({ id: index + 1, title });
});

// Show JS page + move focus to heading
function openJsLesson(id) {
    jsCurrentPage = id;
    showJsPage(jsCurrentPage);

    // Move focus to the heading of the opened page
    const selected = document.getElementById(`javascript-page${id}`);
    const heading = selected.querySelector("h2");

    if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
    }

    // Clear search
    jsResultsList.innerHTML = "";
    jsSearchInput.value = "";
}

// SEARCH FUNCTION
jsSearchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    jsResultsList.innerHTML = "";

    if (!query) {
        jsResultCount.textContent = "";
        return;
    }

    const matches = jsLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(query)
    );

    // Update screen reader count
    if (matches.length === 0) {
        jsResultCount.textContent = "No results found";
        jsResultsList.innerHTML = `<li>No results found</li>`;
        return;
    } else if (matches.length === 1) {
        jsResultCount.textContent = "1 result found";
    } else {
        jsResultCount.textContent = `${matches.length} results found`;
    }

    // Populate results
    matches.forEach(lesson => {
        const li = document.createElement("li");
        li.textContent = lesson.title;
        li.style.cursor = "pointer";
        li.style.padding = "4px 0";
        li.tabIndex = -1;
        jsResultsList.appendChild(li);

        // Click → open + focus on heading
        li.addEventListener("click", () => openJsLesson(lesson.id));
    });
});

// Arrow key navigation while staying in input
jsSearchInput.addEventListener("keydown", (e) => {
    const items = jsResultsList.querySelectorAll("li");
    if (!items.length) return;

    let currentIndex = Array.from(items).findIndex(item => item === document.activeElement);

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex === -1) {
            items[0].focus();
        } else if (currentIndex < items.length - 1) {
            items[currentIndex + 1].focus();
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
            items[currentIndex - 1].focus();
        } else {
            jsSearchInput.focus();
        }
    } else if (e.key === "Enter") {
        if (currentIndex >= 0) {
            openJsLesson(currentIndex + 1);
        }
    } else if (e.key === "Escape") {
        jsResultsList.innerHTML = "";
        jsResultCount.textContent = "";
        jsSearchInput.value = "";
    }
});


// WCAG search
// WCAG Elements
const wcagPages = document.querySelectorAll('#wcag-pages .wcag-page');
const prevWcagButton = document.getElementById('prev-wcag');
const nextWcagButton = document.getElementById('next-wcag');
const currentWcagNum = document.getElementById('current-wcag-num');
const wcagSelect = document.getElementById("wcag-select");

let currentWcagIndex = 0;

// Function to show WCAG page
function showPage(pages, index, prevButton, nextButton, currentNumSpan) {
    pages.forEach(p => p.classList.remove('active'));
    pages[index].classList.add('active');

    currentNumSpan.textContent = `${index + 1} of ${pages.length}`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === pages.length - 1;
}

// WCAG list (titles)
const criteriaList = [
    '1.1.1 Non-text Content',
    '1.2.1 Audio-only and Video-only (Prerecorded)',
    '1.2.2 Captions (Prerecorded)'
];

// Build WCAG lesson mapping
const wcagLessons = Array.from(wcagPages).map((page, index) => {
    const title = criteriaList[index] || `WCAG Topic ${index + 1}`;
    page.querySelector("h2").textContent = title;
    return { index, title };
});

// Populate dropdown
wcagLessons.forEach((lesson, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = `${idx + 1}. ${lesson.title}`;
    wcagSelect.appendChild(opt);
});

// Dropdown navigation
wcagSelect.addEventListener("change", function () {
    currentWcagIndex = parseInt(this.value);
    showPage(wcagPages, currentWcagIndex, prevWcagButton, nextWcagButton, currentWcagNum);
});

// Buttons navigation
prevWcagButton.addEventListener("click", () => {
    if (currentWcagIndex > 0) {
        currentWcagIndex--;
        wcagSelect.value = currentWcagIndex;
        showPage(wcagPages, currentWcagIndex, prevWcagButton, nextWcagButton, currentWcagNum);
    }
});

nextWcagButton.addEventListener("click", () => {
    if (currentWcagIndex < wcagPages.length - 1) {
        currentWcagIndex++;
        wcagSelect.value = currentWcagIndex;
        showPage(wcagPages, currentWcagIndex, prevWcagButton, nextWcagButton, currentWcagNum);
    }
});

// -------------------------
// WCAG SEARCH
// -------------------------
const wcagSearchInput = document.getElementById("wcagSearch");
const wcagResultsList = document.getElementById("wcagResults");
const wcagResultCount = document.getElementById("wcagResultCount");

wcagSearchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    wcagResultsList.innerHTML = "";
    wcagResultCount.textContent = "";

    if (!query) return;

    const matches = wcagLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(query)
    );

    wcagResultCount.textContent =
        matches.length === 0
            ? "No results found"
            : `${matches.length} results found`;

    matches.forEach(match => {
        const li = document.createElement("li");
        li.textContent = match.title;
        li.style.cursor = "pointer";
        li.tabIndex = -1;

        li.addEventListener("click", () => {
            currentWcagIndex = match.index;
            wcagSelect.value = match.index;

            showPage(wcagPages, currentWcagIndex, prevWcagButton, nextWcagButton, currentWcagNum);

            wcagResultsList.innerHTML = "";
            wcagSearchInput.value = "";
            wcagPages[currentWcagIndex].querySelector("h2").focus();
        });

        wcagResultsList.appendChild(li);
    });
});
