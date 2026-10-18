const user = localStorage.getItem("lt-user"),
  hr = new Date().getHours();
document.getElementById("greeting").textContent =
  (user ? `Lumela, ${user}! ` : "Lumela! ") +
  (hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening") +
  " and welcome.";
Promise.resolve(DATA)
  .then((d) => {
    const pick = ["afriski", "sehlabathebe", "malealea"].map((id) =>
      d.find((x) => x.id === id),
    );
    document.getElementById("featured").innerHTML = pick
      .map(
        (x) =>
          `<div class="col-md-4"><article class="card h-100"><img src="images/${x.id}.svg" alt="Illustrated landscape of ${x.name}"><div class="card-body"><span class="badge text-bg-success mb-2">${x.cat}</span><h3 class="h5">${x.name}</h3><p>${x.desc}</p><a class="btn btn-straw" href="destinations.html?q=${encodeURIComponent(x.name)}">Learn more</a></div></article></div>`,
      )
      .join("");
  })
  .catch(
    () =>
      (document.getElementById("featured").innerHTML =
        '<div class="alert alert-danger">Could not load destinations. Please refresh the page.</div>'),
  );
