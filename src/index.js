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
  if (location.hash.startsWith("#search=")) {
    searchGIFs(location.hash);
  } else {
    getTrendingGIFs({ cleanSection: true });
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
  const data = await response.json();
  infiniteScrollData.request = request;
  createGIFs(data.data, true);
  infiniteScrollData.offset = data.pagination.count;
  infiniteScrollData.total_count = data.pagination.total_count;
  scrollToTop();
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
  infiniteScrollData = {
    offset: 0,
    request: "",
  };
  GIFsSectionTitle.innerHTML = "Trending";
  const request = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`;
  const response = await fetch(request);
  const data = await response.json();
  infiniteScrollData.request = request;
  createGIFs(data.data, cleanSection);
  infiniteScrollData.offset = data.pagination.count;
  infiniteScrollData.total_count = data.pagination.total_count;
  scrollToTop();
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
    article.dataset.imgWidth= imgWidth;
    article.dataset.imgHeight= imgHeight;

    const picture = document.createElement("picture");

    const img = document.createElement("img");
    img.classList.add("gif-img");
    img.dataset.src = GIF.images.fixed_width.url;

    picture.appendChild(img);
    article.appendChild(picture);
    lazyLoadGIFs(article);
    fragment.appendChild(article);
  });
  setWrapperHeight(wrapper);

  wrapper.appendChild(fragment);
}

function setGrid() {
  const GIFs = document.querySelectorAll(".gif");
  const GIFWidth = getGIFWidth(wrapperWidth);
  resetColumnHeights();
  GIFs.forEach((GIF) => {
    const imgWidth = GIF.dataset.imgWidth;
    const imgHeight = GIF.dataset.imgHeight;
    const GIFHeight = (GIFWidth * imgHeight) / imgWidth;

    GIF.style.width = `${GIFWidth}px`;
    const GIFImg =  GIF.querySelector('.gif-img');
    GIF.style.height = `${GIFImg.height}px`;
    GIF.style.transform = getGIFTranslate(GIFWidth, GIFHeight);
  });

  setWrapperHeight(wrapper);
}

async function infiniteScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const maxCount = infiniteScrollData.offset < infiniteScrollData.total_count;

  if (scrollIsBottom && infiniteScrollData.request && maxCount) {
    console.log(maxCount);
    const request = infiniteScrollData.request;
    infiniteScrollData.request = "";

    const response = await fetch(
      `${request}&offset=${infiniteScrollData.offset}`
    );
    const data = await response.json();
    infiniteScrollData.offset += data.pagination.count;
    createGIFs(data.data, false);

    infiniteScrollData.request = request;
    console.log(infiniteScrollData);
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

        img.addEventListener('load', () => {
          article.classList.remove(gifLoading);
          img.classList.add("gif-img--loaded");
        })

        observer.unobserve(article);
      }
    });
  }
  let observer = new IntersectionObserver(handleObserver, options);
  observer.observe(item);
}

function headerChange() {
  const header = document.querySelector('.header');
  const headerHeight = header.clientHeight;
  const {scrollTop} = document.documentElement;
  if(scrollTop > (headerHeight / 2)){
    header.classList.add('header--scrolling');
    scrollToTopBtn.classList.add('active');
  }else{
    header.classList.remove('header--scrolling');
    scrollToTopBtn.classList.remove('active');
  }
}
scrollToTopBtn.addEventListener('click', scrollToTop);
window.addEventListener("DOMContentLoaded", hash);
window.addEventListener("hashchange", hash);
window.addEventListener("resize", () => {
  wrapperWidth = wrapper.clientWidth;
  setGrid();
});
window.addEventListener("scroll", infiniteScroll);
window.addEventListener("scroll", headerChange);