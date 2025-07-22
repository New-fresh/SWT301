// Thêm vào đầu file profile.js
const mockUser = {
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    birthDate: "1990-01-01",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar: "https://i.pravatar.cc/300",
    totalBooks: 25,
    totalSpent: 2500000,
    memberSince: "2020",
    level: "Độc giả Vàng",
    points: 2500,
    wishlist: 12,
    reviews: 8,
};

// Mock books data
const mockBooks = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        imageUrl: "https://picsum.photos/200/300",
        rating: 4.5,
        reviewCount: 128,
        price: 350000,
        originalPrice: 450000,
    },
    {
        id: 2,
        title: "Design Patterns",
        author: "Erich Gamma",
        imageUrl: "https://picsum.photos/200/300",
        rating: 4.8,
        reviewCount: 89,
        price: 450000,
    },
    {
        id: 3,
        title: "Domain-Driven Design",
        author: "Eric Evans",
        imageUrl: "https://picsum.photos/200/300",
        rating: 4.6,
        reviewCount: 156,
        price: 300000,
        originalPrice: 380000,
    },
];

// Mock reviews data
const mockReviews = [
    {
        id: 1,
        book: {
            title: "Clean Code",
            author: "Robert C. Martin",
            imageUrl: "https://picsum.photos/60/80",
        },
        rating: 5,
        content: "Sách rất hay và đầy đủ chi tiết về clean code. Recommended cho mọi developer!",
        createdDate: "2024-01-20",
    },
    {
        id: 2,
        book: {
            title: "Design Patterns",
            author: "Erich Gamma",
            imageUrl: "https://picsum.photos/60/80",
        },
        rating: 4,
        content: "Sách giải thích rất rõ về các design pattern phổ biến. Tuy nhiên một số ví dụ hơi khó hiểu.",
        createdDate: "2024-02-15",
    },
];

// Mock functions để test
function loadOrders() {
    // Mock orders data
    const mockOrders = [
        {
            id: "ORD001",
            createdDate: "2024-01-15",
            status: "delivered",
            statusText: "Đã giao",
            totalAmount: 350000,
            items: [
                {
                    book: {
                        title: "Clean Code",
                        author: "Robert C. Martin",
                        imageUrl: "https://picsum.photos/60/80",
                    },
                    quantity: 1,
                    price: 350000,
                },
            ],
        },
        {
            id: "ORD002",
            createdDate: "2024-02-20",
            status: "processing",
            statusText: "Đang xử lý",
            totalAmount: 750000,
            items: [
                {
                    book: {
                        title: "Design Patterns",
                        author: "Erich Gamma",
                        imageUrl: "https://picsum.photos/60/80",
                    },
                    quantity: 2,
                    price: 450000,
                },
                {
                    book: {
                        title: "Domain-Driven Design",
                        author: "Eric Evans",
                        imageUrl: "https://picsum.photos/60/80",
                    },
                    quantity: 1,
                    price: 300000,
                },
            ],
        },
        {
            id: "ORD003",
            createdDate: "2024-03-01",
            status: "pending",
            statusText: "Chờ xử lý",
            totalAmount: 550000,
            items: [
                {
                    book: {
                        title: "Refactoring",
                        author: "Martin Fowler",
                        imageUrl: "https://picsum.photos/60/80",
                    },
                    quantity: 1,
                    price: 550000,
                },
            ],
        },
        {
            id: "ORD004",
            createdDate: "2024-03-10",
            status: "shipped",
            statusText: "Đang giao",
            totalAmount: 1200000,
            items: [
                {
                    book: {
                        title: "Working Effectively with Legacy Code",
                        author: "Michael Feathers",
                        imageUrl: "https://picsum.photos/60/80",
                    },
                    quantity: 2,
                    price: 600000,
                },
                {
                    book: {
                        title: "Test Driven Development",
                        author: "Kent Beck",
                        imageUrl: "https://picsum.photos/60/80",
                    },
                    quantity: 1,
                    price: 600000,
                },
            ],
        },
    ];

    renderOrders(mockOrders);
}

