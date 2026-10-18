const rows = document.querySelectorAll("[data-type]:not(button)");
document.getElementById("typeFilter").addEventListener("click", (e) => {
  const t = e.target.dataset.type;
  if (!t) return;
  document.querySelectorAll("#typeFilter button").forEach((b) => {
    b.classList.toggle("active", b === e.target);
    b.classList.toggle("btn-brand", b === e.target);
    b.classList.toggle("btn-outline-secondary", b !== e.target);
  });
  rows.forEach((r) => (r.hidden = t !== "All" && r.dataset.type !== t));
});
let asc = true;
document.getElementById("sortPrice").onclick = (e) => {
  const tb = document.querySelector("#priceTable tbody");
  [...tb.rows]
    .sort((a, b) => (asc ? 1 : -1) * (a.dataset.price - b.dataset.price))
    .forEach((r) => tb.appendChild(r));
  e.target.textContent = `Sort by price: ${asc ? "high to low" : "low to high"}`;
  asc = !asc;
};
