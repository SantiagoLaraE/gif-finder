import {
  setWrapperHeight,
  getGIFWidth,
  getGIFTranslate,
  resetColumnHeights,
} from "./GIFsGrid.js";

const wrapper = document.querySelector(".gifs__wrapper");
const GIFsSectionTitle = document.querySelector(".gifs__title");
let wrapperWidth = wrapper.clientWidth;
const API_KEY = "2STJgtp7HDg3PAulHpsetnjTzGxkVzUk";
let infiniteScrollData = {
  offset: 0,
  request: "",
};
function scrollToTop() {
  window.scroll(0, 0);
}
function hash() {
  scrollToTop();
  LoadingComponent({ show: true });
  if (location.hash.startsWith("#search=")) {
    searchGIFs(location.hash);
  } else if (location.hash === '') {
    getTrendingGIFs({ cleanSection: true });
  } else {
    errorResponse();
  }
}

async function getTrendingGIFs({ cleanSection }) {
  infiniteScrollData = {
    offset: 0,
    request: "",
  };
  GIFsSectionTitle.innerHTML = "Trending";
  const request = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`;
  const response = await fetch(request);

  if (response.ok) {
    const data = await response.json();
    infiniteScrollData.request = request;
    createGIFs(data.data, cleanSection);
    infiniteScrollData.offset = data.pagination.count;
    infiniteScrollData.total_count = data.pagination.total_count;
  } else {
    errorResponse();
  }
}

async function searchGIFs(hash) {
  infiniteScrollData = {
    offset: 0,
    request: "",
  };
  const query = hash.substring(8);
  GIFsSectionTitle.innerHTML = query.replaceAll("+", " ");
  document.getElementById("query").value = query.replaceAll("+", " ");
  const request = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}`;
  const response = await fetch(request);
  if (response.ok) {
    const data = await response.json();
    if (data.data.length) {
      infiniteScrollData.request = request;
      createGIFs(data.data, true);
      infiniteScrollData.offset = data.pagination.count;
      infiniteScrollData.total_count = data.pagination.total_count;
    } else {
      noResults();
    }
  } else {
    errorResponse();
  }
}

function handleQuerySubmit(e) {
  e.preventDefault();
  const formData = new FormData(formQuery);
  const queryValue = formData.get("query").toLowerCase().trim();
  const fixedQuery = queryValue.replaceAll(" ", "+");

  if (fixedQuery.length) {
    location.hash = `#search=${fixedQuery}`;
    query.classList.remove("form__input--error");
  } else {
    location.hash = "";
    query.setAttribute("placeholder", "Type something");
    query.classList.add("form__input--error");
  }
}

formQuery, addEventListener("submit", handleQuerySubmit);

function errorResponse() {
  GIFsSectionTitle.innerHTML = "Not Found";

  const pageNotFound = `        <div class="pageNotFound container">
  <h3 class="pageNotFound__title">404</h3>
  <h4 class="pageNotFound__subtitle">Page not found</h4>
  <p class="pageNotFound__description">No encontramos lo que buscabas, pero puede ir a nuestra página principal</p>
  <a class="pageNotFound__link" href="#">Ir a página principal</a>
</div>`;

  wrapper.innerHTML = pageNotFound;
  LoadingComponent({ show: false });
}

function noResults() {
  GIFsSectionTitle.innerHTML = "No result";

  const pageNotFound = `        <div class="noResultsPage container">
  <h3 class="noResultsPage__title">No results</h3>
  <p class="noResultsPage__description">No hay resultados para el término que buscaste.</p>
  <p class="noResultsPage__description">Busca algo diferente o ve a nuestra página principal para encontrar GIFs en tendencia</p>
  <a class="noResultsPage__link" href="#">Ir a página principal</a>
</div>`;

  wrapper.innerHTML = pageNotFound;
  LoadingComponent({ show: false });
}

