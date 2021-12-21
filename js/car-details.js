
const carDetails = {
    name: 'Mersedes GLE 350D',
    bodyType: 'Внедорожник',
    engineType: 'Дизель',
    power: '350 л.c',
    engineVolume: '3.5л',
    defaultColor: 'silver',
    images: {
        'silver': '/images/Mersedes/GLE/silver.png',
        'red': '/images/Mersedes/GLE/red.png',
        'blue': '/images/Mersedes/GLE/blue.png',
    }
};

class CarDetailsModal
{
    constructor(carDetails) {
        this._carDetails = carDetails;
        this._selectedColor = carDetails.defaultColor;
        this._modalElement = null;
    }

    render(){
        const colors = [];
        for(let color in this._carDetails['images']){
            colors.push(color);
        }

        const modalWindowHtml = '' +
            '    <div class="modal modal_car-details">' +
            '        <div class="car-details">' +
            '            <div class="car-details__image-holder">' +
            '                <div class="car-details__image" style="background-image: url('+this._carDetails.images[this._selectedColor]+')"></div>' +
            '            </div>' +
            '            <div class="car-details__details">' +
            '                <span class="car-details__details-name">'+this._carDetails.name+'</span>' +
            '                <ul class="car-details__properties">' +
            '                    <li class="car-details__prop">' +
            '                        <span class="car-details__prop-type">Обьем двигателя: </span>' +
            '                        <span class="car-details__prop-value">'+this._carDetails.engineVolume+'</span>' +
            '                    </li>' +
            '                    <li class="car-details__prop">' +
            '                        <span class="car-details__prop-type">Тип кузова: </span>' +
            '                        <span class="car-details__prop-value">'+this._carDetails.bodyType+'</span>' +
            '                    </li>' +
            '                    <li class="car-details__prop">' +
            '                        <span class="car-details__prop-type">Тип двигателя: </span>' +
            '                        <span class="car-details__prop-value">'+this._carDetails.engineType+'</span>' +
            '                    </li>' +
            '                    <li class="car-details__prop">' +
            '                        <span class="car-details__prop-type">Мощность: </span>' +
            '                        <span class="car-details__prop-value">'+this._carDetails.power+'</span>' +
            '                    </li>' +
            '                </ul>' +
            '                <div class="color-picker car-details__color-picker">' +
                                    (colors.map((color) => {
                                        return '<div class="color-picker__color color-picker__color_'+color+' ' +
                                            ''+(color === this._selectedColor ? 'color-picker__color_selected' : '')+'" data-color="'+color+'"></div>';
                                    })).join('')+
            '                </div>' +
            '                <form class="car-details__payment-form">' +
            '                    <div class="form-group">' +
            '                        <label class="form-label">Способ оплаты: </label>' +
            '                        <select class="form-select" name="payment-type">' +
            '                            <option value="0">Наличными при получении</option>' +
            '                            <option value="1">Банковской картой</option>' +
            '                        </select>' +
            '                    </div>' +
            '                    <div class="form-group">' +
            '                        <label class="form-label">Адрес доставки: </label>' +
            '                        <input class="form-input" name="address">' +
            '                    </div>' +
            '                    <button class="form-button car-details__payment-form-confirm">Заказать</button>' +
            '                </form>' +
            '            </div>' +
            '        </div>' +
            '    </div>';

        const modalWindowLayout = document.createElement('div');
        modalWindowLayout.classList.add('modal-layout');
        modalWindowLayout.id = 'ModalWindow';
        modalWindowLayout.innerHTML = modalWindowHtml;
        this._modalElement = modalWindowLayout;
        document.querySelector('body').prepend(this._modalElement);

        this.initListeners();
    }

    hide()
    {
        this._modalElement.remove();
    }

    confirmPurchase(event)
    {
        event.preventDefault();
        const data = {};
        this._modalElement.querySelectorAll('input, select').forEach((input) => {
            data[input.getAttribute('name')] = input.value.trim();
        });

        for(let key in data){
            if(data[key] === ""){
                iziToast.show({
                    position: 'topRight',
                    color: 'red',
                    title: 'Ошибка!',
                    message: 'Заполните все поля для заказа'
                });
                return;
            }
        }

        if(data['payment-type'] === Order.PAYMENT_TYPE_CARD){
            iziToast.show({
                position: 'topRight',
                color: 'red',
                title: 'Ошибка!',
                message: 'Оплата возможна только наличными'
            });
            return;
        }

        let clientOrders = localStorage.getItem('orders');
        if(clientOrders === null){
            clientOrders = [];
        }else{
            clientOrders = JSON.parse(clientOrders);
        }
        clientOrders.push({
            paymentType: data['payment-type'],
            address: data['address'],
            car: this._carDetails,
            color: this._selectedColor
        });
        localStorage.setItem('orders', JSON.stringify(clientOrders));

        iziToast.show({
            position: 'topRight',
            color: 'green',
            title: 'Заказ оформлен',
            message: 'В ближайшие дни вы получите автомобиль'
        });
    }

    initListeners()
    {
        const colorPickers = this._modalElement.querySelectorAll('.color-picker__color');
        colorPickers.forEach((colorPicker) => {
            colorPicker.addEventListener('click', (event) => {
                const color = event.target.getAttribute('data-color');
                if(color !== this._selectedColor){
                    this._selectedColor = color;
                    this._modalElement.querySelector('.color-picker__color.color-picker__color_selected')
                        .classList.remove('color-picker__color_selected');
                    this._modalElement.querySelector(`.color-picker__color[data-color="${color}"]`)
                        .classList.add('color-picker__color_selected');

                    this._modalElement.querySelector('.car-details__image').style.backgroundImage = `url(${this._carDetails.images[color]})`;
                }
            });
        });

        this._modalElement.addEventListener('click', (event) => {
            if(!event.target.closest('.modal')){
                this.hide();
            }else if(event.target.classList.contains('car-details__payment-form-confirm')){
                this.confirmPurchase(event);
            }
        });
    }
}
