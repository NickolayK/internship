
let apartmens = [],
    bookMarks = [],
    CallbackRegistry = {},
    currentPage = 1,
    currentSearch;


function scriptRequest(url, onSuccess, onError) {

    let scriptOk = false;

    const callbackName = 'cb' + String(Math.random()).slice(-6);

    url += '&callback=CallbackRegistry.' + callbackName;

    CallbackRegistry[callbackName] = function (data) {
        scriptOk = true;
        delete CallbackRegistry[callbackName];
        onSuccess(data);
        
    };

    function checkCallback() {
        if (scriptOk) return;
        delete CallbackRegistry[callbackName];
        onError(url);
    }

    var script = document.createElement('script');

    script.onload = script.onerror = checkCallback;
    script.src = url;

    document.body.appendChild(script);
}

function onGetApartment(data) {
    apartmens = data.response.listings;
    const container = document.getElementById('listContainer');
    if(apartmens.length){
        document.getElementById('showMore').style.display = 'inline-block';
    }
    renderer(container, apartmens);
}

function onShowMoreApartment(data) {

    apartmens.push(...data.response.listings);
    const container = document.getElementById('listContainer');

    renderer(container, apartmens);
}

function fail(url) {
    alert('Ошибка при запросе ' + url);
}

function onShowMore(value) {
    currentPage++;

    let api = 'http://api.nestoria.co.uk/api?action=search_listings',
        place = '&place_name=' + currentSearch,
        listing_type = '&listing_type=rent',
        json_uk = '&encoding=json&pretty=1',
        page = '&page=' + currentPage,
        api_input = api + place + listing_type + json_uk + page;

    scriptRequest(api_input, onShowMoreApartment, fail);

}

function getApartment(value) {
    
    currentPage = 1;
    currentSearch = value;

    let api = 'http://api.nestoria.co.uk/api?action=search_listings',
        place = '&place_name=' + value,
        listing_type = '&listing_type=rent',
        json_uk = '&encoding=json&pretty=1',
        page = '&page=1',
        api_input = api + place + listing_type + json_uk + page;


    scriptRequest(api_input, onGetApartment, fail);
}

function createElement(options) {

    const elem = document.createElement(options.elemName);

    if (options.innerHTML) {
        elem.innerHTML = options.innerHTML;
    }

    if (options.eventName && options.handler) {
        elem.addEventListener(options.eventName, options.handler);
    }

    if (options.atribute && options.atrValue) {
        elem.setAttribute(options.atribute, options.atrValue);
    }

    if (options.src) {
        elem.src = options.src;
    }

    return elem;
}

function openBookMark() {

    let container = createElement({ elemName: 'div' }),
        closeBtn = createElement({ elemName: 'button', innerHTML: 'Close', eventName: 'click', handler: closeModal });

    bookMarks.forEach(function (elem, index) {

        let elemContainer = createElement({ elemName: 'div', atribute: 'id', atrValue: index }),
            img = createElement({ elemName: 'img', src: elem.img_url }),
            titleElem = createElement({ elemName: 'h5', innerHTML: elem.title }),
            bottomContainer = createElement({ elemName: 'div' }),
            price = createElement({ elemName: 'span', innerHTML: 'Price : ' + elem.price_formatted }),
            deleteBtn = createElement({ elemName: 'button', innerHTML: 'Delete From BookMarks', eventName: 'click', handler: deleteBookMark })

        bottomContainer.appendChild(price);
        bottomContainer.appendChild(deleteBtn);

        elemContainer.appendChild(titleElem);
        elemContainer.appendChild(img);
        elemContainer.appendChild(bottomContainer);

        container.appendChild(elemContainer);

    });

    container.appendChild(closeBtn);

    openModal(container);
}

function bookMarkToggle(event) {

    const index = +event.target.parentElement.parentElement.getAttribute('id');

    if (bookMarks.indexOf(apartmens[index]) === -1) {
        bookMarks.push(apartmens[index]);
        event.target.innerText = 'delete bookmark';
    } else {

        let indexInBookMark = bookMarks.indexOf(apartmens[index]);
        bookMarks.splice(indexInBookMark, 1);

        event.target.innerText = ' to bookmark';
    }

}

function deleteBookMark(event) {
    var elem = event.target.parentElement.parentElement;
    
    var index = +elem.getAttribute('id');

    bookMarks.splice(index, 1);
    elem.parentElement.removeChild(elem);

    
}


function renderer(container, displayedItems) {

    container.innerHTML = '';

    displayedItems.forEach(function (elem, index) {
        let elemContainer = createElement({ elemName: 'div', atribute: 'id', atrValue: index }),
            titleElem = createElement({ elemName: 'h5', innerHTML: elem.title }),
            img = createElement({ elemName: 'img', src: elem.img_url }),
            bottomContainer = createElement({ elemName: 'div' }),
            price = createElement({ elemName: 'p', innerHTML: 'Price : ' + elem.price_formatted + ' - ' + elem.price_type}),
            detailBtn = createElement({ elemName: 'button', innerHTML: 'Detail', eventName: 'click', handler: onDetail });

            if(bookMarks.indexOf(elem ) !== -1 ){
               
                var addBookMarkBtn = createElement({ elemName: 'button', innerHTML: 'delete bookmark ', eventName: 'click', handler: bookMarkToggle });
            }else{
                var  addBookMarkBtn = createElement({ elemName: 'button', innerHTML: 'to bookmark', eventName: 'click', handler: bookMarkToggle });
            }
            



        bottomContainer.appendChild(price);
        bottomContainer.appendChild(detailBtn);
        bottomContainer.appendChild(addBookMarkBtn);

        elemContainer.appendChild(titleElem);
        elemContainer.appendChild(img);
        elemContainer.appendChild(bottomContainer);

        container.appendChild(elemContainer);
    });
}


function onDetail(event) {

    const index = +event.target.parentElement.parentElement.getAttribute('id');

    let elem = apartmens[index],
        closeBtn = createElement({ elemName: 'button', innerHTML: 'Close', eventName: 'click', handler: closeModal }),
        container = createElement({ elemName: 'div' }),
        titleElem = createElement({ elemName: 'h5', innerHTML: 'Detail of : ' + elem.title }),
        img = createElement({ elemName: 'img', src: elem.img_url })


    container.appendChild(titleElem);
    container.appendChild(img);

    container.appendChild(closeBtn);

    console.log(elem)
    openModal(container);

}

function openModal(container) {

    let modal = createElement({ elemName: 'div', atribute: 'id', atrValue: 'modal' });

    modal.appendChild(container);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(modal);

}

function closeModal() {
    document.body.style.overflow = 'auto'
    document.body.removeChild(document.getElementById('modal'));

    const container = document.getElementById('listContainer');

    renderer(container, apartmens);
}



function searchBtn() {
    var value = document.getElementById('myInput').value;
    if (value) {
        getApartment(value);
    }
}

function find(event, value) {

    if (event.keyCode === 13 && value) {
        getApartment(value);
    }
}