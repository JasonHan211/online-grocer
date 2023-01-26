let items = info.items;
let user = info.user;
let purchases = info.purchases;
let cart = [];

// Functions
function getItem(id,array) {
    return array.find(item => {
        return item._id == id
    })
}

function createdAt(a,b) {
    return a.createdAt - b.createdAt
}

// Display item
let divElement = document.createElement('div');
divElement.classList.add('box-container');

// Display item by alphabetical
items.sort((a,b) => a.name > b.name ? 1 : -1)

items.forEach(item => {

    let boxElement = document.createElement('div');
    boxElement.classList.add('box');
    boxElement.setAttribute('data-name', item.name);
    boxElement.setAttribute('data-id', item._id);
    boxElement.setAttribute('data-price', item.price);
    
    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', item.thumbnail);
    boxElement.appendChild(imgElement);

    let nameElement = document.createElement('h3');
    nameElement.innerHTML = item.name;
    boxElement.appendChild(nameElement);

    let priceElement = document.createElement('div');
    priceElement.classList.add('price');
    priceElement.innerHTML = 'RM ' + item.price + ' / pc';
    boxElement.appendChild(priceElement);

    let stockElement = document.createElement('span');
    stockElement.innerHTML = 'Stock: ' + item.stockCount;
    boxElement.appendChild(stockElement);

    boxElement.appendChild(document.createElement('br'));

    let rowDiv = document.createElement('div');
    rowDiv.setAttribute('class','row');

    let col1 = document.createElement('div');
    col1.setAttribute('class','col-10');

    let col2 = document.createElement('div');
    col2.setAttribute('class','col-2 btnFav');

    if (item.stockCount > 0) {
       
        let quantityspanElement = document.createElement('span');
        quantityspanElement.innerHTML = 'quantity :';
        boxElement.appendChild(quantityspanElement);

        let inputElement = document.createElement('input');
        inputElement.setAttribute('style',"font-size: 20px;width: 50px;");
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('min', '1');
        inputElement.setAttribute('max', item.stockCount);
        inputElement.setAttribute('value','1');
        boxElement.appendChild(inputElement);

        let pcspanElement = document.createElement('span');
        pcspanElement.innerHTML = 'pcs';
        boxElement.appendChild(pcspanElement);

        let cartElement = document.createElement('button');
        cartElement.setAttribute('class','btn');
        cartElement.innerHTML = 'Add to Cart';

        cartElement.onclick = (e) => {
            let item = {
                name: e.target.parentElement.parentElement.parentElement.dataset.name,
                item: e.target.parentElement.parentElement.parentElement.dataset.id,
                itemCount: Number(inputElement.value)
            }
            cart.push(item);
        }

        col1.appendChild(cartElement);

    } else {
        let quantityspanElement = document.createElement('span');
        quantityspanElement.innerHTML = 'Out Of Stock';
        col1.appendChild(quantityspanElement);
    }

    // Fav button
    let favElement = document.createElement('i');
    favElement.setAttribute('class','fa fa-heart-o');

    user.favouriteItem.forEach((favItem) => {
        if (favItem == item._id) {
            favElement.setAttribute('class','fa fa-heart');
        }
    })

    favElement.onclick = (e) => {
        let itemId = e.target.parentElement.parentElement.parentElement.dataset.id
        if (e.target.classList == 'fa fa-heart') {
            e.target.setAttribute('class','fa fa-heart-o');
            return removeFav(itemId)
        }
        
        e.target.setAttribute('class','fa fa-heart');
        return addFav(itemId)
    }
    
    col2.appendChild(favElement);

    rowDiv.appendChild(col1);
    rowDiv.appendChild(col2);

    boxElement.appendChild(rowDiv);

    divElement.appendChild(boxElement);   

});

let productDiv = document.querySelector('.product');
productDiv.appendChild(divElement);

