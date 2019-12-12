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

/*наполнение объекта*/

const maxXCoords = 960;
const maxYCoords = 500;
const dataInformation = {};
const btnSubmit = document.querySelector('.js-submit-form');
const olfactoryForm = document.forms.olfactoryAd;
const name = olfactoryForm.elements.titleForm;
const material = olfactoryForm.elements.materialsType;
const group = olfactoryForm.elements.olfactoryGroup;
const TAG = document.querySelector('.map-wrapper');
const TEMPLATE = document.querySelector('#marker').content;
const fragment = document.createDocumentFragment();

function randomCoords(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}

function getRadioValue(fieldsetName) {
    let inputs = fieldsetName.elements;
    let value;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            value = inputs[i].value;
        }
    }
    return value;
}

function getInputValue(inputName) {
    return inputName.value;
}


function fillObjectPlace(x, y) {
    let obj = {};
    obj.x = x;
    obj.y = y;

    return obj;
}

function fillObjectInformation(titles, types, groups) {
    let obj = {};
    obj.title = getInputValue(titles);
    obj.type = getRadioValue(types);
    obj.group = getRadioValue(groups);
    obj.map = fillObjectPlace(randomCoords(0, maxXCoords), randomCoords(0, maxYCoords));
    return obj;
}

function addTitleToMarker(marker, information) {
    let title = marker.querySelector('.marker__title');
    title.textContent = information.title;
}

function renderMarker(information) {
    var element = TEMPLATE.cloneNode(true);
    addTitleToMarker(element, information);
    fragment.appendChild(element);
    TAG.appendChild(fragment);
    showModal();
    hideModal();
    return element;
}

btnSubmit.addEventListener('click', function () {
    renderMarker(fillObjectInformation(name, material, group));
});