// Profile Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
    initializeProfilePage();
});

function initializeProfilePage() {
    // Update profile header with mock data
    // updateProfileHeader(mockUser);

    // Tab functionality
    initializeTabs();

    // Form handling
    initializeForms();

    // Avatar upload
    initializeAvatarUpload();

    // Load dynamic content
    // loadOrders();
    // renderWishlist(mockBooks);
    // renderReviews(mockReviews);

    // Initialize filters
    initializeFilters();

    // Update profile stats
    // updateProfileStats();
}

function updateProfileStats() {
    const profileStats = document.querySelector(".profile-stats");
    if (profileStats) {
        profileStats.innerHTML = `
      <div class="stat">
        <span class="stat-number">${mockUser.totalBooks}</span>
        <span class="stat-label">Sách đã mua</span>
      </div>
      <div class="stat">
        <span class="stat-number">${formatCurrency(mockUser.totalSpent)}</span>
        <span class="stat-label">Tổng chi tiêu</span>
      </div>
      <div class="stat">
        <span class="stat-number">${mockUser.points}</span>
        <span class="stat-label">Điểm tích lũy</span>
      </div>
      <div class="stat">
        <span class="stat-number">${mockUser.level}</span>
        <span class="stat-label">Cấp độ</span>
      </div>
    `;
    }
}

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");

            // Remove active class from all tabs and panes
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabPanes.forEach((pane) => pane.classList.remove("active"));

            // Add active class to clicked tab and corresponding pane
            button.classList.add("active");
            document.getElementById(targetTab).classList.add("active");

            // Load content for specific tabs
            if (targetTab === "orders") {
                loadOrders();
            } else if (targetTab === "wishlist") {
                loadWishlist();
            } else if (targetTab === "reviews") {
                loadReviews();
            }
        });
    });
}

// Form Management
function initializeForms() {
    // Personal information form
    const editPersonalBtn = document.getElementById("editPersonalBtn");
    const personalForm = document.getElementById("personalForm");
    const personalActions = document.getElementById("personalActions");
    const cancelPersonalBtn = document.getElementById("cancelPersonalBtn");

    if (editPersonalBtn) {
        editPersonalBtn.addEventListener("click", () => {
            toggleFormEdit(personalForm, personalActions, true);
        });
    }

    if (cancelPersonalBtn) {
        cancelPersonalBtn.addEventListener("click", () => {
            toggleFormEdit(personalForm, personalActions, false);
            // Reset form to original values
            personalForm.reset();
        });
    }

    // Form submissions
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
        form.addEventListener("submit", handleFormSubmit);
    });
}

function toggleFormEdit(form, actions, isEditing) {
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');

    inputs.forEach((input) => {
        if (isEditing) {
            input.removeAttribute("readonly");
            input.classList.remove("readonly");
        } else {
            input.setAttribute("readonly", "readonly");
            input.classList.add("readonly");
        }
    });

    if (isEditing) {
        actions.style.display = "flex";
    } else {
        actions.style.display = "none";
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const action = form.getAttribute("action");

    showLoading(true);

    // Simulate API call
    fetch(action, {
        method: "POST",
        body: formData,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                showToast("Cập nhật thành công!", "success");

                // Handle specific form responses
                if (form.id === "personalForm") {
                    toggleFormEdit(form, document.getElementById("personalActions"), false);
                    updateProfileHeader(data.user);
                }
            } else {
                showToast(data.message || "Có lỗi xảy ra!", "error");
            }
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra khi cập nhật!", "error");
            console.error("Error:", error);
        });
}

// Avatar Upload
function initializeAvatarUpload() {
    const avatarInput = document.getElementById("avatarInput");
    const avatarImage = document.getElementById("avatarImage");

    if (avatarInput) {
        avatarInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith("image/")) {
                    showToast("Vui lòng chọn file hình ảnh!", "error");
                    return;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast("Kích thước file không được vượt quá 5MB!", "error");
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = function (e) {
                    avatarImage.src = e.target.result;
                };
                reader.readAsDataURL(file);

                // Upload avatar
                uploadAvatar(file);
            }
        });
    }
}

