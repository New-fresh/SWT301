document.addEventListener("DOMContentLoaded", function () {
  initializeCartPage();
});

// Global variables
let cartData = {
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  shippingFee: 10000, // Default shipping fee
  total: 0,
  appliedPromo: null, // Track applied promo code
};

const MY_BANK = {
  BANK_ID: "970422", // MB Bank
  ACCOUNT_NO: "7500146341390",
  TEMPLATE: "qr_only",
  ACCOUNT_NAME: "Nguyen Thanh Ha",
};

let paymentInterval = null;
let paymentSuccess = false;

function initializeCartPage() {
  loadCartItems();
  calculateTotals();
  initializePaymentMethod();
  initializePromoForm();
  initializeShippingForm(); // Added to initialize shippingForm event listener
}

function initializePromoForm() {
  const promoForm = document.getElementById("promoForm");
  if (promoForm) {
    promoForm.addEventListener("submit", applyPromoCode);
  }
}

function initializeShippingForm() {
  const shippingForm = document.getElementById("shippingForm");
  if (shippingForm) {
    shippingForm.addEventListener("submit", confirmOrder);
  }
}

function applyPromoCode(event) {
  event.preventDefault();
  const promoCode = document.getElementById("promoCode").value.trim().toUpperCase();
  const appliedPromos = document.getElementById("appliedPromos");

  if (!promoCode) {
    showToast("Vui lòng nhập mã giảm giá", "warning");
    return;
  }

  // Sample promo code validation (replace with actual backend API call)
  const validPromoCodes = {
    "SAVE10": 0.1, // 10% discount
    "SAVE20": 0.2, // 20% discount
  };

  if (validPromoCodes[promoCode]) {
    cartData.appliedPromo = { code: promoCode, discount: validPromoCodes[promoCode] };
    appliedPromos.innerHTML = `<span class="promo-code">${promoCode} (${cartData.appliedPromo.discount * 100}%)</span>`;
    calculateTotals();
    showToast(`Mã ${promoCode} được áp dụng thành công!`, "success");
    document.getElementById("promoCode").value = "";
  } else {
    showToast("Mã giảm giá không hợp lệ", "error");
    appliedPromos.innerHTML = "";
    cartData.appliedPromo = null;
    calculateTotals();
  }
}

function initializePaymentMethod() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const bankTransferContainer = document.getElementById("bankTransferContainer");

  paymentMethods.forEach((method) => {
    method.addEventListener("change", () => {
      if (method.value === "bank_transfer") {
        bankTransferContainer.classList.add("active");
        bankTransferContainer.style.display = "block";
        initializeBankTransfer();
      } else {
        bankTransferContainer.classList.remove("active");
        bankTransferContainer.style.display = "none";
        stopPaymentCheck();
      }
    });
  });
}

function initializeBankTransfer() {
  if (!userInSession || !userInSession.userId ) {
    showToast("Vui lòng đăng nhập để sử dụng thanh toán chuyển khoản", "error");
    document.getElementById("bankTransferContainer").classList.remove("active");
    document.getElementById("bankTransferContainer").style.display = "none";
    document.getElementById("cod").checked = true;
    return;
  }
  let email = userInSession.email;
  let customEmail = email.slice(0, email.length - 10)
  console.log(customEmail);
  const qrCodeUrl =
      "https://img.vietqr.io/image/" +
      MY_BANK.BANK_ID +
      "-" +
      MY_BANK.ACCOUNT_NO +
      "-" +
      MY_BANK.TEMPLATE +
      ".png?" +
      "&amount=" + cartData.total +
      "&addInfo=" +
      userInSession.userId +
      customEmail +
      "&accountName=" +
      MY_BANK.ACCOUNT_NAME;

  document.getElementById("qrCode").src = qrCodeUrl;
  document.getElementById("transferContent").textContent = userInSession.userId + userInSession.phoneNumber;
  document.getElementById("totalAmountQR").textContent = formatCurrency(cartData.total);

  startPaymentCheck();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Đã sao chép nội dung chuyển khoản", "success");
  }).catch(() => {
    showToast("Không thể sao chép nội dung", "error");
  });
}

function startPaymentCheck() {
  if (paymentSuccess || !userInSession) return;

  checkPaid();

  paymentInterval = setInterval(() => {
    checkPaid();
  }, 2000);
}

function stopPaymentCheck() {
  if (paymentInterval) {
    console.log("⏹️ Dừng kiểm tra thanh toán...");
    clearInterval(paymentInterval);
    paymentInterval = null;
  }
}

