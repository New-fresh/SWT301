document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle
    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute("data-section");
            showSection(sectionId);
        });
    });

    // Mặc định hiển thị Customer khi vào Manage Users
    if (document.getElementById("manage-users-section")) {
        loadCustomers();
    }

    if (document.getElementById("manage-staffs-section")) {
        loadStaff();
    }

    // Modal handling (Create Staff)
    const modal = document.getElementById("staff-modal");
    const openBtn = document.getElementById("create-staff-btn");
    const closeBtn = document.getElementById("close-staff-modal");

    openBtn.addEventListener("click", () => modal.style.display = "block");
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Submit Create Staff
    const form = document.getElementById("staff-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.roleID = parseInt(data.roleID);

        try {
            const res = await fetch("/admin/users/create-staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error(await res.text());

            alert("Staff created successfully!");
            modal.style.display = "none";
            form.reset();
            loadStaff();
        } catch (err) {
            alert("Error: " + err.message);
        }
    });
});

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "manage-users-section") {
        loadCustomers();
    }

    if (sectionId === "manage-staffs-section") {
        loadStaff();
    }
}

// Load Customers
async function loadCustomers() {
    const tbody = document.getElementById("customer-body");
    tbody.innerHTML = "";

    try {
        const res = await fetch("/admin/users/customers");
        const customers = await res.json();

        customers.forEach((user, index) => {
            tbody.appendChild(createCustomerRow(user, index + 1));
        });
    } catch (err) {
        console.error("Failed to load customers:", err);
    }
}

// Load Staff
async function loadStaff() {
    const tbody = document.getElementById("staff-body");
    tbody.innerHTML = "";

    try {
        const res = await fetch("/admin/users/staff");
        const staff = await res.json();

        staff.forEach((user, index) => {
            tbody.appendChild(createStaffRow(user, index + 1));
        });
    } catch (err) {
        console.error("Failed to load staff:", err);
    }
}

function createCustomerRow(user, index) {
    const tr = document.createElement("tr");
    const isActive = user.status === true;

    tr.innerHTML = `
        <td>${index}</td>
        <td>${user.userName}</td>
        <td>${user.email}</td>
        <td>${user.phoneNumber || "N/A"}</td>
        <td>${user.address || "N/A"}</td>
        <td>${formatDate(user.createAt)}</td>
        <td>
            <button class="btn btn-sm ${isActive ? 'btn-danger' : 'btn-warning'}" style="min-width:70px"
                onclick="toggleStatus(${user.userId}, ${user.status})">
                ${isActive ? 'Ban' : 'Unban'}
            </button>
        </td>
    `;
    return tr;
}

function createStaffRow(user, index) {
    const tr = document.createElement("tr");
    const isActive = user.status === true;

    tr.innerHTML = `
        <td>${index}</td>
        <td>${user.userName}</td>
        <td>${user.email}</td>
        <td>${user.phoneNumber || "N/A"}</td>
        <td>${user.roleName}</td>
        <td>${formatDate(user.createAt)}</td>
        <td>
            <button class="btn btn-sm btn-secondary" style="min-width:70px"
                onclick="openEditRolePopup(${user.userId}, '${user.roleName}')">
                Edit Role
            </button>
            <button class="btn btn-sm ${isActive ? 'btn-danger' : 'btn-warning'}" style="min-width:70px"
                onclick="toggleStatus(${user.userId}, ${user.status})">
                ${isActive ? 'Ban' : 'Unban'}
            </button>
        </td>
    `;
    return tr;
}

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d) ? "N/A" : d.toISOString().split("T")[0];
}

async function toggleStatus(userId, currentStatus) {
    const isActive = currentStatus === true;
    if (!confirm(isActive ? "Ban this user?" : "Unban this user?")) return;

    const endpoint = `/admin/users/${userId}/${isActive ? "ban" : "unban"}`;

    try {
        const res = await fetch(endpoint, { method: "POST" });
        if (!res.ok) throw new Error(await res.text());

        const currentSection = document.querySelector("section:not([style*='display: none'])").id;
        if (currentSection === "manage-users-section") loadCustomers();
        else if (currentSection === "manage-staffs-section") loadStaff();
    } catch (err) {
        alert("Error: " + err.message);
    }
}

// ===================== EDIT ROLE =========================

let currentEditUserId = null;

function openEditRolePopup(userId, currentRoleName) {
    currentEditUserId = userId;

    const roleSelect = document.getElementById("role-select");
    if (currentRoleName === "Warehouse Management") roleSelect.value = 3;
    else if (currentRoleName === "Customer Care") roleSelect.value = 4;
    else if (currentRoleName === "Shipper") roleSelect.value = 5;

    document.getElementById("edit-role-modal").style.display = "block";
}

document.getElementById("save-role-btn").addEventListener("click", async () => {
    const roleId = parseInt(document.getElementById("role-select").value);

    try {
        const res = await fetch(`/admin/users/${currentEditUserId}/role?roleId=${roleId}`, {
            method: "PUT"
        });

        if (!res.ok) throw new Error(await res.text());

        alert("Role updated successfully!");
        document.getElementById("edit-role-modal").style.display = "none";
        loadStaff();
    } catch (err) {
        alert("Error: " + err.message);
    }
});

document.getElementById("cancel-role-btn").addEventListener("click", () => {
    document.getElementById("edit-role-modal").style.display = "none";
});