function uploadAvatar(file) {
    const reader = new FileReader();
    reader.onloadend = function () {
        const base64Image = reader.result.split(',')[1];

        const userId = document.getElementById("userId").value;
        fetch(`/profile/${userId}/avatar/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageFile: base64Image
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Upload failed");
                }
                return response.text();
            })
            .then((message) => {
                showToast("Cập nhật avatar thành công!", "success");
            })
            .catch((error) => {
                showToast("Có lỗi xảy ra khi upload avatar!", "error");
                console.error("Error:", error);
            });
    };

    reader.readAsDataURL(file);
}


// Load Orders
function loadOrders() {
    const ordersList = document.getElementById("ordersList");
    const statusFilter = document.getElementById("orderStatus");

    if (!ordersList) return;

    const status = statusFilter ? statusFilter.value : "";

    showLoading(true);

    fetch(`/api/profile/orders?status=${status}`, {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                renderOrders(data.orders);
            } else {
                ordersList.innerHTML = '<p class="text-center">Không thể tải danh sách đơn hàng.</p>';
            }
        })
        .catch((error) => {
            showLoading(false);
            ordersList.innerHTML = '<p class="text-center">Có lỗi xảy ra khi tải đơn hàng.</p>';
            console.error("Error:", error);
        });
}

function renderOrders(orders) {
    const ordersList = document.getElementById("ordersList");
    const orderCount = document.getElementById("orderCount");

    if (orderCount) {
        orderCount.textContent = `${orders.length} đơn hàng`;
    }

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="text-center">Bạn chưa có đơn hàng nào.</p>';
        return;
    }

    const ordersHTML = orders
        .map(
            (order) => `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">${formatDate(order.createdDate)}</span>
                </div>
                <span class="order-status status-${order.status}">${order.statusText}</span>
            </div>
            <div class="order-items">
                ${order.items
                .map(
                    (item) => `
                    <div class="order-book">
                        <img src="${item.book.imageUrl}" alt="${item.book.title}" class="book-thumb" loading="lazy">
                        <div class="book-info">
                            <h4>${item.book.title}</h4>
                            <p class="book-author">Tác giả: ${item.book.author}</p>
                            <p class="book-quantity">
                              <span class="quantity-label">Số lượng:</span>
                              <strong>${item.quantity}</strong> x
                              <span class="item-price">${formatCurrency(item.price)}</span>
                            </p>
                        </div>
                        <div class="book-price">
                          <strong>${formatCurrency(item.price * item.quantity)}</strong>
                        </div>
                    </div>
                `
                )
                .join("")}
            </div>
            <div class="order-footer">
                <div class="order-details">
                    <div class="order-total">
                        <span>Tổng tiền:</span>
                        <strong>${formatCurrency(order.totalAmount)}</strong>
                    </div>
                    <div class="order-meta">
                        <span>${order.items.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm</span>
                    </div>
                </div>
                <div class="order-actions">
                    <a href="/orders/${order.id}" class="btn btn-outline">
                        <i class="fas fa-eye"></i> Chi tiết
                    </a>
                    <button type="button" class="btn btn-outline" onclick="reorderItems('${order.id}')">
                        <i class="fas fa-shopping-cart"></i> Mua lại
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    ordersList.innerHTML = ordersHTML;

    // Add hover effects
    const orderItems = document.querySelectorAll(".order-item");
    orderItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            item.style.transform = "translateY(-2px)";
            item.style.boxShadow = "var(--shadow-xl)";
        });
        item.addEventListener("mouseleave", () => {
            item.style.transform = "translateY(0)";
            item.style.boxShadow = "var(--shadow-lg)";
        });
    });
}
// UPDATE PROFILE
const updateProfile = () => {

}
// Load Wishlist
function loadWishlist() {
    const wishlistGrid = document.getElementById("wishlistGrid");
    const wishlistCount = document.getElementById("wishlistCount");

    if (!wishlistGrid) return;

    showLoading(true);

    fetch("/api/profile/wishlist", {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                renderWishlist(data.books);
                if (wishlistCount) {
                    wishlistCount.textContent = `${data.books.length} sách`;
                }
            } else {
                wishlistGrid.innerHTML = '<p class="text-center">Không thể tải danh sách yêu thích.</p>';
            }
        })
        .catch((error) => {
            showLoading(false);
            wishlistGrid.innerHTML = '<p class="text-center">Có lỗi xảy ra khi tải danh sách yêu thích.</p>';
            console.error("Error:", error);
        });
}