async function checkPaid() {
  if (paymentSuccess || !userInSession) return;

  const appScriptUrl = "https://script.google.com/macros/s/AKfycbw9z_wC_vFCS3D2886b3jOUZyaL644Nv2HuZotjeVqB-Pu2c16bQdf051LRlDCWu9O3/exec";

  try {
    showLoading(true);
    const response = await fetch(appScriptUrl, {
      method: "GET",
      mode: "cors" // Đảm bảo CORS được xử lý
    });
    if (!response.ok) throw new Error("Không thể kiểm tra trạng thái thanh toán");
    const data = await response.json();
    const finalRes = data.data;

    for (const bankData of finalRes) {
      const lastPrice = bankData["Giá trị"];
      const lastContent = bankData["Mô tả"];
      const lastTransCode = bankData["Mã GD"];

      if (String(lastContent).trim().includes(`${userInSession.userId}${userInSession.phoneNumber}`)) {
        const paymentData = {
          amount: Number(lastPrice),
          transCode: lastTransCode,
          userId: Number(userInSession.userId),
        };

        const check = await postPayment(paymentData);
        if (check.success) {
          paymentSuccess = true;
          stopPaymentCheck();
          document.getElementById("bankTransferContainer").classList.add("success");
          document.getElementById("bankTransferContainer").classList.remove("failed");
          document.getElementById("paymentTitle").classList.add("success");
          document.getElementById("paymentTitle").classList.remove("failed");
          document.getElementById("paymentTitle").textContent = "Thanh toán thành công!";
          showToast("Thanh toán thành công! Đang xử lý đơn hàng...", "success");
          const orderData = prepareOrderData();
          if (orderData) {
            submitOrder(orderData);
          }
        }
      }
    }
  } catch (err) {
    console.error("Lỗi kiểm tra thanh toán:", err);
    document.getElementById("bankTransferContainer").classList.add("failed");
    document.getElementById("bankTransferContainer").classList.remove("success");
    document.getElementById("paymentTitle").classList.add("failed");
    document.getElementById("paymentTitle").classList.remove("success");
    document.getElementById("paymentTitle").textContent = "Thanh toán chưa hoàn tất";
    showToast("Không thể xác minh thanh toán. Vui lòng thử lại.", "error");
  } finally {
    showLoading(false);
  }
}

async function postPayment(paymentData) {
  try {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(paymentData),
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gửi thanh toán:", error);
    return { success: false, message: "Lỗi khi gửi thanh toán" };
  }
}

async function verifyTransaction() {
  const transactionCode = document.getElementById("transactionCode").value;
  if (!transactionCode) {
    showToast("Vui lòng nhập mã giao dịch", "warning");
    return;
  }

  if (!userInSession || !userInSession.userId || !userInSession.phoneNumber) {
    showToast("Vui lòng đăng nhập để xác minh giao dịch", "error");
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(
        "https://script.google.com/macros/s/AKfycby3Ebwe5g2hW5W0_3F2M1u7J2gE9b0T9L2W3u5J3K7h8g9i0k/exec"
    );
    if (!response.ok) throw new Error("Không thể kiểm tra giao dịch");
    const data = await response.json();
    const finalRes = data.data;

    for (const bankData of finalRes) {
      if (bankData["Mã GD"] === transactionCode) {
        const paymentData = {
          amount: Number(bankData["Giá trị"]),
          transCode: transactionCode,
          userId: Number(userInSession.userId),
        };

        const check = await postPayment(paymentData);
        if (check.success) {
          paymentSuccess = true;
          stopPaymentCheck();
          document.getElementById("bankTransferContainer").classList.add("success");
          document.getElementById("bankTransferContainer").classList.remove("failed");
          document.getElementById("paymentTitle").classList.add("success");
          document.getElementById("paymentTitle").classList.remove("failed");
          document.getElementById("paymentTitle").textContent = "Thanh toán thành công!";
          showToast("Xác minh giao dịch thành công! Đang xử lý đơn hàng...", "success");
          const orderData = prepareOrderData();
          if (orderData) {
            submitOrder(orderData);
          }
          return;
        }
      }
    }
    showToast("Mã giao dịch không hợp lệ", "error");
  } catch (error) {
    console.error("Lỗi xác minh giao dịch:", error);
    showToast("Có lỗi khi xác minh giao dịch", "error");
  } finally {
    showLoading(false);
  }
}

