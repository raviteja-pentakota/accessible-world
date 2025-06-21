document.addEventListener('DOMContentLoaded', () => {
    const coursesBtn = document.getElementById('coursesBtn');
    const coursesMenu = document.getElementById('coursesMenu');

    if (coursesBtn && coursesMenu) {
        coursesBtn.addEventListener('click', () => {
            const isExpanded = coursesBtn.getAttribute("aria-expanded") === "true";
            coursesBtn.setAttribute("aria-expanded", !isExpanded);
            coursesMenu.style.display = isExpanded ? "none" : "block";
        });
    }
});
