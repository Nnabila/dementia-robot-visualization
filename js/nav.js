//Sets up every dropdown menu in the top bar.
for (const dropdown of document.querySelectorAll(".dropdown")) {
  //Finds the menu's button and creates helpers that check and change whether the menu is open.
  const toggle = dropdown.querySelector(".dropdown-toggle");
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = open => toggle.setAttribute("aria-expanded", String(open));

  //Opens or closes the menu when the button is clicked.
  toggle.addEventListener("click", () => setOpen(!isOpen()));

  //Closes the menu when the Escape key is pressed and moves keyboard focus back to the button.
  dropdown.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  //Closes the menu when keyboard focus moves to something outside of it.
  dropdown.addEventListener("focusout", event => {
    if (!dropdown.contains(event.relatedTarget)) setOpen(false);
  });

  //Closes the menu when the visitor clicks anywhere else on the page.
  document.addEventListener("click", event => {
    if (!dropdown.contains(event.target)) setOpen(false);
  });
}
