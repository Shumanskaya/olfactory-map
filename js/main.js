function searchColumn(selector) {
    let parent = document.querySelectorAll(selector);
    let childes;
    for (let i = 0; i < parent.length; i++) {
        childes = parent[i].children;
    }
    return childes;
}

function searchItems(element) {
    let column = searchColumn(element);
    let items = [];
    for (let i = 0; i < column.length; i++) {
        items.push(column[i].children);
    }
    return items;
}

function addColorToItem(arr, color, light) {
    let items = searchItems(arr);
    let hue = color;
    let lightness = light;
    let item;
    let block;

    for (let i = 0; i < items.length; i++) {
        item = items[i];
        for (let j = 0; j < item.length; j++) {
            block = item[j];
            block.style.backgroundColor = `hsl(${hue}, 95%, ${lightness}%)`;
            lightness -= 7;
        }
        hue += 10;
        lightness = light;
    }
}

addColorToItem('.map-section--left', 220, 95);
addColorToItem('.map-section--right', 10, 95);




// searchColumn('.map-section--left')
