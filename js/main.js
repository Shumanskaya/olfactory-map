const maxXCoords = 960;
const maxYCoords = 500;
/*массив со всей информацией*/
const dataInformation = [];
/*объект с расположением точки*/
let locationMarker = {};
/*переменные формы*/
const olfactoryForm = document.forms.olfactoryAd;
const combinationInput = document.querySelector('.form__fieldset--combi');
const inputTemplate = document.querySelector('#combi').content;
/*переменные для создания маркера*/
const TAG = document.querySelector('.map-wrapper');
const TEMPLATE = document.querySelector('#marker').content;
const fragment = document.createDocumentFragment();
/*переменные для наполнения карты (всплывающее мод окно)*/
const card = document.querySelector('.card');
const cardsTitle = card.querySelector('.card__title');
const cardLocation = card.querySelector('.card__location');
const cardType = card.querySelector('.card__type');
const cardMaterial = card.querySelector('.card__material');
const cardNote = card.querySelector('.card__note');
const cardDescription = document.querySelector('.card__description');
/*маркер для создания новой точки*/
const markerForDrag = document.querySelector('.js-marker-drag');
/*кнопки действия*/
const btnSubmit = document.querySelector('.js-submit-form');
const btnAddInformation = document.querySelector('.js-btn-addMarker');
const btnEditAllMarker = document.querySelector('.js-btn-editAllMarker');
const btnCancelEditMap = document.querySelector('.js-btn-cancelEditAllMarker');

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

/*end color column*/

/*drag&drop*/

function showMark(element) {
    element.classList.remove('marker_drag--disabled');
    element.classList.add('marker_drag--active');
}

function hiddenMark(element) {
    element.classList.add('marker_drag--disabled');
    element.classList.remove('marker_drag--active');
}

function getCoords(elem) {
    let coords = elem.getBoundingClientRect();
    return {
        left: coords.left + pageXOffset,
        top: coords.top + pageYOffset,
    }
}

function dragMarker(e, element) {
    let coords = getCoords(TAG);
    let left = e.pageX - coords.left - (element.clientWidth * 0.5);
    let top = e.pageY - coords.top - (element.clientHeight * 0.5);
    if (element.classList.contains('js-marker-drag')) {
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        locationMarker.x = left;
        locationMarker.y = top;
    }
}

function dragAndDrop(element) {
    let handler = (e) => dragMarker(e, element);
    element.addEventListener('mousedown', function () {
        TAG.addEventListener('mousemove', handler);
    });

    element.addEventListener('mouseup', function () {
        TAG.removeEventListener('mousemove', handler);
    });
}

/*end drag&drop*/

/*наполнение объекта*/

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
    obj.location = fillObjectLocation(locationMarker.x, locationMarker.y);
    return obj;
}

function fillData(information) {
    information.id += dataInformation.length;
    dataInformation.push(information);
    console.log(dataInformation);
    return dataInformation;
}

function addTitleToMarker(marker, information) {
    let title = marker.querySelector('.marker__title');
    title.textContent = information.title;
}

function addDataAttrWithIdToMarker(marker, information) {
    let mark = marker.querySelector('.marker');
    mark.dataset.index = information.id;
    mark.classList.add('marker-modal');
}

function setMarkerLocation(marker, information) {
    let pin = marker.querySelector('.marker--position');
    pin.style.top = information.location.y + 'px';
    pin.style.left = information.location.x + 'px';
}

function renderMarker(information) {
    let element = TEMPLATE.cloneNode(true);
    fillData(information);
    addTitleToMarker(element, information);
    setMarkerLocation(element, information);
    addDataAttrWithIdToMarker(element, information);
    fragment.appendChild(element);
    TAG.appendChild(fragment);
}

/*add input combination*/

function renderCombinationInput(arr) {
    let element = inputTemplate.cloneNode(true);
    let title = element.querySelector('.form__label-title');
    let label = element.querySelector('.form__label');
    let input = element.querySelector('.form__checkbox');
    let arrLength = arr.length - 1;
    label.setAttribute('for', `combination${arrLength}`);
    input.setAttribute('id', `combination${arrLength}`);
    title.textContent = arr[arrLength].title;

    fragment.appendChild(element);
    combinationInput.appendChild(fragment);
}

/*clear form after submit*/

function clearForm() {
    let inputs = olfactoryForm.elements;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute('type') === 'text' || inputs[i].classList.contains('form__textarea')) {
            inputs[i].value = '';
        } else if (inputs[i].getAttribute('type') === 'radio') {
            inputs[i].checked = false;
        }
    }
}

/*fill card*/
function fillCard(arr, index) {
    cardsTitle.textContent = arr[index].title;
    cardLocation.textContent = `(место: ${arr[index].location.x} : ${arr[index].location.y})`;
    cardType.textContent = arr[index].type;
    cardMaterial.textContent = arr[index].material;
    cardNote.textContent = arr[index].note;
    cardDescription.textContent = arr[index].description;
}

/*end fill card*/

/*show popup*/

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
        let marker = e.target.closest('.marker-modal');
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

showModal();
hideModal();

/**/

/*обновление расположения в данных*/



/*реадктирование всех меток*/

function editMap(drag) {
    let markers = document.querySelectorAll('.marker');
    let marker;
    let dot;
    for (let i = 0; i < markers.length; i++) {
        marker = markers[i];
        dot = marker.querySelector('.marker--active');
        marker.classList.toggle('js-marker-drag');
        marker.classList.toggle('marker-modal');
        dot.classList.toggle('marker--drag');

        if (drag === true) {
            dragAndDrop(marker);
            btnEditAllMarker.classList.add('g-btn--hidden');
            btnCancelEditMap.classList.remove('g-btn--hidden');
        } else {
            btnEditAllMarker.classList.remove('g-btn--hidden');
            btnCancelEditMap.classList.add('g-btn--hidden');
        }
    }
}

/**/

btnSubmit.addEventListener('click', function () {
    renderMarker(fillObjectInformation('titleForm', 'materialsType', 'olfactoryGroup', 'noteSmells', 'description-of-smells'));
    renderCombinationInput(dataInformation);
    clearForm();
    hiddenMark(markerForDrag);
});

btnAddInformation.addEventListener('click', function () {
    showMark(markerForDrag);
    dragAndDrop(markerForDrag);
});

btnEditAllMarker.addEventListener('click', () => editMap(true));
btnCancelEditMap.addEventListener('click', function () {
    editMap(false);
});
