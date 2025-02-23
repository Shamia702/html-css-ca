window.onload = function() {
    updateCartQuantity();
};
const productPageContainer = document.querySelector(".product-page-container")

let basket = JSON.parse(localStorage.getItem("data")) || []

const findUrl = new URLSearchParams(window.location.search)
    const productId = findUrl.get("id");

    let tempQuantity = 1;

 
let productPageData = async ()=>{
    loader = document.getElementById("loader");
        loader.style.display = "flex"; 
    
    try{
    let response = await fetch(`https://v2.api.noroff.dev/rainy-days/${productId}`)
    let finalItems = await response.json();

    let product = finalItems.data;
        displayProductsData(product);

    }catch (error) {
    console.error("Error fetching data:", error);
    } finally {
        loader.style.display = "none";
    }
    };

    function displayProductsData(product) {
        let search = basket.find((x)=> x.id === productId) || { item: 0 };
        tempQuantity = search.item > 0 ? search.item : 1;

        productPageContainer.innerHTML = `
            <div class="product-page-item">
                <img src="${product.image.url}" alt="${product.image.alt}" class="product-page-image">
                <p class="product-description">${product.title}</p>
                ${
                    product.onSale 
                    ? `<p class="product-page-original-price">NOK <s>${product.price}</s></p>
                    <p class="product-page-discounted-price">NOK ${product.discountedPrice}</p>`
                    : `<p class="product-page-price">NOK ${product.price}</p>`
                }
                
            </div>
            <div class="product-options">
                <div class="product-size">
                    <label for="size" style="display: none;">Select Size:</label>
                    <select id="size" name="size">
                        <option value="" disabled selected>Size</option>
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join("")}
                    </select>
                </div>
    <div class="product-quantity">
            <label for="quantity">Quantity:</label>
            <div class="quantity-controls">
            <button id="decrease-btn" onclick="decreaseBtn()">−</button>
            <input type="text" id="quantity-input" name="quantity" value="${tempQuantity}" readonly>
            <button id="increase-btn" onclick="increaseBtn()">+</button>
    </div>
</div>

                <button class="add-to-cart-btn" onclick="addToCart('${productId}')">ADD TO CART</button>
                <a href="checkout.html" class="product-page-buy-btn" onclick="buyNow('${productId}')">BUY NOW</a>
            </div>
            <div class="product-detail-container">
            
                <h5>DETAILS</h5>
                <p>${product.description}</p>
                 <p><span class="bold-text">BaseColor:</span> ${product.baseColor}</p>
            <p><span class="bold-text">Category:</span> ${product.tags}</p>
            <p><span class="bold-text">Gender:</span> ${product.gender}</p>


            </div>
            
            </div>`;
    }
        
function increaseBtn() {
    tempQuantity += 1;
    document.getElementById("quantity-input").value = tempQuantity;
}

function decreaseBtn() {
    if (tempQuantity > 1) {
        tempQuantity -= 1;
        document.getElementById("quantity-input").value = tempQuantity;
    }
}
function addToCart(productId) {
    let search = basket.find((x) => x.id === productId);

    if (search === undefined) {
        basket.push({
            id: productId,
            item: tempQuantity,
        });
    } else {
        search.item += tempQuantity;
    }

    localStorage.setItem("data", JSON.stringify(basket));

    total();
    showPopup();
    generateCartItems(false); 
}




function showPopup() {
    const popup = document.getElementById("cart-popup");
    popup.style.display = "block"; 
    popup.style.opacity = "1";  

    setTimeout(() => {
        popup.style.opacity = "0"; 
        setTimeout(() => {
            popup.style.display = "none"; 
        }, 500);
    }, 2000);  
}
function total() {
    let cartIcon = document.getElementById("cartquantity");
    if (cartIcon) {
        let totalQuantity = basket.reduce((total, item) => total + item.item, 0);
        cartIcon.innerHTML = totalQuantity;
    }
   
}

function buyNow(productId) {
    let productQuantity = parseInt(document.getElementById("quantity-input").value, 10) || 1;

    let checkoutItem = {
        id: productId,
        item: productQuantity 
    };

    localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));

   
    window.location.href = "checkout.html";
}


productPageData();