function renderWishlist(books) {
    const wishlistGrid = document.getElementById("wishlistGrid");

    if (books.length === 0) {
        wishlistGrid.innerHTML = '<p class="text-center">Danh sách yêu thích của bạn đang trống.</p>';
        return;
    }

    const booksHTML = books
        .map(
            (book) => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-image">
                <img src="${book.imageUrl}" alt="${book.title}">
                <button class="remove-wishlist" onclick="removeFromWishlist(${book.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="book-details">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-rating">
                    <div class="stars">
                        ${generateStars(book.rating)}
                    </div>
                    <span>(${book.reviewCount})</span>
                </div>
                <div class="book-price">
                    <span class="current-price">${formatCurrency(book.price)}</span>
                    ${
                book.originalPrice
                    ? `<span class="original-price">${formatCurrency(book.originalPrice)}</span>`
                    : ""
            }
                </div>
                <button class="btn btn-primary" onclick="addToCart(${book.id})">
                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `
        )
        .join("");

    wishlistGrid.innerHTML = booksHTML;
}

// Load Reviews
function loadReviews() {
    const reviewsList = document.getElementById("reviewsList");
    const reviewCount = document.getElementById("reviewCount");

    if (!reviewsList) return;

    showLoading(true);

    fetch("/api/profile/reviews", {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                renderReviews(data.reviews);
                if (reviewCount) {
                    reviewCount.textContent = `${data.reviews.length} đánh giá`;
                }
            } else {
                reviewsList.innerHTML = '<p class="text-center">Không thể tải danh sách đánh giá.</p>';
            }
        })
        .catch((error) => {
            showLoading(false);
            reviewsList.innerHTML = '<p class="text-center">Có lỗi xảy ra khi tải đánh giá.</p>';
            console.error("Error:", error);
        });
}

function renderReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="text-center">Bạn chưa có đánh giá nào.</p>';
        return;
    }

    const reviewsHTML = reviews
        .map(
            (review) => `
        <div class="review-item" data-review-id="${review.id}">
            <div class="review-book">
                <img src="${review.book.imageUrl}" alt="${review.book.title}" class="book-thumb">
                <div class="book-info">
                    <h4>${review.book.title}</h4>
                    <p>${review.book.author}</p>
                </div>
            </div>
            <div class="review-content">
                <div class="review-header">
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                    <span class="review-date">${formatDate(review.createdDate)}</span>
                </div>
                <p class="review-text">${review.content}</p>
                <div class="review-actions">
                    <button class="btn btn-outline btn-sm" onclick="editReview(${review.id})">
                        <i class="fas fa-edit"></i> Chỉnh sửa
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteReview(${review.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    reviewsList.innerHTML = reviewsHTML;
}

// Initialize Filters
function initializeFilters() {
    const orderStatus = document.getElementById("orderStatus");

    if (orderStatus) {
        orderStatus.addEventListener("change", loadOrders);
    }
}

// Utility Functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = "";

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

function showLoading(show) {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add("show");
        } else {
            loadingOverlay.classList.remove("show");
        }
    }
}

function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function updateProfileHeader(user) {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const totalBooks = document.getElementById("totalBooks");
    const totalSpent = document.getElementById("totalSpent");

    if (userName) userName.textContent = user.fullName;
    if (userEmail) userEmail.textContent = user.email;
    if (totalBooks) totalBooks.textContent = user.totalBooks;
    if (totalSpent) totalSpent.textContent = formatCurrency(user.totalSpent);
}

// Action Functions
function removeFromWishlist(bookId) {
    if (!confirm("Bạn có chắc muốn xóa sách này khỏi danh sách yêu thích?")) {
        return;
    }

    showLoading(true);

    fetch(`/api/wishlist/remove/${bookId}`, {
        method: "DELETE",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                showToast("Đã xóa khỏi danh sách yêu thích!", "success");
                loadWishlist(); // Reload wishlist
            } else {
                showToast(data.message || "Có lỗi xảy ra!", "error");
            }
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra!", "error");
            console.error("Error:", error);
        });
}

