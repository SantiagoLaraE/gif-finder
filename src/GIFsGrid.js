let columnsCount;
const gap = 8; // pixels
const columns = [];

function setColumnsCount(wrapperWidth) {
  if (wrapperWidth > 1080) {
    columnsCount = 4;
  } else if (wrapperWidth > 768) {
    columnsCount = 3;
  } else {
    columnsCount = 2;
  }
}

export function setWrapperHeight(wrapper) {
  if (columns.length) {
    const { y: highest } = columns.reduce((acc, cur) =>
      acc.y < cur.y ? cur : acc
    );
    wrapper.style.height = `${highest}px`;
  } else {
    wrapper.style.height = "";
  }
}

export function getGIFWidth(wrapperWidth) {
  setColumnsCount(wrapperWidth);
  return (wrapperWidth - gap * (columnsCount - 1)) / columnsCount;
}

export function getGIFTranslate(width, height) {
  const shortestColumn = setColumnsHeights(width, height);

  return `translateX(${shortestColumn.x}px) translateY(${shortestColumn.y}px)`;
}

export function resetColumnHeights() {
  columns.splice(0, columns.length);
}

function setColumnsHeights(width, height) {
  if (!columns.length) {
    for (let index = 1; index <= columnsCount; index++) {
      columns.push({
        column: index,
        x: width * (index - 1) + gap * (index - 1),
        y: 0,
      });
    }
  }

  const shortestColumn = columns.reduce((acc, cur) =>
    acc.y > cur.y ? cur : acc
  );
  const shortestColumnIndex = columns.findIndex(
    (columnsCount) => columnsCount === shortestColumn
  );
  const initialValue = { ...shortestColumn };
  columns[shortestColumnIndex].y += height + gap;
  return initialValue;
}
