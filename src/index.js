const wrapper = document.querySelector(".gifs__wrapper");
let wrapperWidth = wrapper.clientWidth;
const gap = 8;

window.addEventListener("resize", () => {
  wrapperWidth = wrapper.clientWidth;
  setGrid();
});

function setGrid() {
  if (wrapperWidth > 1080) {
    columns = 4;
  } else if (wrapperWidth > 768) {
    columns = 3;
  } else {
    columns = 2;
  }

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

setGrid();
