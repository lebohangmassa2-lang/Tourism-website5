const items = [...document.querySelectorAll(".g-item")],
  $ = (s) => document.querySelector(s),
  modal = new bootstrap.Modal($("#lightbox"));
let vis = items,
  i = 0;
const show = (n) => {
  i = (n + vis.length) % vis.length;
  const im = vis[i].querySelector("img");
  $("#lbImg").src = im.src;
  $("#lbImg").alt = im.alt;
  $("#lbTitle").textContent = vis[i].querySelector("figcaption").textContent;
  $("#lbCount").textContent = `${i + 1} of ${vis.length}`;
};
items.forEach(
  (f) =>
    (f.querySelector("button").onclick = () => {
      vis = items.filter((x) => !x.hidden);
      i = vis.indexOf(f);
      show(i);
      modal.show();
    }),
);
$("#lbPrev").onclick = () => show(i - 1);
$("#lbNext").onclick = () => show(i + 1);
addEventListener("keydown", (e) => {
  if (!$("#lightbox").classList.contains("show")) return;
  if (e.key === "ArrowLeft") show(i - 1);
  if (e.key === "ArrowRight") show(i + 1);
});
$("#gFilter").addEventListener("click", (e) => {
  const c = e.target.dataset.cat;
  if (!c) return;
  document.querySelectorAll("#gFilter button").forEach((b) => {
    b.classList.toggle("active", b === e.target);
    b.classList.toggle("btn-brand", b === e.target);
    b.classList.toggle("btn-outline-secondary", b !== e.target);
  });
  items.forEach((f) => (f.hidden = c !== "All" && f.dataset.cat !== c));
});
