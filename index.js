import { productData } from "./data.js";
const main = document.getElementById('main')
const paymentForm = document.getElementById('paymentForm');


render()

let count = 0
let changeCount = 0
let recentlyAddedProduct = ""
let total = 0
document.addEventListener('click', function (e) {
    if (e.target.dataset.productId) {
        if (document.getElementById('order-complete')) {
            document.getElementById('order-complete').classList.add('hide-order-complete')
        }
        handleAddClick(e.target.dataset.productId)
    } else if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
    } else if (e.target.id === 'orderBtn') {
        handleOrderBtnClick()
    }
})

function buildBillHtml(productData, productId) {

    let x = ""

    productData.forEach(function (product) {

        x += `
        <div class="item-in-cart toggleMe" id="${product.pid}">
            <p class="ordered-item" >${product.name}<span id="${'bill-item-count' + product.pid}" >(0)</span><span class="removeItem small-text" data-remove="${product.pid}"> Remove</span></span></p>
            <p class="item-price" id="${'ordered' + product.pid}" >$</p>
        </div>
        `
    })

    x += `
                <div class="toggleMe" id="total-price-div">
                <div class="item-in-cart bt "></div>
                <div class="total-price-div"  >
                    <p class="ordered-item "> Total price</p>
                    <p id="total_price" data-total="" ></p>
                </div>
                </div>
                <button class="orderBtn hideBtn" id="orderBtn" >Complete order</button>
            `
    return x

}


function handleRemoveClick(removeItemId) {
    const productObject = productData.filter(function (product) {
        return (product.pid === removeItemId)
    })[0]

    let totalElm = document.getElementById('total_price').textContent
    if (totalElm.includes('$')) {
        totalElm = Number(document.getElementById('total_price').textContent.trim().substring(1))

    } else {
        totalElm = Number(document.getElementById('total_price').textContent.trim())
    }

    if (Number(document.getElementById('ordered'.concat(removeItemId)).textContent.substring(1)) !== 0) {
        document.getElementById('ordered'.concat(removeItemId)).textContent = '$' + (Number(document.getElementById('ordered'.concat(removeItemId)).textContent.substring(1))
            -
            Number(document.getElementById('pr'.concat(removeItemId)).textContent.substring(1)))
    }

    if (!productObject.isPurchased) {
        let elm = document.getElementById('bill-item-count'.concat(removeItemId)).textContent.trim();
        count = Number(document.getElementById('bill-item-count'.concat(removeItemId)).textContent.substring(1, elm.length - 1))
        if (count > 0) {
            count--
            document.getElementById('bill-item-count'.concat(removeItemId)).textContent = '(' + count + ')'
        }
        if (totalElm > 0) {
            totalElm -= Number(document.getElementById('pr'.concat(removeItemId)).textContent.substring(1))
            document.getElementById('total_price').textContent = '$'.concat(totalElm)
        }
        if (count === 0) {
            document.getElementById(removeItemId).classList.add('toggleMe')
            if (Number(document.getElementById('total_price').textContent.substring(1)) === 0) {
                // console.log(document.getElementById('total_price').textContent)
                document.getElementById('total_price').textContent = ''
                document.getElementById('total-price-div').classList.add('toggleMe')
                document.getElementById('orderBtn').classList.add('hideBtn')
            }
        }
    }

}




function handleAddClick(productId) {

    const addedProductArray = []
    const productObject = productData.filter(function (product) {
        return (product.pid === productId)
    })[0]


    document.getElementById('checkout-section').classList.remove('hide')
    document.getElementById('checkout-section').innerHTML += buildBillHtml(productData, productId)

    document.getElementById(productId).classList.remove('toggleMe')
    document.getElementById('total-price-div').classList.remove('toggleMe')
    document.getElementById('orderBtn').classList.remove('hideBtn')


    document.getElementById('ordered'.concat(productId)).textContent = '$' + (Number(document.getElementById('pr'.concat(productId)).textContent.substring(1))
        + Number(document.getElementById('ordered'.concat(productId)).textContent.substring(1)))

    if (!productObject.isPurchased) {

        let totalElm = document.getElementById('total_price').textContent
        if (totalElm.includes('$')) {
            totalElm = Number(document.getElementById('total_price').textContent.trim().substring(1))
        } else {
            totalElm = Number(document.getElementById('total_price').textContent.trim())
        }
        // alert(totalElm)
        let elm = document.getElementById('bill-item-count'.concat(productId)).textContent.trim();
        count = Number(document.getElementById('bill-item-count'.concat(productId)).textContent.substring(1, elm.length - 1))
        count++
        document.getElementById('bill-item-count'.concat(productId)).textContent = '(' + count + ')'
        totalElm += Number(document.getElementById('pr'.concat(productId)).textContent.substring(1))
        document.getElementById('total_price').textContent = '$'.concat(totalElm)
    }
}


function render() {

    productData.forEach(function (product) {

        main.innerHTML += `
        <div class="item">
        <div class="item-container">
            <div class="item-img"><img src=${product.image} /></div>
            <div class="item-desc">
                <p class="item-name">${product.name}</p>
                <p class="small-text">${product.applicableProduct}</p>
                <p class="price" id=${'pr' + product.pid} >$${product.price}</p>
            </div>
            <div class="add-me-btn" > <i class="fa fa-plus-square-o fa-2x" data-product-id="${product.pid}" > </i> </div> 
        </div>
        </div>
        `
    })
    main.innerHTML += `       
                            <div id="checkout-section" class="checkout-section hide">
                                <p class="order-detail">Your order</p>
                            </div> 
                     `
}


function getBilledItemHtml(itemPrice, pObj) {

    return (`
                                <div class="item-in-cart toggleMe">
                                    <p class="ordered-item" >${pObj.name}</p>
                                    <p class="item-price" id="${pObj.pid}" >$${itemPrice}</p>
                                </div>
                            `
    )
}



function getTotalHtml(pObj) {

    return (`
                    <div class="toggleMe">
                    <div class="item-in-cart bt "></div>
                    <div class="total-price-div" id="total-price-div" >
                        <p class="ordered-item "> Total Price</p>
                        <p class="item-price">$${pObj.price}</p>
                    </div>
                    </div>
        `)
}

function handleOrderBtnClick() {
    document.getElementById("myForm").style.display = "flex";

}

paymentForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const paymentFormData = new FormData(paymentForm)
    let customerName = paymentFormData.get("customerName")

    document.getElementById("myForm").style.display = "none";
    main.innerHTML = ""
    render()
    main.innerHTML += `
                    <div class="order-complete" id="order-complete" >
                    <p class="greetCustomer" >
                    Thanks ${customerName}! Your order is on its way!
                    </p>
                    </div>
                    `
    setTimeout(() => {
        document.location.reload();
    }, 500);

})
