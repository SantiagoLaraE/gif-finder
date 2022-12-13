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

window.addEventListener("DOMContentLoaded", hash);
window.addEventListener("hashchange", hash);

function hash() {
  if (location.hash.startsWith("#search=")) {
    searchGIFs(location.hash);
  } else {
    getTrendingGIFs({ cleanSection: true });
  }
}

async function getTrendingGIFs({ cleanSection }) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&offset=${getOffset}`
  );
  const data = await response.json();
  createGIFs(data.data, cleanSection);
}

function createGIFs(GIFs, cleanSection) {
  const fragment = new DocumentFragment();
  const GIFWidth = setGIFWidth(wrapperWidth);
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
  if (cleanSection) {
    resetColumnHeights();
    wrapper.innerHTML = "";
  }
  wrapper.appendChild(fragment);
  setWrapperHeight(wrapper);
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

window.addEventListener("resize", () => {
  wrapperWidth = wrapper.clientWidth;
  setGrid();
});
