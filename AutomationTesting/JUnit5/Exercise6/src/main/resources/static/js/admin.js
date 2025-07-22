const sidebarItems = document.querySelectorAll('.sidebar ul li');
const sections = document.querySelectorAll('.main-content section');
let activeSectionIndex = 0;
let originalAllBooks = [];
let allBooks = [];
let originalAllOrders = [];
let allOrders = [];
let orderStatuses = [];
const itemsPerPage = 10;
let currentBookPage = 1;
let currentOrderPage = 1;
let chartInstance = null;

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function updateDashboard() {
  const timeType = document.getElementById('timeTypeSelect').value;
  fetchDashboardData({timeType});
}

document.addEventListener('DOMContentLoaded', () => {
  sections.forEach(section => section.style.display = 'none');
  const overviewSection = document.getElementById('overview-section');
  if (overviewSection) {
    overviewSection.style.display = 'flex';
    sidebarItems[0].classList.add('active');
  }
  fetchBooks();
  fetchOrders();
  updateDashboard();
});

sidebarItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    const sectionId = item.getAttribute('data-section');
    const currentSection = document.getElementById(sectionId);
    if (activeSectionIndex === index && currentSection.style.display !== 'none') {
      return; // Không làm gì nếu section đã hiển thị
    }
    // Ẩn tất cả section và xóa class active
    sidebarItems.forEach(li => li.classList.remove('active'));
    sections.forEach(section => section.style.display = 'none');
    // Hiển thị section được chọn
    if (currentSection) {
      currentSection.style.display = sectionId === 'overview-section' ? 'flex' : 'block'; // Dùng 'flex' cho overview, 'block' cho các section khác
      item.classList.add('active');
      if (sectionId === 'manage-books-section') {
        fetchBooks();
      } else if (sectionId === 'manage-orders-section') {
        fetchOrders();
      }
    }
    activeSectionIndex = index;
  });
});

function fetchDashboardData({timeType}) {
  showLoading();
  const url = `/admin/users/multi-chart-data?timeType=${timeType || '1month'}`;

  fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load chart data');
        return response.json();
      })
      .then(data => {
        // Update summary cards
        const dashboardUrl = `/admin/users/dashboard-data?timeType=${timeType || '1month'}`;
        fetch(dashboardUrl)
            .then(response => response.json())
            .then(dashboardData => {
              document.getElementById('revenue').textContent = dashboardData.revenue ? `${dashboardData.revenue.toFixed(2)}₫` : '0₫';
              document.getElementById('orders').textContent = dashboardData.orders || 0;
              document.getElementById('top-book').textContent = dashboardData.topBook || 'N/A';
              document.getElementById('users').textContent = dashboardData.users || 0;
            })
            .catch(error => {
              console.error('Error loading summary data:', error);
              document.getElementById('overview-section').insertAdjacentHTML('beforeend', '<p class="error">Error loading summary data</p>');
            });

        // Destroy old chart to prevent memory leaks
        if (chartInstance) {
          chartInstance.destroy();
        }

        const ctx = document.getElementById('Chart').getContext('2d');
        const labelMap = {
          '1day': 'Last Day',
          '1week': 'Last Week',
          '1month': 'Last Month',
          '3months': 'Last 3 Months',
          '7months': 'Last 7 Months',
          'lastyear': 'Last Year'
        };
        const labels = [...new Set([
          // ...data.revenue.map(item => item.x),
          ...data.orders.map(item => item.x),
          ...data.users.map(item => item.x)
        ])].sort();

        const datasets = [
          // {
          //   label: 'Revenue',
          //   data: labels.map(label => {
          //     const item = data.revenue.find(d => d.x === label);
          //     return item ? item.y : 0;
          //   }),
          //   borderColor: '#2c3e50',
          //   backgroundColor: 'rgba(44, 62, 80, 0.2)',
          //   fill: false,
          //   tension: 0.4
          // },
          {
            label: 'Orders',
            data: labels.map(label => {
              const item = data.orders.find(d => d.x === label);
              return item ? item.y : 0;
            }),
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'New Users',
            data: labels.map(label => {
              const item = data.users.find(d => d.x === label);
              return item ? item.y : 0;
            }),
            borderColor: '#ff9f43',
            backgroundColor: 'rgba(255, 159, 67, 0.2)',
            fill: false,
            tension: 0.4
          }
        ];

        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets
          },
          options: {
            responsive: true,
            plugins: {
              legend: {position: 'top'},
              title: {display: true, text: `Statistics - ${labelMap[timeType]}`}
            },
            scales: {
              y: {beginAtZero: true}
            }
          }
        });
        hideLoading();
      })
      .catch(error => {
        console.error('Error loading chart data:', error);
        document.getElementById('Chart').insertAdjacentHTML('afterend', '<p class="error">Error loading chart</p>');
        hideLoading();
      });
}

