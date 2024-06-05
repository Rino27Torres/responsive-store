import data from './data.js';

const menuBtn = document.getElementById('menu-btn');
const exitBtn = document.getElementById('exit-btn');
const modalOrderBtn = document.getElementById('modal-order-button');
const placeOrderBtn = document.getElementById('place-order-button');
const nav = document.getElementById('nav');
const gameContainer = document.getElementById('game-container');
const orderContainer = document.getElementById('order-container');
const modalContainer = document.getElementById('modal-container');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const cartNum = document.getElementById('cart-num');
const modalCloseButton = document.getElementById('modal-close-button');
const paymentForm = document.getElementById('payment-form');
const modalTitle = document.querySelector('.modal-title');
let cartTotal = 0;

modalCloseButton.addEventListener('click', () => {
    clearOrder();
    modalContainer.style.display = 'none';
})

placeOrderBtn.addEventListener('click', () => {
    modalContainer.style.display = 'block';
})

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const paymentFormData = new FormData(paymentForm);
    const name = paymentFormData.get('fullName');

    modalOrderBtn.style.display = 'none';

    modalTitle.innerHTML = `
    <div>
        <p>Processing!</p>
        <img src="./Images/loading.svg">
    </div>
    `

    setTimeout(() => {
        paymentForm.reset();
        modalTitle.textContent = `
        Thank's for your order ${name}! Delivery in 1 week!
        `
    }, 2500)
})

gameContainer.innerHTML = data.map(game => {
    const {img, title, year, console, developer, price, id} = game;

    return `
        <div class='game-card'>
            <div class='img-container'>
                <img class='game-cover' src="./Project Images/${img}" />
                <h2>Title: ${title}</h2>
            </div>

            <div class='game-info'>
                <p><span>Year: </span> ${year}</p>
                <p><span>Console: </span> ${console}</p>
                <p><span>Developer: </span> ${developer}</p>
                <p><span>Price: </span> $${price} <small>plus tax</small></p>
            </div>

            <div class='btn-container'>
                <button data-add-item='${id}'>Add To Cart</button>
            </div>
        </div>
    `
}).join('<hr>');

document.addEventListener('click', (e) => {
    if(e.target.dataset.addItem) {
        handleAddItem(e.target.dataset.addItem);
    } else if (e.target.dataset.removeItem) {
        handleRemoveItem(e.target.dataset.removeItem);
    }
})

menuBtn.addEventListener('click', () => {
    nav.classList.add('open-nav');
})

exitBtn.addEventListener('click', () => {
    nav.classList.remove('open-nav');
})

function handleAddItem(id) {
    data[id].quantity++;
    cartTotal++;
    cartNum.textContent = cartTotal;
    renderOrder();
}

function handleRemoveItem(id) {
    data[id].quantity--;
    cartTotal--;
    cartNum.textContent = cartTotal;
    renderOrder();
}

document.getElementById('menu-btn').addEventListener('keypress', 
    function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            document.getElementById('menu-btn').click(); 
            // Simulate click on Enter or Space key press
        }
});

// Ensure exit button can be toggled with keyboard
document.getElementById('exit-btn').addEventListener('keypress', 
    function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            document.getElementById('exit-btn').click();
        }
});

function renderOrder() {
    cartItems.innerHTML = ``;
    let totalCost = 0;

    data.map(item => {
        const {img, title, price, quantity, id} = item;
        const tax = Math.round((quantity * price) * 7.25) / 100;

        if(item.quantity > 0) {
            totalCost += quantity * price + tax;

            cartItems.innerHTML +=  `
            <div class='order'>
                <div class='cart-img'>
                    <img class='cart-img' src='./Project Images/${img}' />
                </div>

                <div class='order-details'>
                    <p><span>Title: </span> ${title}</p>
                    <p><span>Price per: </span> $${price}</p>
                    <p><span>Quantity: </span> ${quantity}</p>
                </div>

                <div class='cart-button-container'>
                    <button data-remove-item=${id}>Remove</button>
                </div>
                
                <div>
                    <p class='cart-item-price'><span>Price: </span>
                        $${(price * quantity).toFixed(2)}
                    </p>
                </div>
            </div>
        `
        }
    })

    if(totalCost > 0) {
        orderContainer.style.display = 'block';
        totalPrice.textContent = '$' + totalCost.toFixed(2);
    } else if(totalCost === 0) {
        orderContainer.style.display = 'none';
    }
}

function clearOrder() {
    modalTitle.textContent = 'Payment Details';
    modalOrderBtn.style.display = 'block';
    cartTotal = 0;
    cartNum.textContent = cartTotal;
    
    data.forEach(item => {
        item.quantity = 0;
        renderOrder();
    })
}

renderOrder();