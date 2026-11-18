for (const dropdown of document.querySelectorAll(".dropdown")) {
  const toggle = dropdown.querySelector(".dropdown-toggle");
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = open => toggle.setAttribute("aria-expanded", String(open));

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  dropdown.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  dropdown.addEventListener("focusout", event => {
    if (!dropdown.contains(event.relatedTarget)) setOpen(false);
  });

  document.addEventListener("click", event => {
    if (!dropdown.contains(event.target)) setOpen(false);
  });
}
