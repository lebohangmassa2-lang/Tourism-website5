const $ = (s) => document.querySelector(s);
function problem(el) {
  const v = el.value.trim();
  if (el.type === "checkbox")
    return el.required && !el.checked ? "Please tick this box to continue." : "";
  if (el.required && !v) return "This field is required.";
  if (!v) return "";
  if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v))
    return "Enter a valid email, like name@example.com.";
  if (el.type === "tel" && !/^\+?[0-9 ]{8,15}$/.test(v))
    return "Enter 8 to 15 digits. You may start with +.";
  if (el.minLength > 0 && v.length < el.minLength)
    return `Use at least ${el.minLength} characters.`;
  if (el.dataset.strong !== undefined && !/\d/.test(v)) return "Include at least one number.";
  if (el.dataset.match && v !== $(el.dataset.match).value) return "Passwords do not match.";
  if (el.type === "date" && v < new Date().toISOString().slice(0, 10))
    return "Choose today or a future date.";
  if (el.type === "number" && (+v < +el.min || +v > +el.max))
    return `Enter a number from ${el.min} to ${el.max}.`;
  return "";
}
function check(el) {
  const m = problem(el),
    fb = el.closest(".mb-3,.form-check")?.querySelector(".invalid-feedback");
  if (fb) fb.textContent = m;
  el.classList.toggle("is-invalid", !!m);
  el.classList.toggle("is-valid", !m && (el.type === "checkbox" ? el.checked : !!el.value));
  return !m;
}
const validate = (f) =>
  [...f.querySelectorAll("input:not([type=radio]),select,textarea")]
    .map(check)
    .every(Boolean);
const bk = () => JSON.parse(localStorage.getItem("lt-bookings") || "[]");
function drawBookings() {
  const b = bk();
  $("#bkTable tbody").innerHTML = b
    .map(
      (x) =>
        `<tr><td>${x.name}</td><td>${x.dest}, ${x.nights} nights</td><td>M${x.total.toLocaleString()}</td><td><button class="btn-close" data-del="${x.id}" aria-label="Remove booking for ${x.name}"></button></td></tr>`,
    )
    .join("");
  $("#bkEmpty").hidden = b.length > 0;
  $("#bkTable").hidden = !b.length;
  $("#bkClear").hidden = !b.length;
}
const bf = document.querySelector("[data-form=booking]");
function estimate() {
  const e = bf.elements,
    g = +e.guests.value || 0,
    n = +e.nights.value || 0,
    d = e.dest.selectedOptions[0],
    s = e.stay.selectedOptions[0];
  const t = g * (+d.dataset.cost || 0) + Math.ceil(g / 2) * n * (+s.dataset.rate || 0);
  $("#estimate").textContent = "M" + t.toLocaleString();
  return t;
}
bf.addEventListener("input", estimate);
document.addEventListener("click", (e) => {
  if (e.target.dataset.del) {
    localStorage.setItem(
      "lt-bookings",
      JSON.stringify(bk().filter((x) => x.id != e.target.dataset.del)),
    );
    drawBookings();
  }
});
$("#bkClear").onclick = () => {
  localStorage.removeItem("lt-bookings");
  drawBookings();
};
document.querySelectorAll("form[data-form]").forEach((f) => {
  f.addEventListener("focusout", (e) => {
    if (e.target.matches("input,select,textarea")) check(e.target);
  });
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const res = f.querySelector(".result");
    if (!validate(f)) {
      res.innerHTML =
        '<div class="alert alert-danger" role="alert">Please fix the highlighted fields.</div>';
      f.querySelector(".is-invalid").focus();
      return;
    }
    const d = Object.fromEntries(new FormData(f));
    localStorage.setItem("lt-user", d.name.split(" ")[0]);
    let msg = "Thank you! We will reply within two working days.";
    if (f.dataset.form === "booking") {
      const t = estimate(),
        o = f.elements.dest.selectedOptions[0].textContent;
      localStorage.setItem(
        "lt-bookings",
        JSON.stringify([
          ...bk(),
          { id: Date.now(), name: d.name, dest: o, nights: d.nights, total: t },
        ]),
      );
      msg = `Booking received for ${o}. Estimated cost M${t.toLocaleString()}.`;
      drawBookings();
    }
    if (f.dataset.form === "join")
      msg = `Welcome to the club, ${d.name.split(" ")[0]}! Your account is ready.`;
    res.innerHTML = `<div class="alert alert-success alert-dismissible" role="status">${msg}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    f.reset();
    f.querySelectorAll(".is-valid,.is-invalid").forEach((x) =>
      x.classList.remove("is-valid", "is-invalid"),
    );
    estimate();
    $("#navUser").textContent = "Hi, " + d.name.split(" ")[0];
    $("#navUser").classList.remove("d-none");
  });
});
bf.elements.date.min = new Date().toISOString().slice(0, 10);
const plan = JSON.parse(localStorage.getItem("lt-plan") || "null");
if (plan) {
  $("#planAlert").innerHTML =
    `<div class="alert alert-info alert-dismissible">Your saved activity plan: ${plan.names.join(", ")} for ${plan.n} people (M${plan.total.toLocaleString()}).<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  bf.elements.notes.value = "Activities: " + plan.names.join(", ");
}
drawBookings();
estimate();