function loadCartItems() {
  showLoading(true);
  fetch("/cart/api/items", {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
      .then((response) => response.json())
      .then((data) => {
        showLoading(false);
        if (data.length !== 0) {
          cartData.items = data;
          renderCartItems(data);
          calculateTotals();
        } else {
          showEmptyCart();
        }
      })
      .catch((error) => {
        showLoading(false);
        console.error("Error loading cart:", error);
        showEmptyCart();
      });
}

function renderCartItems(items) {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");

  if (!items || items.length === 0) {
    cartItemsContainer.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }

  cartItemsContainer.style.display = "block";
  emptyCart.style.display = "none";
  const itemsHTML = items
      .map(
          (item) => `
      <div class="cart-item" data-item-id="${item.id}">
          <div class="item-image">
              <img src="${item.imageFile}" alt="${item.productName}" 
                   onerror="this.src='/img/placeholder.svg'">
          </div>
          <div class="item-details">
              <h3 class="item-title">${item.productName}</h3>
              <p class="item-author">Tác giả: ${item.author}</p>
          </div>
          <div class="item-quantity">
              <div class="quantity-controls">
                  <button class="qty-btn" onclick="updateQuantity(${item.productId}, ${item.quantity}-1)">
                      <i class="ri-subtract-line"></i>
                  </button>
                  <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" 
                         onchange="updateQuantity(${item.productId}, this.value, true)">
                  <button class="qty-btn" onclick="updateQuantity(${item.productId}, ${item.quantity}+1)">
                      <i class="ri-add-line"></i>
                  </button>
              </div>
          </div>
          <div class="item-total">
              <span class="total-price">${formatCurrency((item.price * (100 - item.discount) / 100) * item.quantity)}</span>
          </div>
          <div class="item-actions">
              <button class="action-btn remove-btn" onclick="removeItem(${item.productId})" 
                      title="Xóa khỏi giỏ">
                  <i class="ri-delete-bin-line"></i>
              </button>
          </div>
      </div>
    `
      )
      .join("");

  cartItemsContainer.innerHTML = itemsHTML;
}

async function updateQuantity(itemId, change, isAbsolute = false) {
  showLoading(true);

  const quantity = isAbsolute ? parseInt(change) : change;
  const available = cartData.items.find((s) => s.productId === itemId);

  const cartItem = {
    productId: itemId,
    quantity: quantity < 0 ? 0 : quantity,
  };

  if (available.available >= quantity) {
    await fetch("/cart/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(cartItem),
    })
        .then((data) => {
          showLoading(false);
          loadCartItems();
          showToast("Đã cập nhật số lượng", "success");
          updateBankTransferQR();
        })
        .catch((error) => {
          showLoading(false);
          console.error("Error:", error);
          showToast("Có lỗi xảy ra khi cập nhật", "error");
        });
  } else {
    showToast("Vượt quá số lượng trong kho!", "error");
    showLoading(false);
  }
}

function removeItem(itemId) {
  showModal("Xác nhận xóa", "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?", () => {
    const cartItem = {
      productId: itemId,
      quantity: 0,
    };

    showLoading(true);
    fetch(`/cart/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(cartItem),
    })
        .then(() => {
          showLoading(false);
          loadCartItems();
          showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
          updateBankTransferQR();
        })
        .catch((error) => {
          showLoading(false);
          console.error("Error:", error);
          showToast("Có lỗi xảy ra", "error");
        });
  });
}

function clearCart() {
  if (!cartData.items.length) {
    showToast("Giỏ hàng đã trống", "warning");
    return;
  }

  showModal("Xác nhận xóa", "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?", () => {
    showLoading(true);
    fetch("/cart/api/delete/allItems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
        .then(() => {
          showLoading(false);
          showEmptyCart();
          showToast("Đã xóa tất cả sản phẩm", "success");
          updateBankTransferQR();
        })
        .catch((error) => {
          showLoading(false);
          console.error("Error:", error);
          showToast("Có lỗi xảy ra", "error");
        });
  });
}

function showEmptyCart() {
  document.getElementById("cartItems").style.display = "none";
  document.getElementById("emptyCart").style.display = "block";
  cartData.items = [];
  cartData.appliedPromo = null;
  document.getElementById("appliedPromos").innerHTML = "";
  calculateTotals();
  updateBankTransferQR();
}

function calculateTotals() {
  const subtotal = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = calculateDiscount(subtotal);
  if (cartData.appliedPromo) {
    discount += Math.round(subtotal * cartData.appliedPromo.discount);
  }
  const tax = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + tax + cartData.shippingFee;

  document.getElementById("itemCount").textContent = cartData.items.length;
  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.querySelector(".discount-amount").textContent = `-${formatCurrency(discount)}`;
  document.getElementById("shippingFee").textContent = formatCurrency(cartData.shippingFee);
  document.getElementById("tax").textContent = formatCurrency(tax);
  document.getElementById("totalAmount").textContent = formatCurrency(total);

  cartData = { ...cartData, subtotal, discount, tax, total };
  updateBankTransferQR();
}

function calculateDiscount(subtotal) {
  if (subtotal >= 1000000) return Math.round(subtotal * 0.1);
  if (subtotal >= 500000) return Math.round(subtotal * 0.05);
  return 0;
}

function updateShippingFee() {
  const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked').value;
  cartData.shippingFee = shippingMethod === "express" ? 30000 : 10000;
  calculateTotals();
}

function proceedToCheckout() {
  if (cartData.items.length === 0) {
    showToast("Giỏ hàng của bạn đang trống", "warning");
    return;
  }

  const shippingSection = document.getElementById("shippingSection");
  if (!shippingSection) {
    console.error("Shipping section not found");
    showToast("Có lỗi xảy ra", "error");
    return;
  }

  shippingSection.style.display = "block";
  shippingSection.classList.add("active");
  updateShippingFee(); // Initialize shipping fee based on default selection
}

function backToSummary() {
  const shippingSection = document.getElementById("shippingSection");
  shippingSection.classList.remove("active");
  shippingSection.style.display = "none";
  cartData.shippingFee = 10000; // Reset to default
  calculateTotals();
  stopPaymentCheck();
}

function updateBankTransferQR() {
  if (document.querySelector('input[name="paymentMethod"]:checked').value === "bank_transfer" && document.getElementById("bankTransferContainer").classList.contains("active")) {
    initializeBankTransfer();
  }
}

function prepareOrderData() {
  const form = document.getElementById("shippingForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return null;
  }

  const formData = new FormData(form);
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;

  if (!paymentMethod) {
    showToast("Vui lòng chọn phương thức thanh toán", "warning");
    return null;
  }

  if (paymentMethod === "bank_transfer" && !paymentSuccess) {
    showToast("Thanh toán chuyển khoản chưa được xác nhận", "warning");
    return null;
  }

  return {
    items: cartData.items,
    shipping: {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      province: formData.get("province"),
      district: formData.get("district"),
      method: formData.get("shippingMethod"),
      note: formData.get("note"),
    },
    payment: paymentMethod,
    totals: {
      subtotal: cartData.subtotal,
      discount: cartData.discount,
      tax: cartData.tax,
      shipping: cartData.shippingFee,
      total: cartData.total,
    },
    promoCode: cartData.appliedPromo ? cartData.appliedPromo.code : null,
  };
}

function confirmOrder(event) {
  event.preventDefault();

  const orderData = prepareOrderData();
  if (!orderData) return;

  showModal(
      "Xác nhận đặt hàng",
      `Tổng tiền: ${formatCurrency(cartData.total)}<br>
     Phương thức thanh toán: ${orderData.payment === "cod" ? "Thanh toán khi nhận hàng" : orderData.payment === "vnpay" ? "VNPay" : "Chuyển khoản ngân hàng"}<br>
     ${orderData.promoCode ? `Mã giảm giá: ${orderData.promoCode}<br>` : ""}
     Bạn có chắc chắn muốn đặt hàng?`,
      () => submitOrder(orderData)
  );
}

async function submitOrder(orderData) {
  try {
    showLoading(true);
    const response = await fetch("/cart/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (result.success) {
      showToast("Đặt hàng thành công!", "success");
      stopPaymentCheck();
      setTimeout(() => {
        window.location.href = `/orders/${result.orderId}`;
      }, 1500);
    } else {
      showToast(result.message || "Có lỗi xảy ra khi đặt hàng", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Có lỗi xảy ra khi đặt hàng", "error");
  } finally {
    showLoading(false);
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const container = document.getElementById("toastContainer");
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 100);
}

function showModal(title, message, onConfirm) {
  const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").innerHTML = message;

  const confirmBtn = document.getElementById("modalConfirm");
  confirmBtn.onclick = () => {
    modal.hide();
    onConfirm();
  };

  modal.show();
}

function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = show ? "flex" : "none";
}