const toggleBtn = document.getElementById("toggleNavBtn");
const nav = document.getElementById("courseNav");
const menuList = document.getElementById("menuList");
const menuItems = Array.from(menuList.querySelectorAll("a[role='menuitem']"));

toggleBtn.addEventListener("click", () => {
    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";

    toggleBtn.setAttribute("aria-expanded", String(!isOpen));
    nav.hidden = isOpen;

    toggleBtn.textContent = isOpen ? "☰ Open Course Navigation" : "✖ Close Course Navigation";

    if (!isOpen) {
        menuItems[0].focus();
    }
});

// Arrow keys navigation
menuList.addEventListener("keydown", (e) => {
    const index = menuItems.indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
        e.preventDefault();
        menuItems[(index + 1) % menuItems.length].focus();
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        menuItems[(index - 1 + menuItems.length) % menuItems.length].focus();
    }

    if (e.key === "Escape") {
        closeMenu();
        toggleBtn.focus();
    }
});

function closeMenu() {
    nav.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.textContent = "☰ Open Course Navigation";
}

// Close when tabbing out
menuItems[menuItems.length - 1].addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !e.shiftKey) closeMenu();
});

menuItems[0].addEventListener("keydown", (e) => {
    if (e.key === "Tab" && e.shiftKey) closeMenu();
});
