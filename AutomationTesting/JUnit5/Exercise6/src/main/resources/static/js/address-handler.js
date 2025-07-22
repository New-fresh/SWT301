// Constants
const API_URL = "https://provinces.open-api.vn/api";

// Cache for provinces and districts data
let provincesData = [];
let districtsData = {};

// DOM Elements
const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const shippingSection = document.getElementById("shippingSection");
const orderSummary = document.querySelector(".order-summary");

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadProvinces();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  provinceSelect?.addEventListener("change", handleProvinceChange);
  districtSelect?.addEventListener("change", handleDistrictChange);
}

// Load Provinces Data
async function loadProvinces() {
  try {
    const response = await axios.get(`${API_URL}/p`);
    provincesData = response.data;
    renderProvinces();
  } catch (error) {
    console.error("Error loading provinces:", error);
    showToast("Không thể tải danh sách tỉnh thành", "error");
  }
}

// Load Districts for a Province
async function loadDistricts(provinceCode) {
  if (districtsData[provinceCode]) {
    renderDistricts(districtsData[provinceCode]);
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/p/${provinceCode}?depth=2`);
    districtsData[provinceCode] = response.data.districts;
    renderDistricts(districtsData[provinceCode]);
  } catch (error) {
    console.error("Error loading districts:", error);
    showToast("Không thể tải danh sách quận huyện", "error");
  }
}

// Render Functions
function renderProvinces() {
  if (!provinceSelect) return;

  const options = provincesData.map((province) => `<option value="${province.code}">${province.name}</option>`);

  provinceSelect.innerHTML = `
        <option value="">Chọn tỉnh/thành phố</option>
        ${options.join("")}
    `;
}

function renderDistricts(districts) {
  if (!districtSelect) return;

  const options = districts.map((district) => `<option value="${district.code}">${district.name}</option>`);

  districtSelect.innerHTML = `
        <option value="">Chọn quận/huyện</option>
        ${options.join("")}
    `;

  districtSelect.disabled = false;
}

// Event Handlers
async function handleProvinceChange(event) {
  const provinceCode = event.target.value;
  districtSelect.disabled = true;
  districtSelect.innerHTML = '<option value="">Đang tải...</option>';

  if (provinceCode) {
    await loadDistricts(provinceCode);
  } else {
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    districtSelect.disabled = true;
  }

  updateShippingFee();
}

function handleDistrictChange() {
  updateShippingFee();
}

// Show/Hide Shipping Form
function showShippingForm() {
  orderSummary.style.display = "none";
  shippingSection.style.display = "block";
}

function backToSummary() {
  shippingSection.style.display = "none";
  orderSummary.style.display = "block";
}

// Update shipping fee based on location
function updateShippingFee() {
  const provinceCode = provinceSelect.value;
  const districtCode = districtSelect.value;

  if (!provinceCode || !districtCode) return;

  let baseFee = 30000; // Base shipping fee

  // Adjust fee based on location
  if (provinceCode === "01") {
    // Hà Nội
    baseFee = 20000;
  } else if (provinceCode === "79") {
    // TP.HCM
    baseFee = 20000;
  }

  // Add district surcharge for remote areas
  const district = districtsData[provinceCode]?.find((d) => d.code === districtCode);
  if (district?.name.includes("đảo") || district?.name.includes("Đảo")) {
    baseFee += 50000;
  }

  // Update shipping method prices
  document.querySelector('[for="standard"] .option-price').textContent = `${formatCurrency(baseFee)}`;
  document.querySelector('[for="express"] .option-price').textContent = `${formatCurrency(baseFee * 2)}`;

  // Recalculate total
  calculateTotals();
}

// Format currency (reused from cart-script.js)
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
