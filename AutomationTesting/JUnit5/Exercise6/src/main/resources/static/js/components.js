

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize all dropdowns
    var dropdowns = document.querySelectorAll(".dropdown-toggle");
    dropdowns.forEach((dropdown) => {
        new bootstrap.Dropdown(dropdown);
    });

    // Initialize all tooltips
    var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((tooltip) => {
        new bootstrap.Tooltip(tooltip);
    });

    // Initialize all popovers
    var popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach((popover) => {
        new bootstrap.Popover(popover);
    });
}

// Handle category menu interactions
document.addEventListener("click", function (e) {
    if (e.target.matches(".category-item")) {
        e.preventDefault();
        const category = e.target.dataset.category;
        filterBooksByCategory(category);
    }
});

// Filter books by category
function filterBooksByCategory(category) {
    // Add your filtering logic here
    console.log("Filtering by category:", category);
    // You can implement the actual filtering based on your needs
}