function addToCart(bookId) {
    showLoading(true);

    fetch("/api/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
            bookId: bookId,
            quantity: 1,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                showToast("Đã thêm vào giỏ hàng!", "success");
            } else {
                showToast(data.message || "Có lỗi xảy ra!", "error");
            }
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra!", "error");
            console.error("Error:", error);
        });
}

function reorderItems(orderId) {
    if (!confirm("Bạn có muốn mua lại các sản phẩm trong đơn hàng này?")) {
        return;
    }

    showLoading(true);

    fetch(`/api/orders/${orderId}/reorder`, {
        method: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                showToast("Đã thêm các sản phẩm vào giỏ hàng!", "success");
            } else {
                showToast(data.message || "Có lỗi xảy ra!", "error");
            }
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra!", "error");
            console.error("Error:", error);
        });
}

function editReview(reviewId) {
    // Implementation for editing review
    window.location.href = `/reviews/edit/${reviewId}`;
}

function deleteReview(reviewId) {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) {
        return;
    }

    showLoading(true);

    fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                showToast("Đã xóa đánh giá!", "success");
                loadReviews(); // Reload reviews
            } else {
                showToast(data.message || "Có lỗi xảy ra!", "error");
            }
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra!", "error");
            console.error("Error:", error);
        });
}

function exportData() {
    showLoading(true);

    fetch("/api/profile/export", {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.blob())
        .then((blob) => {
            showLoading(false);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "profile-data.json";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            showToast("Dữ liệu đã được xuất thành công!", "success");
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra khi xuất dữ liệu!", "error");
            console.error("Error:", error);
        });
}

function deleteAccount() {
    const confirmation = prompt('Để xác nhận xóa tài khoản, vui lòng nhập "XOA TAI KHOAN":');

    if (confirmation !== "XOA TAI KHOAN") {
        showToast("Xác nhận không chính xác!", "error");
        return;
    }

    showLoading(true);

    fetch("/api/profile/delete-account", {
        method: "DELETE",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            showLoading(false);

            if (data.success) {
                showToast("Tài khoản đã được xóa!", "success");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                showToast(data.message || "Có lỗi xảy ra!", "error");
            }
        })
        .catch((error) => {
            showLoading(false);
            showToast("Có lỗi xảy ra!", "error");
            console.error("Error:", error);
        });
}



//Handle CHANGE PASSWORD
const form = document.getElementById("passwordForm");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", function (e) {
    if (newPassword.value !== confirmPassword.value) {
        e.preventDefault();
        alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        confirmPassword.focus();
    }
});

//Notification

function updateSubscription(isChecked) {
    const userId = document.querySelector('input[name="userId"]').value; // Lấy userId từ hidden input
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Hiển thị loading
    loadingOverlay.style.display = 'flex';

    fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&isSubscribed=${isChecked}`
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật trạng thái đăng ký');
            }
            return response.text();
        })
        .then(data => {
            // Ẩn loading
            loadingOverlay.style.display = 'none';

            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: data,
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true
            });
        })
        .catch(error => {
            // Ẩn loading
            loadingOverlay.style.display = 'none';

            // Hiển thị thông báo lỗi
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message,
                confirmButtonText: 'OK'
            });
            // Khôi phục trạng thái switch nếu lỗi
            document.getElementById('subscribeSwitch').checked = !isChecked;
        });
}