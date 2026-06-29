const btn = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");

function setOpen(open) {
  if (!btn || !menu) return;

  btn.classList.toggle("is-open", open);
  menu.classList.toggle("is-open", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
}

// Burger Button Click
if (btn) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = !btn.classList.contains("is-open");
    setOpen(open);
  });
}

// Links im Menü klicken = Menü schließen
if (menu) {
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      setOpen(false);
    }
  });
}

// ESC schließt Menü
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setOpen(false);
  }
});
