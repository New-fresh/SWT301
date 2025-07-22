document.addEventListener('DOMContentLoaded', function () {
    loadTopSales();
    loadBooksByTag();
});

//Top sale
function loadTopSales() {
    fetch('/api/product/top-sale')
        .then(response => response.json())
        .then(data => renderTopSales(data))
        .catch(error => console.error('Error loading top sale:', error));
}

function renderTopSales(products) {
    const container = document.getElementById('top-sale-content');
    if (!products || products.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No top sale products.</p>`;
        return;
    }

    let html = '<div class="row g-4">';
    products.filter(e => e.status !== 0).forEach((product, index) => {
        const imageSrc = product.imageFile.startsWith('http') ? product.imageFile : `/images/${product.imageFile}`;

        let badge = '';
        if (index === 0) badge = `<div class="top-badge">Top 1</div>`;
        else if (index === 1) badge = `<div class="top-badge">Top 2</div>`;
        else if (index === 2) badge = `<div class="top-badge">Top 3</div>`;

        html += `
            <div class="col-lg-3 col-md-6 position-relative">
                ${badge}
                <div class="book-card bg-white rounded shadow-sm">
                    <img src="${imageSrc}" class="card-img-top" alt="Book Cover"/>
                    <div class="card-body d-flex flex-column justify-content-between" style="height: 180px;">
                        <p class="text-primary mb-1">Book</p>
                        <h5 class="card-title">${product.productName}</h5>
                        <p class="card-text text-muted">${truncateText(product.description, 100)}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 mb-0">${product.price.toLocaleString()}₫</span>
                            <a href="/product/${product.productId}" class="btn btn-outline-primary btn-sm">View</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

//Combo
function loadBooksByTag() {
    fetch("/api/product/list-by-tag")
        .then(response => response.json())
        .then(data => {
            const comboContainer = document.getElementById("tag-combo-content");
            comboContainer.innerHTML = '';

            Object.entries(data).forEach(([tag, products]) => {
                let html = `
                    <div class="mb-5">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4>${tag}</h4>
                            <a href="/category/${encodeURIComponent(tag)}" class="btn btn-sm btn-outline-primary">See all</a>
                        </div>
                        <div class="row g-4">
                `;

                products.forEach(p => {
                    const imageSrc = p.imageFile.startsWith('http') ? p.imageFile : `/images/${p.imageFile}`;
                    html += `
                        <div class="col-lg-3 col-md-4 col-sm-6">
                            <div class="book-card bg-white rounded shadow-sm h-100">
                                <img src="${imageSrc}" class="card-img-top" alt="${p.productName}" style="height: 200px; object-fit: cover;">
                                <div class="card-body p-2">
                                    <h6 class="card-title">${p.productName}</h6>
                                    <p class="card-text text-muted">${truncateText(p.description, 80)}</p>
                                    <p class="card-text text-primary fw-bold">${p.price.toLocaleString()}₫</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += '</div></div>';
                comboContainer.innerHTML += html;
            });
        })
        .catch(err => console.error("Error loading books by tag:", err));
}
