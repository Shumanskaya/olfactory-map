/*add color to column*/
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

/*show popup*/

function toggleModal() {
    let modal = document.querySelector('.card');
    if (modal.classList.contains('card--hidden')) {
        modal.classList.remove('card--hidden');
        modal.classList.add('card--active');
    } else if (modal.classList.contains('card--active')) {
        modal.classList.add('card--hidden');
        modal.classList.remove('card--active');
    }
}

function showModal() {
    let openBtn = document.querySelector('.marker');
    openBtn.addEventListener('click', toggleModal);
}

function hideModal() {
    let closeBtn = document.querySelector('.card--close');
    closeBtn.addEventListener('click', toggleModal);
}

showModal();
hideModal();