function createGIFs(GIFs, cleanSection) {
  const fragment = new DocumentFragment();
  const GIFWidth = getGIFWidth(wrapperWidth);
  const colors = ["yellow", "red", "purple", "blue", "green"];

  if (cleanSection) {
    resetColumnHeights();
    wrapper.innerHTML = "";
  }

  GIFs.map((GIF) => {
    const imgWidth = GIF.images.fixed_width.width;
    const imgHeight = GIF.images.fixed_width.height;
    const GIFHeight = (GIFWidth * imgHeight) / imgWidth;
    const randomNumber = Math.floor(Math.random() * colors.length);
    const loadingColor = colors[randomNumber];

    const article = document.createElement("article");
    article.classList.add("gif");
    article.classList.add(`gif--loading-${loadingColor}`);

    article.style.width = `${GIFWidth}px`;
    article.style.height = `${GIFHeight}px`;
    article.style.transform = getGIFTranslate(GIFWidth, GIFHeight);
    article.dataset.imgWidth = imgWidth;
    article.dataset.imgHeight = imgHeight;

    const picture = document.createElement("picture");

    const img = document.createElement("img");
    img.classList.add("gif-img");
    img.dataset.src = GIF.images.fixed_width.url;
    img.alt = GIF.title;
    img.width = GIFWidth;
    img.height = GIFHeight;

    picture.appendChild(img);
    article.appendChild(picture);
    lazyLoadGIFs(article);
    fragment.appendChild(article);
  });
  setWrapperHeight(wrapper);

  wrapper.appendChild(fragment);
  LoadingComponent({ show: false });
}

function setGrid() {
  const GIFs = document.querySelectorAll(".gif");
  const GIFWidth = getGIFWidth(wrapperWidth);
  resetColumnHeights();
  GIFs.forEach((GIF) => {
    const imgWidth = GIF.dataset.imgWidth;
    const imgHeight = GIF.dataset.imgHeight;
    const GIFHeight = (GIFWidth * imgHeight) / imgWidth;

    const GIFImg = GIF.querySelector(".gif-img");
    GIFImg.width = GIFWidth;
    GIFImg.height = GIFHeight;
    GIF.style.width = `${GIFWidth}px`;
    GIF.style.height = `${GIFHeight}px`;
    GIF.style.transform = getGIFTranslate(GIFWidth, GIFHeight);
  });

  setWrapperHeight(wrapper);
}

async function infiniteScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const maxCount = infiniteScrollData.offset < infiniteScrollData.total_count;

  !maxCount
    ? LoadingComponent({ show: false })
    : LoadingComponent({ show: true });

  if (scrollIsBottom && infiniteScrollData.request && maxCount) {
    const request = infiniteScrollData.request;
    infiniteScrollData.request = "";

    const response = await fetch(
      `${request}&offset=${infiniteScrollData.offset}`
    );
    const data = await response.json();
    infiniteScrollData.offset += data.pagination.count;
    createGIFs(data.data, false);

    infiniteScrollData.request = request;
  }
}

function lazyLoadGIFs(item) {
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  function handleObserver(entries, observer) {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        const article = entry.target;
        const [, gifLoading] = article.classList.values();

        const img = article.querySelector(".gif-img");
        img.src = img.dataset.src;

        img.addEventListener("load", () => {
          article.classList.remove(gifLoading);
          img.classList.add("gif-img--loaded");
        });

        observer.unobserve(article);
      }
    });
  }
  let observer = new IntersectionObserver(handleObserver, options);
  observer.observe(item);
}

function LoadingComponent({ show }) {
  if (show) {
    loading.classList.add("active");
  } else {
    loading.classList.remove("active");
  }
}

function headerChange() {
  const header = document.querySelector(".header");
  const headerHeight = header.clientHeight;
  const { scrollTop } = document.documentElement;
  if (scrollTop > headerHeight / 2) {
    header.classList.add("header--scrolling");
    scrollToTopBtn.classList.add("active");
  } else {
    header.classList.remove("header--scrolling");
    scrollToTopBtn.classList.remove("active");
  }
}
scrollToTopBtn.addEventListener("click", scrollToTop);
window.addEventListener("DOMContentLoaded", hash);
window.addEventListener("hashchange", hash);
window.addEventListener("resize", () => {
  wrapperWidth = wrapper.clientWidth;
  setGrid();
});
window.addEventListener("scroll", infiniteScroll);
window.addEventListener("scroll", headerChange);
