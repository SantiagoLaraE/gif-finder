
const wrapper = document.querySelector(".gifs__wrapper");
let wrapperWidth = wrapper.clientWidth;
const gap = 8;
let columns;
const columnsHeights = {};
const API_KEY = "2STJgtp7HDg3PAulHpsetnjTzGxkVzUk";



async function getTrendingGIFs() {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`
  );
  const data = await response.json();
  createGIFs(data.data);
}

function createGIFs(GIFs) {
  setColumns();
  const fragment = new DocumentFragment();
  const newWidth = (wrapperWidth - gap * (columns - 1)) / columns;
  GIFs.map((item, index) => {
    const imgWidth = item.images.fixed_width.width;
    const imgHeight = item.images.fixed_width.height;
    const newHeight = (newWidth * imgHeight) / imgWidth;
    const translateX = (index % columns) * newWidth + (index % columns) * gap;
    const translateY = Math.ceil(columnsHeights[`column-${index % columns}`] + gap) || 0;

    const article = document.createElement("article");
    article.classList.add("gif");
    article.style.width = `${newWidth}px`;
    article.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;

    const picture = document.createElement("picture");

    const img = document.createElement("img");
    img.classList.add("gif-img");
    img.src = item.images.fixed_width.url;

    picture.appendChild(img);
    article.appendChild(picture);
    fragment.appendChild(article);

    if (columnsHeights[`column-${index % columns}`]) {
      columnsHeights[`column-${index % columns}`] += newHeight + gap;
    } else {
      columnsHeights[`column-${index % columns}`] = newHeight;
    }
  });
  wrapper.appendChild(fragment);
  const itemsHeights = Object.values(columnsHeights);
  const height =
    itemsHeights.reduce((acc, cur) => (acc < cur ? cur : acc), 0) + gap;
  wrapper.style.height = `${height}px`;
}

getTrendingGIFs();

window.addEventListener("resize", () => {
  wrapperWidth = wrapper.clientWidth;
  setGrid();
});

function setGrid() {
  setColumns();

  const gifs = document.querySelectorAll(".gif .gif-img");
  const width = (wrapperWidth - gap * (columns - 1)) / columns;
  const data = {};
  gifs.forEach((item, index) => {
    const translateX = (index % columns) * width + (index % columns) * gap;
    const translateY = data[`columna-${index % columns}`] + gap || 0;

    item.offsetParent.style.width = `${width}px`;
    item.offsetParent.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;

    if (data[`columna-${index % columns}`]) {
      data[`columna-${index % columns}`] += item.clientHeight + gap;
    } else {
      data[`columna-${index % columns}`] = item.clientHeight;
    }
  });

  const itemsHeights = Object.values(data);
  const height =
    itemsHeights.reduce((acc, cur) => (acc < cur ? cur : acc), 0) + gap;
  wrapper.style.height = `${height}px`;
}


function setColumns() {
  if (wrapperWidth > 1080) {
    columns = 4;
  } else if (wrapperWidth > 768) {
    columns = 3;
  } else {
    columns = 2;
  }
}
