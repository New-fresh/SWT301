let couponModal;
let couponSaveSuccess = false;

document.addEventListener("DOMContentLoaded", function () {
    loadCoupons();

    const modalElement = document.getElementById('couponModal');
    couponModal = new bootstrap.Modal(modalElement);

    modalElement.addEventListener('hidden.bs.modal', function () {
        loadCoupons();

        if (couponSaveSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Coupon saved successfully!',
                timer: 1500,
                showConfirmButton: false
            });
            couponSaveSuccess = false; // reset flag
        }
    });

    document.getElementById("couponSearchInput").addEventListener("input", function () {
        const searchValue = this.value;
        loadCoupons(searchValue);
    });

    document.getElementById("btnSaveCoupon").addEventListener("click", function () {
        saveCoupon();
    });
});


let currentPage = 0;
let pageSize = 5;

function loadCoupons(search = "", page = 0) {
    currentPage = page;
    const url = `/api/coupon/paged?search=${encodeURIComponent(search)}&page=${page}&size=${pageSize}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            renderCouponTable(result.data);
            renderPagination(result.totalPages, result.currentPage);
        })
        .catch(error => {
            console.error("Error loading coupons: ", error);
        });
}


function renderCouponTable(coupons) {
    const tableBody = document.getElementById("couponTableBody");
    tableBody.innerHTML = "";

    coupons.forEach(coupon => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${coupon.couponId}</td>
            <td>${coupon.code}</td>
            <td>${coupon.discountPercent}</td>
            <td>${coupon.quantity}</td>
            <td>${coupon.startDate ? coupon.startDate.replace("T", " ") : ""}</td>
            <td>${coupon.endDate ? coupon.endDate.replace("T", " ") : ""}</td>
            <td>${coupon.isActive ? "Active" : "Inactive"}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick='showEditCoupon(${JSON.stringify(coupon)})'>Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showEditCoupon(coupon) {
    // Đổ dữ liệu vào form
    document.getElementById("couponId").value = coupon.couponId;
    document.getElementById("code").value = coupon.code;
    document.getElementById("discountPercent").value = coupon.discountPercent;
    document.getElementById("quantity").value = coupon.quantity;
    document.getElementById("startDate").value = coupon.startDate ? coupon.startDate.split("T")[0] : "";
    document.getElementById("endDate").value = coupon.endDate ? coupon.endDate.split("T")[0] : "";
    document.getElementById("isActive").checked = coupon.isActive;

    // Mở modal
    $("#couponModal").modal("show");
}

function openCreateCouponForm() {
    // Clear form để thêm mới
    document.getElementById("couponForm").reset();
    document.getElementById("couponId").value = "";
    $("#couponModal").modal("show");
}

function saveCoupon() {
    const couponId = document.getElementById("couponId").value;

    const couponData = {
        code: document.getElementById("code").value,
        discountPercent: parseFloat(document.getElementById("discountPercent").value),
        quantity: parseFloat(document.getElementById("quantity").value),
        startDate: document.getElementById("startDate").value ? document.getElementById("startDate").value + "T00:00:00" : null,
        endDate: document.getElementById("endDate").value ? document.getElementById("endDate").value + "T23:59:59" : null,
        isActive: document.getElementById("isActive").checked
    };

    let url = "/api/coupon";
    let method = "POST";

    if (couponId) {
        url = "/api/coupon/" + couponId;
        method = "PUT";
        couponData.couponId = parseInt(couponId);
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(couponData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to save coupon");
            }
        })
        .then(() => {
            couponSaveSuccess = true; // set flag
            couponModal.hide();       // ẩn modal, phần còn lại đã nằm trong event 'hidden.bs.modal'
        })
        .catch(error => {
            console.error("Error saving coupon: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'An error occurred while saving.'
            });
        });
}


function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById("couponPagination");
    pagination.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement("li");
        li.className = "page-item" + (i === currentPage ? " active" : "");
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener("click", function (e) {
            e.preventDefault();
            const searchValue = document.getElementById("couponSearchInput").value;
            loadCoupons(searchValue, i);
        });
        pagination.appendChild(li);
    }
}
