const btn = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");

function setOpen(open) {
  if (!btn || !menu) {
    console.error("Button oder Menü nicht gefunden!");
    return;
  }
  
  btn.classList.toggle("is-open", open);
  menu.classList.toggle("is-open", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  
  console.log("Menü ist jetzt:", open ? "OFFEN" : "GESCHLOSSEN");
}

// Burger Button Click
if (btn) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = !btn.classList.contains("is-open");
    setOpen(open);
    console.log("Burger Button geklickt!");
  });
} else {
  console.error("navToggle Button nicht gefunden!");
}

// Links im Menü klicken = Menü schließen
if (menu) {
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      console.log("Link geklickt:", link.href);
      setOpen(false);
    }
  });
} else {
  console.error("navMenu nicht gefunden!");
}

// ESC schließt Menü
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setOpen(false);
  }
});

console.log("Menu Script geladen ✓");