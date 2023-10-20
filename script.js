// Ürünleri ve sepeti tanımlayın
const products = [
  {
    name: "urun1",
    price: 50,
    stock: 6,
  },
  {
    name: "urun2",
    price: 30,
    stock: 1,
  },
  // Diğer ürünler burada
];

let cart = [];

// Sepeti localStorage'a kaydetme işlevi
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
// Sepeti localStorage'dan yükleme işlevi
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    cart = JSON.parse(cartData);
  }
}

// HTML elementlerini seçin
const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const totalPrice = document.getElementById("totalPrice");
const orderButton = document.getElementById("orderButton");
const searchBox = document.getElementById("searchBox");


// Arama kutusunda herhangi bir tuşa basıldığında ürünleri filtrele
searchBox.addEventListener("keyup", listProducts);

// Ürünleri listeleme işlevini 
function listProducts() {
  productList.innerHTML = "";
  const searchKeyword = searchBox.value.toLowerCase(); // Aranan kelimeyi küçük harf yapın

  products.forEach((product, index) => {
    // Ürün adını küçük harfe çevirin ve aranan kelime ile karşılaştırın
    if (product.name.toLowerCase().includes(searchKeyword)) {
      const productLi = document.createElement("li");
      productLi.innerHTML = `
        ${product.name} - ${product.price} TL
        <button onclick="addToCart(${index})">Sepete Ekle</button>
      `;
      productList.appendChild(productLi);
    }
  });
}

// Sepeti güncelleme işlevi
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((product) => {
    const cartLi = document.createElement("li");
    cartLi.innerHTML = `
        ${product.name} - ${product.price} TL (${product.quantity} adet)
        <button onclick="removeFromCart('${product.name}')">Sil</button>
      `;
    cartList.appendChild(cartLi);
    total += product.price * product.quantity;
  });
  totalPrice.textContent = `${total} TL`;
}

// Sepete ürün ekleme işlevi
function addToCart(index) {
  const product = products[index];
  const existingProduct = cart.find((p) => p.name.toLowerCase() === product.name.toLowerCase());

  // Stokta yeterli ürün var mı kontrol et
  if (product.stock <= 0) {
    alert("Bu ürün stokta tükenmiştir.");
    return;
  }

  // Sepete ekleme işlemi
  if (existingProduct) {
    if (existingProduct.quantity < product.stock) {
      existingProduct.quantity++;
    } else {
      alert("Bu ürünün stok miktarı limitine ulaşıldı.");
      return; // Sepete eklemeyi sonlandır
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  saveCartToLocalStorage(); // Sepeti localStorage'a kaydet
}

// Sepetten ürün çıkarma işlevi
function removeFromCart(productName) {
  const productIndex = cart.findIndex((p) => p.name.toLowerCase() === productName.toLowerCase());
  if (productIndex !== -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity--;
      const product = products.find((p) => p.name.toLowerCase() === productName.toLowerCase());
      if (product) {
        product.stock++; // Ürünü stoktan artır
      }
    } else {
      const product = products.find((p) => p.name.toLowerCase() === productName.toLowerCase());
      if (product) {
        product.stock++; // Ürünü stoktan artır
      }
      cart.splice(productIndex, 1);
    }
    updateCart();
    saveCartToLocalStorage(); // Sepeti localStorage'a kaydet
  }
}

// Siparişi tamamla işlevi
orderButton.addEventListener("click", function () {
  if (cart.length > 0) {
    alert("Siparişiniz tamamlandı!");
    cart.length = 0; // Sepeti boşalt
    updateCart();
  } else {
    alert("Sepetiniz boş. Ürün ekleyin!");
  }
});

// Sayfa yüklendiğinde başlangıç işlemleri
document.addEventListener("DOMContentLoaded", function () {
  listProducts();
  loadCartFromLocalStorage(); // localStorage'dan sepet verilerini yükle
  updateCart();
});
