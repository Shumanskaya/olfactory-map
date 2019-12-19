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

/*наполнение объекта*/

const maxXCoords = 960;
const maxYCoords = 500;
const dataInformation = [];
const btnSubmit = document.querySelector('.js-submit-form');
const olfactoryForm = document.forms.olfactoryAd;
const TAG = document.querySelector('.map-wrapper');
const TEMPLATE = document.querySelector('#marker').content;
const fragment = document.createDocumentFragment();
const card = document.querySelector('.card');
const cardsTitle = card.querySelector('.card__title');
const cardLocation = card.querySelector('.card__location');
const cardType = card.querySelector('.card__type');
const cardMaterial = card.querySelector('.card__material');
const cardNote = card.querySelector('.card__note');
const cardDescription = document.querySelector('.card__description');

function randomCoords(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}

function getRadioValue(name) {
    let fieldset = olfactoryForm.elements[name];
    let inputs = fieldset.elements;
    let value;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            value = inputs[i].value;
        }
    }
    return value;
}

function getInputValue(name) {
    let inputs = olfactoryForm.elements[name];
    return inputs.value;
}


function fillObjectLocation(x, y) {
    let obj = {};
    obj.x = x;
    obj.y = y;

    return obj;
}

function fillObjectInformation(titles, types, groups, notes, description) {
    let obj = {};
    obj.id = 0;
    obj.title = getInputValue(titles);
    obj.type = getRadioValue(types);
    obj.material = getRadioValue(groups);
    obj.note = getRadioValue(notes);
    obj.description = getInputValue(description);
    obj.location = fillObjectLocation(randomCoords(0, maxXCoords), randomCoords(0, maxYCoords));
    return obj;
}

function fillData(information) {
    information.id += dataInformation.length;
    dataInformation.push(information);
}

function addTitleToMarker(marker, information) {
    let title = marker.querySelector('.marker__title');
    title.textContent = information.title;
}

function addDataAttrWithIdToMarker(marker, information) {
    let mark = marker.querySelector('.marker');
    mark.dataset.index = information.id;
}

function addRandomMarkerLocation(marker, information) {
    let pin = marker.querySelector('.marker--position');
    pin.style.top = information.location.y + 'px';
    pin.style.left = information.location.x + 'px';
}

function renderMarker(information) {
    var element = TEMPLATE.cloneNode(true);
    fillData(information);
    addTitleToMarker(element, information);
    addRandomMarkerLocation(element, information);
    addDataAttrWithIdToMarker(element, information);
    fragment.appendChild(element);
    TAG.appendChild(fragment);
    showModal();
    hideModal();
    return element;
}

btnSubmit.addEventListener('click', function () {
    renderMarker(fillObjectInformation('titleForm', 'materialsType', 'olfactoryGroup', 'noteSmells', 'description-of-smells'));
});

/*show popup*/

/*fill card*/
function fillCard(arr, index) {
    cardsTitle.textContent = arr[index].title;
    cardLocation.textContent = `(место: ${arr[index].location.x} : ${arr[index].location.y})`;
    cardType.textContent = arr[index].type;
    cardMaterial.textContent = arr[index].material;
    cardNote.textContent = arr[index].note;
    cardDescription.textContent = arr[index].description;
    // console.log(arr);
}

/*end fill card*/

function addActiveClassModal() {
    let modal = document.querySelector('.card');
    modal.classList.remove('card--hidden');
    modal.classList.add('card--active');
}

function deleteActiveClass() {
    let modal = document.querySelector('.card');
    modal.classList.add('card--hidden');
    modal.classList.remove('card--active');
}

function showModal() {
    let map = document.querySelector('.map');
    map.addEventListener('click', function (e) {
        let marker = e.target.closest('.marker');
        console.log(marker);
        if (!marker) return;
        if (!map.contains(marker)) return;
        let index = marker.dataset.index;
        addActiveClassModal();
        fillCard(dataInformation, +index);
    })
}

function hideModal() {
    let closeBtn = document.querySelector('.card--close');
    closeBtn.addEventListener('click', deleteActiveClass);
}