function fetchBooks() {
  showLoading();
  const timeType = document.getElementById('timeTypeSelect').value;
  fetch(`/api/products?timeType=${timeType}`)
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        originalAllBooks = data.filter(book => book.status === 1);
        allBooks = [...originalAllBooks];
        applyBookFiltersAndSort();
        renderBookPagination();
        hideLoading();
      })
      .catch(error => {
        console.error('Error loading books:', error);
        document.getElementById('book-table-body').insertAdjacentHTML('beforeend', '<tr><td colspan="7">Error loading books</td></tr>');
        hideLoading();
      });
}

function renderBookTable() {
  const tableBody = document.getElementById('book-table-body');
  tableBody.innerHTML = '';
  const startIndex = (currentBookPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = allBooks.slice(startIndex, endIndex);
  paginatedBooks.forEach(book => {
    const discountedPrice = book.price * ((100 - book.discount) / 100);
    const row = `
            <tr>
                <td><img src="${book.imageFile}" alt="${book.productName} Cover" class="product-image"/></td>
                <td>${book.productName}</td>
                <td>${book.author}</td>
                <td>$${discountedPrice.toFixed(2)}</td>
                <td>${book.discount}%</td>
                <td>${book.updatedDate ? new Date(book.updatedDate).toISOString().split('T')[0] : 'N/A'}</td>
                <td>
                    <a href="/admin/edit-book/${book.productId}" class="btn btn-sm btn-primary">Edit</a>
                    <button class="btn btn-sm btn-danger delete-btn" data-product-id="${book.productId}">Delete</button>
                </td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');
      if (confirm('Are you sure you want to delete this book?')) {
        softDeleteBook(productId);
      }
    });
  });
}

function softDeleteBook(productId) {
  fetch(`/api/products/${productId}/soft-delete`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({status: 0})
  })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete book');
        return fetchBooks();
      })
      .then(() => alert('Book deleted successfully!'))
      .catch(error => {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Check console for details.');
      });
}

function applyBookFiltersAndSort() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const sortOption = document.getElementById('sortSelect').value;
  allBooks = [...originalAllBooks];
  if (searchTerm) {
    allBooks = allBooks.filter(book =>
        book.productName.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
  }
  allBooks.sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.productName.localeCompare(b.productName);
      case 'name-desc':
        return b.productName.localeCompare(a.productName);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });
}

function renderBookPagination() {
  const totalPages = Math.ceil(allBooks.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentBookPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentBookPage > 1) {
      currentBookPage--;
      renderBookTable();
      renderBookPagination();
    }
  });
  pagination.appendChild(prevButton);
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.disabled = i === currentBookPage;
    pageButton.addEventListener('click', () => {
      currentBookPage = i;
      renderBookTable();
      renderBookPagination();
    });
    pagination.appendChild(pageButton);
  }
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentBookPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentBookPage < totalPages) {
      currentBookPage++;
      renderBookTable();
      renderBookPagination();
    }
  });
  pagination.appendChild(nextButton);
  renderBookTable();
}

function fetchOrders() {
  showLoading();
  const timeType = document.getElementById('timeTypeSelect').value;
  Promise.all([
    fetch(`/api/orders?timeType=${timeType}`),
    fetch('/api/order-statuses')
  ])
      .then(([ordersResponse, statusesResponse]) => {
        if (!ordersResponse.ok) throw new Error('Failed to load orders');
        if (!statusesResponse.ok) throw new Error('Failed to load statuses');
        return Promise.all([ordersResponse.json(), statusesResponse.json()]);
      })
      .then(([orders, statuses]) => {
        originalAllOrders = orders;
        orderStatuses = statuses;
        allOrders = [...originalAllOrders];
        applyOrderFiltersAndSort();
        renderOrderPagination();
        hideLoading();
      })
      .catch(error => {
        console.error('Error loading orders or statuses:', error);
        document.getElementById('order-table-body').insertAdjacentHTML('beforeend', '<tr><td colspan="7">Error loading orders</td></tr>');
        hideLoading();
      });
}

function renderOrderTable() {
  const tableBody = document.getElementById('order-table-body');
  tableBody.innerHTML = '';
  const startIndex = (currentOrderPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = allOrders.slice(startIndex, endIndex);
  paginatedOrders.forEach(order => {
    const status = orderStatuses.find(s => s.orderStatusId === order.orderStatusId)?.statusName || 'Unknown';
    const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
    const row = `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.userId}</td>
                <td>${(() => {
      const date = new Date(order.createDate);
      return date.toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'}).slice(0, 19).replace('T', ' ');
    })()}</td>
                <td>${order.complete ? 'Yes' : 'No'}</td>
                <td>${order.couponId || 'N/A'}</td>
                <td>
                    <select class="status-select ${statusClass}" id="status-${order.orderId}" onchange="updateStatusColor(this, ${order.orderId})">
                        ${orderStatuses.map(s => `
                            <option value="${s.orderStatusId}" ${s.orderStatusId === order.orderStatusId ? 'selected' : ''}>
                                ${s.statusName}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td>
                    <button class="btn-update" onclick="updateStatus(${order.orderId})">Update</button>
                    <button class="btn-details" onclick="showDetails(${order.orderId})">Details</button>
                </td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
}

function updateStatusColor(selectElement, orderId) {
  const selectedStatusId = parseInt(selectElement.value);
  const status = orderStatuses.find(s => s.orderStatusId === selectedStatusId)?.statusName || 'Unknown';
  const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  selectElement.classList.remove('status-pending', 'status-processing', 'status-delivered', 'status-cancelled');
  selectElement.classList.add(statusClass);
}

function applyOrderFiltersAndSort() {
  const searchTerm = document.getElementById('orderSearchInput').value.toLowerCase();
  const sortOption = document.getElementById('orderSortSelect').value;
  allOrders = [...originalAllOrders];
  if (searchTerm) {
    allOrders = allOrders.filter(order => {
      const status = orderStatuses.find(s => s.orderStatusId === order.orderStatusId)?.statusName || '';
      return (
          order.orderId.toString().includes(searchTerm) ||
          order.userId.toString().includes(searchTerm) ||
          status.toLowerCase().includes(searchTerm)
      );
    });
  }
  allOrders.sort((a, b) => {
    switch (sortOption) {
      case 'id-asc':
        return a.orderId - b.orderId;
      case 'id-desc':
        return b.orderId - a.orderId;
      case 'date-asc':
        return new Date(a.createDate) - new Date(b.createDate);
      case 'date-desc':
        return new Date(b.createDate) - new Date(a.createDate);
      case 'status-asc':
        const statusA = orderStatuses.find(s => s.orderStatusId === a.orderStatusId)?.statusName || '';
        const statusB = orderStatuses.find(s => s.orderStatusId === b.orderStatusId)?.statusName || '';
        return statusA.localeCompare(statusB);
      case 'status-desc':
        const statusB2 = orderStatuses.find(s => s.orderStatusId === b.orderStatusId)?.statusName || '';
        const statusA2 = orderStatuses.find(s => s.orderStatusId === a.orderStatusId)?.statusName || '';
        return statusB2.localeCompare(statusA2);
      default:
        return 0;
    }
  });
}

function renderOrderPagination() {
  const totalPages = Math.ceil(allOrders.length / itemsPerPage);
  const pagination = document.getElementById('order-pagination');
  pagination.innerHTML = '';
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentOrderPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentOrderPage > 1) {
      currentOrderPage--;
      renderOrderTable();
      renderOrderPagination();
    }
  });
  pagination.appendChild(prevButton);
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.disabled = i === currentOrderPage;
    pageButton.addEventListener('click', () => {
      currentOrderPage = i;
      renderOrderTable();
      renderOrderPagination();
    });
    pagination.appendChild(pageButton);
  }
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentOrderPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentOrderPage < totalPages) {
      currentOrderPage++;
      renderOrderTable();
      renderOrderPagination();
    }
  });
  pagination.appendChild(nextButton);
  renderOrderTable();
}

function updateStatus(orderId) {
  const newStatusId = document.getElementById(`status-${orderId}`).value;
  fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({orderStatusId: parseInt(newStatusId)})
  })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update status');
        alert('Status updated successfully!');
        fetchOrders();
      })
      .catch(error => {
        console.error('Error updating status:', error);
        alert('Failed to update status. Check console for details.');
      });
}

async function showDetails(orderId) {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) throw new Error(`Failed to load order details: ${response.statusText}`);
    const order = await response.json();
    const details = order.orderDetails || [];
    const tbody = document.getElementById('orderDetailsBody');
    tbody.innerHTML = '';

    let totalAmount = 0;
    let totalQuantity = 0;
    for (const detail of details) {
      if (detail.price !== undefined && detail.quantity !== undefined) {
        totalAmount += detail.price * detail.quantity;
        totalQuantity += detail.quantity;
      }
    }

    if (details.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9">No details available</td></tr>';
    } else {
      for (const detail of details) {
        let product = {
          productName: 'N/A',
          imageFile: '',
          userId: 'N/A',
          rating: 'N/A',
          author: 'N/A',
          discount: 'N/A'
        };
        try {
          const productResponse = await fetch(`/api/products/${detail.productId}`);
          if (productResponse.ok) {
            product = await productResponse.json();
          } else {
            console.warn(`Product with id ${detail.productId} not found, status: ${productResponse.status}`);
          }
        } catch (productError) {
          console.error(`Error loading product with id ${detail.productId}:`, productError);
        }
        const row = `
                    <tr>
                        <td>${detail.orderDetailId !== undefined ? detail.orderDetailId : 'N/A'}</td>
                        <td><img src="${product.imageFile || ''}" alt="Product Image" class="product-image"></td>
                        <td>${product.productName}</td>
                        <td>${detail.price !== undefined ? '$' + (detail.price * ((100 - product.discount) / 100)).toFixed(2) : 'N/A'}</td>
                        <td>${detail.quantity}</td>
                        <td>${product.userId}</td>
                        <td>${product.rating}</td>
                        <td>${product.author}</td>
                        <td>${product.discount !== undefined ? product.discount + '%' : 'N/A'}</td>
                    </tr>
                `;
        tbody.insertAdjacentHTML('beforeend', row);
      }
    }

    document.getElementById('orderTotal').textContent = `$${totalAmount.toFixed(2)}`;
    document.getElementById('orderQuantity').textContent = totalQuantity;

    const modalElement = document.getElementById('orderDetailsModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } catch (error) {
    console.error('Error loading order details:', error);
    const tbody = document.getElementById('orderDetailsBody');
    tbody.innerHTML = '<tr><td colspan="9">Error loading details: ' + error.message + '</td></tr>';
    document.getElementById('orderTotal').textContent = '$0.00';
    document.getElementById('orderQuantity').textContent = '0';
    new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
  }
}

document.getElementById('searchInput').addEventListener('input', () => {
  applyBookFiltersAndSort();
  currentBookPage = 1;
  renderBookPagination();
});

document.getElementById('sortSelect').addEventListener('change', () => {
  applyBookFiltersAndSort();
  currentBookPage = 1;
  renderBookPagination();
});

document.getElementById('orderSearchInput').addEventListener('input', () => {
  applyOrderFiltersAndSort();
  currentOrderPage = 1;
  renderOrderPagination();
});

document.getElementById('orderSortSelect').addEventListener('change', () => {
  applyOrderFiltersAndSort();
  currentOrderPage = 1;
  renderOrderPagination();
});

document.getElementById('timeTypeSelect').addEventListener('change', updateDashboard);


  function exportTableToCSV() {
  const sections = document.querySelectorAll('.main-content section');
  if (sections.length === 0) {
  alert('No sections found to export.');
  return;
}

  const baseFileName = 'Admin_Data.xlsx';
  let downloadedFiles = JSON.parse(localStorage.getItem('downloadedFiles') || '{}');
  let sheetCounter = downloadedFiles[baseFileName]?.sheetCount || 0;

  const wb = XLSX.utils.book_new();
  let newSheetCounter = sheetCounter;

  sections.forEach((section) => {
  const tables = section.querySelectorAll('.dataTable');
  tables.forEach((table, index) => {
  // Ưu tiên lấy tiêu đề từ h2 hoặc h3
  let sectionTitle = section.querySelector('h2')?.innerText
  || section.querySelector('h3')?.innerText
  || `Sheet_${index + 1}`;

  // Tên sheet: loại bỏ ký tự đặc biệt và rút gọn tối đa 28 ký tự
  let sheetNameBase = sectionTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 28);
  let sheetName = (sheetCounter === 0)
  ? sheetNameBase
  : `${sheetNameBase}_${newSheetCounter + 1}`;

  // Cắt ngắn nếu vượt quá 31 ký tự (phòng trường hợp vẫn lỗi)
  if (sheetName.length > 31) {
  sheetName = sheetName.substring(0, 31);
}

  const data = extractTableData(table);
  if (data.length > 0) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  newSheetCounter++;
}
});
});

  if (newSheetCounter === sheetCounter) {
  alert('No tables found to export.');
  return;
}

  downloadedFiles[baseFileName] = {sheetCount: newSheetCounter};
  localStorage.setItem('downloadedFiles', JSON.stringify(downloadedFiles));

  XLSX.writeFile(wb, baseFileName);
}

  function extractTableData(table) {
  const data = [];
  const rows = table.querySelectorAll('tr');

  for (let i = 0; i < rows.length; i++) {
  const row = [];
  const cols = rows[i].querySelectorAll('td, th');

  for (let j = 0; j < cols.length; j++) {
  // Bỏ qua cột chứa nút hoặc select
  if (cols[j].querySelector('.btn') || cols[j].querySelector('.status-select')) {
  continue;
}

  let cellData = '';
  const img = cols[j].querySelector('img');
  if (img) {
  cellData = img.getAttribute('src') || '';
} else {
  cellData = cols[j].innerText.replace(/"/g, '""');
}

  row.push(cellData);
}

  if (row.length > 0) {
  data.push(row);
}
}
  return data;
}

async function processExcel() {
  const fileInput = document.getElementById('excelFile');
  const outputDiv = document.getElementById('output');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select an Excel file');
    outputDiv.textContent = 'No file selected';
    return;
  }

  try {
    // Read Excel file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, {type: 'array'});

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON with header row as keys
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Clean and format JSON data
    const formattedData = jsonData.map(row => ({
      BookName: row['Book Name'] || '',
      Author: row['Author'] || '',
      Publisher: row['Publisher'] || '',
      Price: row['Price'] || null,
      Discount: row['Discount'] || null,
      AvailableQuantity: row['Available (Quantity)'] || null,
      Tags: row['Tags'] || '',
      Description: row['Description'] || '',
      ImageFile: row['Image File'] || '',
      userID: userInSession.userId
    }));

    // Display JSON output for testing
    console.log('Generated JSON:', formattedData);
    outputDiv.textContent = JSON.stringify(formattedData, null, 2);

    // Send JSON to backend
    const response = await fetch('http://localhost:8080/admin/users/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData)
    });

    if (response.ok) {
      alert('Data sent successfully!');
    } else {
      alert('Error sending data to server');
    }

  } catch (error) {
    console.error('Error:', error);
    outputDiv.textContent = 'Error processing file: ' + error.message;
    alert('Error processing file');
  }
}
