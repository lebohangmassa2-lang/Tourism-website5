const $ = (s) => document.querySelector(s),
  boxes = [...document.querySelectorAll(".est")];
$("#season").onchange = (e) =>
  document
    .querySelectorAll("[data-season]")
    .forEach(
      (c) =>
        (c.hidden = e.target.value !== "all" && !c.dataset.season.includes(e.target.value)),
    );
function calc() {
  const n = Math.max(1, Math.min(20, +$("#people").value || 1));
  const sum = boxes.filter((b) => b.checked).reduce((s, b) => s + +b.dataset.price, 0);
  $("#total").textContent = "M" + (sum * n).toLocaleString();
  return { n, sum };
}
boxes.forEach((b) => (b.onchange = calc));
$("#people").oninput = calc;
$("#savePlan").onclick = () => {
  const { n, sum } = calc(),
    names = boxes.filter((b) => b.checked).map((b) => b.dataset.name);
  $("#planMsg").innerHTML = names.length
    ? '<div class="alert alert-success mb-0">Plan saved. It will appear on the booking page.</div>'
    : '<div class="alert alert-danger mb-0">Tick at least one activity first.</div>';
  if (names.length)
    localStorage.setItem("lt-plan", JSON.stringify({ names, n, total: sum * n }));
};
const old = JSON.parse(localStorage.getItem("lt-plan") || "null");
if (old) {
  old.names.forEach((nm) => {
    const b = boxes.find((x) => x.dataset.name === nm);
    if (b) b.checked = true;
  });
  $("#people").value = old.n;
}
calc();
