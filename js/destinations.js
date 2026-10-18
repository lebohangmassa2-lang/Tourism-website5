const PER_PAGE = 6; 
const $ = (selector) => document.querySelector(selector);

const grid = $("#grid");
const cards = [...grid.querySelectorAll(".dest-col")]; 

const state = { cat: "All", q: "", sort: "az", page: 1, current: null };


const params = new URLSearchParams(location.search);
state.cat = params.get("cat") || "All";
state.q = params.get("q") || "";
$("#q").value = state.q;


const cardName = (card) => card.querySelector("h2").textContent;
const cardText = (card) => card.textContent.toLowerCase();
const findCard = (id) => cards.find((card) => card.dataset.id === id);


function getFavourites() {
  return JSON.parse(localStorage.getItem("lt-fav") || "[]");
}

function toggleFavourite(id) {
  const favourites = getFavourites();
  const updated = favourites.includes(id)
    ? favourites.filter((item) => item !== id)
    : [...favourites, id]; // add
  localStorage.setItem("lt-fav", JSON.stringify(updated));
  render();
}


function getMatchingCards() {
  const search = state.q.toLowerCase();

  const matches = cards.filter((card) => {
    const inCategory = state.cat === "All" || card.dataset.cat === state.cat;
    return inCategory && cardText(card).includes(search);
  });

  const sorters = {
    az: (a, b) => cardName(a).localeCompare(cardName(b)),
    za: (a, b) => cardName(b).localeCompare(cardName(a)),
    cat: (a, b) =>
      a.dataset.cat.localeCompare(b.dataset.cat) || cardName(a).localeCompare(cardName(b)),
  };
  return matches.sort(sorters[state.sort]);
}


function pagerHtml(totalPages) {
  if (totalPages <= 1) return "";

  let numbers = "";
  for (let n = 1; n <= totalPages; n++) {
    numbers += `
      <li class="page-item${state.page === n ? " active" : ""}">
        <button class="page-link" data-p="${n}">${n}</button>
      </li>`;
  }

  return `
    <ul class="pagination flex-wrap">
      <li class="page-item${state.page === 1 ? " disabled" : ""}">
        <button class="page-link" data-p="${state.page - 1}">Previous</button>
      </li>
      ${numbers}
      <li class="page-item${state.page === totalPages ? " disabled" : ""}">
        <button class="page-link" data-p="${state.page + 1}">Next</button>
      </li>
    </ul>`;
}

function savedListHtml() {
  const ids = getFavourites();
  if (ids.length === 0) return '<li class="muted">Nothing saved yet.</li>';

  return ids
    .map((id) => {
      const name = cardName(findCard(id));
      return `
        <li>
          <span>${name}</span>
          <button class="btn-close" data-fav="${id}" aria-label="Remove ${name}"></button>
        </li>`;
    })
    .join("");
}

function updateFavouriteButton() {
  $("#dmFav").textContent = getFavourites().includes(state.current.dataset.id)
    ? "Remove from saved"
    : "Save this place";
}


function render() {
  const matches = getMatchingCards();
  const totalPages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  state.page = Math.min(state.page, totalPages);

  const start = (state.page - 1) * PER_PAGE;
  const onThisPage = matches.slice(start, start + PER_PAGE);

  cards.forEach((card) => (card.hidden = true)); 
  matches.forEach((card) => grid.appendChild(card)); 
  onThisPage.forEach((card) => (card.hidden = false)); 


  const favourites = getFavourites();
  cards.forEach((card) => {
    const button = card.querySelector("[data-fav]");
    const saved = favourites.includes(card.dataset.id);
    button.textContent = saved ? "Saved" : "Save";
    button.setAttribute("aria-pressed", saved);
  });

  $("#noResults").hidden = matches.length > 0;
  $("#count").textContent =
    `${matches.length} destination${matches.length === 1 ? "" : "s"} found`;
  $("#pager").innerHTML = pagerHtml(totalPages);
  $("#favList").innerHTML = savedListHtml();

  if (state.current) updateFavouriteButton();
}

function openDetails(id) {
  const card = findCard(id);
  const image = card.querySelector("img");
  state.current = card;

  $("#dmTitle").textContent = cardName(card);
  $("#dmImg").src = image.getAttribute("src");
  $("#dmImg").alt = image.alt;
  $("#dmDesc").textContent = card.querySelector(".card-body > p:not(.small)").textContent;
  $("#dmWhere").textContent = card.querySelector(".small").textContent;
  $("#dmBest").textContent = card.dataset.best;

  updateFavouriteButton();
  bootstrap.Modal.getOrCreateInstance($("#destModal")).show();
}

function highlightCategory() {
  document.querySelectorAll("#cats button").forEach((button) => {
    button.classList.toggle("active", button.dataset.cat === state.cat);
  });
}


document.addEventListener("click", (event) => {
  const target = event.target;

  if (target.dataset.fav) toggleFavourite(target.dataset.fav);

  if (target.dataset.p) {
    state.page = Number(target.dataset.p);
    render();
    scrollTo({ top: 0, behavior: "smooth" });
  }

  if (target.dataset.open) openDetails(target.dataset.open);
});

$("#dmFav").onclick = () => toggleFavourite(state.current.dataset.id);


let typingTimer;
$("#q").addEventListener("input", (event) => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    state.q = event.target.value;
    state.page = 1;
    render();
  }, 200);
});


$("#cats").addEventListener("click", (event) => {
  if (!event.target.dataset.cat) return;
  state.cat = event.target.dataset.cat;
  state.page = 1;
  highlightCategory();
  render();
});


$("#sort").addEventListener("click", (event) => {
  if (!event.target.dataset.sort) return;
  state.sort = event.target.dataset.sort;
  render();
});


highlightCategory();
render();
