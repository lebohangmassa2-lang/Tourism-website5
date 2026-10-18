(() => {
  const root = document.documentElement,
    btn = document.getElementById("themeBtn");
  const paint = (t) => {
    root.setAttribute("data-bs-theme", t);
    btn.textContent = t === "dark" ? "Light" : "Dark";
    btn.setAttribute("aria-pressed", t === "dark");
  };
  paint(localStorage.getItem("lt-theme") || "light");
  btn.addEventListener("click", () => {
    const t = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("lt-theme", t);
    paint(t);
  });
  document.getElementById("year").textContent = new Date().getFullYear();
 
  document.querySelectorAll(".navbar .nav-link:not(.dropdown-toggle)").forEach((a) =>
    a.addEventListener("click", () => {
      const m = document.getElementById("menu");
      if (m.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(m).hide();
    }),
  );
  const top = document.getElementById("toTop");
  addEventListener("scroll", () => (top.hidden = scrollY < 500));
  top.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  const u = localStorage.getItem("lt-user"),
    b = document.getElementById("navUser");
  if (u) {
    b.textContent = "Hi, " + u;
    b.classList.remove("d-none");
  }
})();
