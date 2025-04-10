// Note: If you're not using a module bundler, the imports are not needed
// since we're loading jQuery and ApexCharts via script tags in HTML
// import $ from 'jquery';
// import ApexCharts from 'apexcharts';

$(document).ready(function() {
    // Get the PO number from localStorage or URL parameter
    const poNumber = localStorage.getItem('currentPONumber') || getUrlParameter('po');
    
    if (poNumber) {
        $('#po-number-header').text(poNumber);
    }
    
    // Initialize ApexCharts for Quantity Tracking
    initQuantityChart();
    
    // Initialize Leaflet Map
    initMap();
    
    // Initialize sidebar toggle
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Initialize ApexCharts for Quantity Tracking
    function initQuantityChart() {
        const options = {
            series: [28.6, 28.6, 28.6, 14.3],
            chart: {
                type: 'pie',
                height: 200,
                fontFamily: 'Segoe UI, sans-serif',
            },
            labels: ['PRODUCTION', 'TRANSIT', 'GOODS RECEIVED', 'ACTION REQUIRED'],
            colors: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
            legend: {
                show: false
            },
            dataLabels: {
                enabled: true
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        height: 180
                    }
                }
            }],
            tooltip: {
                y: {
                    formatter: function(value) {
                        return value + '%';
                    }
                }
            }
        };

        try {
            const chart = new ApexCharts(document.querySelector("#quantityPieChart"), options);
            chart.render();
        } catch (error) {
            console.error('Error initializing ApexCharts:', error);
        }
    }
});

// Leaflet Map initialization
function initMap() {
    // Center on Dubai, UAE
    const dubai = [25.2048, 55.2708];
    
    // Create map
    const map = L.map('supplier-map').setView(dubai, 6);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);
    
    // Add locations
    const locations = [
        { name: "Dubai", position: [25.2048, 55.2708], isSupplier: true },
        { name: "Doha", position: [25.2854, 51.5310] },
        { name: "Manama", position: [26.2235, 50.5876] },
        { name: "Riyadh", position: [24.7136, 46.6753] }
    ];
    
    // Add markers to the map
    locations.forEach(location => {
        const marker = L.marker(location.position).addTo(map);
        
        if (location.isSupplier) {
            marker.bindPopup(`
                <div style="padding: 5px;">
                    <b>XYZ Corporation</b><br>
                    Dubai, United Arab Emirates
                </div>
            `).openPopup();
            marker._icon.classList.add("supplier-marker"); // For custom styling
        } else {
            marker.bindPopup(location.name);
        }
    });
}