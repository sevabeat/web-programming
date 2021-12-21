class Catalog {
    constructor() {
        this._list = [];
    }

    render(carList)
    {
        this._list = carList;
        document.querySelector('.catalog__items').innerHTML = '';
        this._list.forEach((item) => {
            const itemHtml = '' +
                '                    <div class="catalog__item-image" style="background-image: url('+item.images[item.defaultColor]+')"></div>' +
                '                    <span class="catalog__item-name">' +
                '                            '+item.name+''+
                '                        </span>' +
                '                    <ul class="catalog__item-tags">' +
                '                        <li class="catalog__item-tag">'+item.bodyType+'</li>' +
                '                        <li class="catalog__item-tag">'+item.engineType+'</li>' +
                '                    </ul>';
            const itemElement = document.createElement('div');
            itemElement.classList.add('catalog__item');
            itemElement.innerHTML = itemHtml;
            document.querySelector('.catalog__items').appendChild(itemElement);
            itemElement.addEventListener('click', (event) => {
                const carDetails = new CarDetailsModal(item);
                carDetails.render();
            });
        });
    }

    async getCars(type = '0')
    {
        const params = new URLSearchParams({
           'vehicleType': type
        });
        const response = await fetch('http://188.120.240.247/cars/?'+params);
        return await response.json();
    }
}