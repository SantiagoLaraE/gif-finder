import {
  setWrapperHeight,
  setGIFWidth,
  setGIFTranslate,
  resetColumnHeights,
} from "./GIFsGrid.js";

const wrapper = document.querySelector(".gifs__wrapper");
let wrapperWidth = wrapper.clientWidth;
const API_KEY = "2STJgtp7HDg3PAulHpsetnjTzGxkVzUk";
let getOffset = 0;
let savedRequest = "";

function hash() {
  if (location.hash.startsWith("#search=")) {
    searchGIFs(location.hash);
  } else {
    getTrendingGIFs({ cleanSection: true });
  }
}

async function searchGIFs(hash) {
  const query = hash.substring(8);
  const request = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&offset=${getOffset}&q=${query}`;
  const response = await fetch(request);
  const data = await response.json();
  savedRequest = request;
  createGIFs(data.data, true);
  getOffset = data.pagination.count;
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

async function getTrendingGIFs({ cleanSection }) {
  const request = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&offset=${getOffset}`;
  const response = await fetch(request);
  const data = await response.json();
  savedRequest = request;
  createGIFs(data.data, cleanSection);
  getOffset = data.pagination.count;
}

function createGIFs(GIFs, cleanSection) {
  const fragment = new DocumentFragment();
  const GIFWidth = setGIFWidth(wrapperWidth);

  if (cleanSection) {
    resetColumnHeights();
    wrapper.innerHTML = "";
  }

  GIFs.map((GIF, index) => {
    const imgWidth = GIF.images.fixed_width.width;
    const imgHeight = GIF.images.fixed_width.height;
    const GIFHeight = (GIFWidth * imgHeight) / imgWidth;

    const article = document.createElement("article");
    article.classList.add("gif");
    article.style.width = `${GIFWidth}px`;
    article.style.transform = setGIFTranslate(index, GIFWidth, GIFHeight);

    const picture = document.createElement("picture");

    const img = document.createElement("img");
    img.classList.add("gif-img");
    img.src = GIF.images.fixed_width.url;

    picture.appendChild(img);
    article.appendChild(picture);
    fragment.appendChild(article);
  });
  setWrapperHeight(wrapper);

  wrapper.appendChild(fragment);
}

function setGrid() {
  const GIFs = document.querySelectorAll(".gif");
  const GIFWidth = setGIFWidth(wrapperWidth);
  resetColumnHeights();
  GIFs.forEach((GIF, index) => {
    GIF.style.width = `${GIFWidth}px`;
    GIF.style.transform = setGIFTranslate(index, GIFWidth, GIF.clientHeight);
  });

  setWrapperHeight(wrapper);
}

window.addEventListener("DOMContentLoaded", hash);
window.addEventListener("hashchange", hash);
window.addEventListener("resize", () => {
  wrapperWidth = wrapper.clientWidth;
  setGrid();
});
window.addEventListener("scroll", scrollState);

function scrollState() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollHeight - clientHeight - 20 < scrollTop) {
    getTrendingGIFs({ cleanSection: false });
  }
}
