const filterBar = document.getElementById("filterBar");
const cardGrid = document.getElementById("cardGrid");
const statsBar = document.getElementById("statsBar");
const searchInput = document.getElementById("searchInput");
const cardTemplate = document.getElementById("cardTemplate");

const categories = ["All", ...new Set(referenceItems.map(item => item.category))];
let activeCategory = "All";
let searchTerm = "";

function buildFilters() {
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = category === activeCategory ? "filter active" : "filter";
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      syncFilterState();
      render();
    });
    filterBar.appendChild(button);
  });
}

function syncFilterState() {
  [...filterBar.children].forEach(button => {
    button.classList.toggle("active", button.textContent === activeCategory);
  });
}

function getFilteredItems() {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  return referenceItems.filter(item => {
    const inCategory = activeCategory === "All" || item.category === activeCategory;
    if (!inCategory) {
      return false;
    }

    if (!normalizedTerm) {
      return true;
    }

    const searchBlob = [
      item.category,
      item.title,
      item.purpose,
      item.summary,
      item.useCase,
      item.importance,
      item.code,
      item.tip
    ].join(" ").toLowerCase();

    return searchBlob.includes(normalizedTerm);
  });
}

function renderStats(items) {
  const counts = categories
    .filter(category => category !== "All")
    .map(category => {
      const total = referenceItems.filter(item => item.category === category).length;
      return `<span><strong>${category}</strong>: ${total}</span>`;
    })
    .join("");

  statsBar.innerHTML = `
    <div class="stat-lead">
      <strong>${items.length}</strong> reference cards shown
    </div>
    <div class="stat-groups">${counts}</div>
  `;
}

function renderCards(items) {
  cardGrid.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.innerHTML = `
      <h2>No matches found.</h2>
      <p>Try a broader search or switch back to a wider category.</p>
    `;
    cardGrid.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const fragment = cardTemplate.content.cloneNode(true);
    fragment.querySelector(".category-pill").textContent = item.category;
    fragment.querySelector(".difficulty").textContent = item.difficulty;
    fragment.querySelector("h2").textContent = item.title;
    fragment.querySelector(".summary").textContent = item.summary;
    fragment.querySelector(".purpose-tag").textContent = item.purpose;
    fragment.querySelector(".example-tag").textContent = item.exampleType;
    fragment.querySelector(".use-case").textContent = item.useCase;
    fragment.querySelector(".importance").textContent = item.importance;
    fragment.querySelector("code").textContent = item.code;
    fragment.querySelector(".tip").textContent = `Learning note: ${item.tip}`;
    cardGrid.appendChild(fragment);
  });
}

function render() {
  const items = getFilteredItems();
  renderStats(items);
  renderCards(items);
}

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  render();
});

buildFilters();
render();
