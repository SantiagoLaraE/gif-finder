let columns;
const gap = 8;
let columnHeights = {};

function setColumns(wrapperWidth) {
  if (wrapperWidth > 1080) {
    columns = 4;
  } else if (wrapperWidth > 768) {
    columns = 3;
  } else {
    columns = 2;
  }
}

export function setWrapperHeight(wrapper) {
  const itemsHeights = Object.values(columnHeights);
  const highest =
    itemsHeights.reduce((acc, cur) => (acc < cur ? cur : acc), 0) + gap;
  wrapper.style.height = `${highest}px`;
}

export function setGIFWidth(wrapperWidth) {
  setColumns(wrapperWidth);
  return (wrapperWidth - gap * (columns - 1)) / columns;
}

export function setGIFTranslate(index, width, height) {
  const translateX = (index % columns) * width + (index % columns) * gap;
  const translateY = columnHeights[`column-${index % columns}`] + gap || 0;
  setColumnsHeights(index, height);
  return `translateX(${translateX}px) translateY(${translateY}px)`;
}

export function resetColumnHeights() {
  columnHeights = {};
}

function setColumnsHeights(index, height) {
  if (columnHeights[`column-${index % columns}`]) {
    columnHeights[`column-${index % columns}`] += height + gap;
  } else {
    columnHeights[`column-${index % columns}`] = height;
  }
}