// Cart
let cartButton = document.querySelector('a.fas.fa-shopping-cart');
cartButton.onclick = (e) => {

    if (!document.querySelector('#myDropdown')) {
        // document.querySelector('#myDropdown').classList.toggle("show");
        let cartDisplay = document.createElement('div');
        cartDisplay.setAttribute('id','myDropdown');
        cartDisplay.setAttribute('class','dropdown-content');
        document.querySelector('.dropdown').insertBefore(cartDisplay,document.querySelector('.dropdown').children[2] );
    }

    if (cart.length != 0) {
        document.querySelector('#myDropdown').innerHTML = ''
        cart.forEach((item) => {
            let cartItem = document.createElement('div');
            cartItem.setAttribute('class','row p-0 px-2 mb-4');
            let cartItemName = document.createElement('div');
            cartItemName.setAttribute('class','col-9');
            cartItemName.style.fontSize = '15px';
            cartItemName.innerHTML = item.name + ' x ' +  item.itemCount;
            let cartItemDel = document.createElement('div');
            cartItemDel.setAttribute('class','col-3');
            let cartDelBtn = document.createElement('a');
            cartDelBtn.setAttribute('class','fas fa-window-close p-0 text-center');
            cartDelBtn.style.fontSize = '20px';
            cartDelBtn.onclick = () => {
                let newCart = cart.filter((thisItem) => {
                    return thisItem.name !== item.name;
                })
                cart = newCart
                cartItem.remove();
            }
            cartItemDel.appendChild(cartDelBtn)
            cartItem.appendChild(cartItemName)
            cartItem.appendChild(cartItemDel)
            document.querySelector('#myDropdown').appendChild(cartItem)
        })

        // Checkout 
        let checkoutBtn = document.createElement('button')
        checkoutBtn.setAttribute('class','btn')
        checkoutBtn.style.fontSize = '15px'
        checkoutBtn.innerHTML = 'Checkout'
        checkoutBtn.onclick = async () => {
            let data = {
                cart: cart
            }

            let response = await fetch('/api/checkout',{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        
            let res = await response.json()
        
            console.log(res);
            cart = [];
        }
        document.querySelector('#myDropdown').appendChild(checkoutBtn)
        document.querySelector('#myDropdown').classList.remove('empty')


    } else {
        document.querySelector('#myDropdown').classList.add('empty')
        document.querySelector('#myDropdown').innerHTML = "Big Empty Cart"
    }
    
    document.querySelector('#myDropdown').classList.toggle('show')
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#cartBtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}

async function checkout() {
    let data = {
        cart: [{
            itemCount: 2,
            item: "6267bfe671b5e940e133fc9b"
        },
        {
            itemCount: 1,
            item: "6280c4f93092be02028134b7"
        }]
    }

    let response = await fetch('/api/checkout',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    let res = await response.json()

    console.log(res);
}

async function addFav(itemId) {

    let data = {
        itemId: itemId
    }

    let response = await fetch('/api/add_to_fav',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    let res = await response.json()

    console.log(res);
}

async function removeFav(itemId) {

    let data = {
        itemId: itemId
    }

    let response = await fetch('/api/remove_from_fav',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    let res = await response.json()

    console.log(res);
}


// Recommendation
// Compare functions
function mostPurchased(a,b) {
    return a.soldCount - b.soldCount
}

let mostPurchasedItem = [...items].sort(mostPurchased)
mostPurchasedItem.reverse()
let popularItem = mostPurchasedItem[0]

let itemBox = document.querySelector('[data-id="' + popularItem._id + '"]')
let recommendedDiv = document.createElement('div')
recommendedDiv.setAttribute('style','position: absolute;top: 0px;left: 0px;')
let recommendedHtml = `<img src="assets/img/shopping_body/recomended.png" style="width: 120px;height: 120px;">`
recommendedDiv.innerHTML = recommendedHtml
itemBox.appendChild(recommendedDiv)



let statusDiv = document.querySelector('#orderStatus')
purchases.sort(createdAt)
purchases.forEach(purchase => {
    
    let rowDiv = document.createElement('div')
    rowDiv.setAttribute('class','m-5 p-4 rounded-3 bg-white')
    rowDiv.setAttribute('style','')
    let statusHtml = ''
    purchase.checkout.forEach(cart => {
        let item = getItem(cart.item,items)
        cart.item = item
        
        statusHtml += item.name + " x " + cart.itemCount + "<br>"
    });

    statusHtml += "<br>Status: " + purchase.status + "<br>"
    statusHtml += "Packing: " + purchase.packing + "<br>"

    rowDiv.innerHTML = statusHtml
    statusDiv.appendChild(rowDiv)

});