$(document).ready(function() {
    // Mock data and functions (replace with actual data fetching)
    const mockPOs = [
        { id: 1, supplier: 'Supplier A', status: 'production', orderedQuantity: 100, unitPrice: 10, pendingQuantity: 50, shippedQuantity: 0, receivedQuantity: 0 },
        { id: 2, supplier: 'Supplier B', status: 'transit', orderedQuantity: 50, unitPrice: 20, pendingQuantity: 0, shippedQuantity: 50, receivedQuantity: 0 },
        { id: 3, supplier: 'Supplier A', status: 'grn', orderedQuantity: 75, unitPrice: 15, pendingQuantity: 0, shippedQuantity: 75, receivedQuantity: 75 },
        { id: 4, supplier: 'Supplier C', status: 'immediate-action', orderedQuantity: 120, unitPrice: 8, pendingQuantity: 120, shippedQuantity: 0, receivedQuantity: 0 },
        { id: 5, supplier: 'Supplier B', status: 'production', orderedQuantity: 60, unitPrice: 22, pendingQuantity: 30, shippedQuantity: 0, receivedQuantity: 0 },
        { id: 6, supplier: 'Supplier C', status: 'transit', orderedQuantity: 90, unitPrice: 9, pendingQuantity: 0, shippedQuantity: 90, receivedQuantity: 0 },
        { id: 7, supplier: 'Supplier A', status: 'grn', orderedQuantity: 110, unitPrice: 11, pendingQuantity: 0, shippedQuantity: 110, receivedQuantity: 110 },
        { id: 8, supplier: 'Supplier B', status: 'immediate-action', orderedQuantity: 40, unitPrice: 25, pendingQuantity: 40, shippedQuantity: 0, receivedQuantity: 0 },
        { id: 9, supplier: 'Supplier C', status: 'production', orderedQuantity: 80, unitPrice: 12, pendingQuantity: 60, shippedQuantity: 0, receivedQuantity: 0 },
        { id: 10, supplier: 'Supplier A', status: 'transit', orderedQuantity: 130, unitPrice: 7, pendingQuantity: 0, shippedQuantity: 130, receivedQuantity: 0 }
    ];

    function getUniqueSuppliers() {
        const suppliers = [...new Set(mockPOs.map(po => po.supplier))];
        return suppliers.map(supplier => ({ name: supplier }));
    }

    function getPOsBySupplier(supplier) {
        return mockPOs.filter(po => po.supplier === supplier);
    }
    // Initialize charts
    initializeDashboard();
    
    // Handle time range change
    $('#time-range').on('change', function() {
        updateDashboard();
    });
    
    // Handle supplier filter change
    $('#supplier-filter').on('change', function() {
        updateDashboard();
    });
    
    function initializeDashboard() {
        // Populate supplier filter
        populateSupplierFilter();
        
        // Initialize dashboard data
        updateDashboard();
    }
    
    function populateSupplierFilter() {
        const suppliers = getUniqueSuppliers();
        const supplierFilter = $('#supplier-filter');
        
        suppliers.forEach(supplier => {
            supplierFilter.append(`<option value="${supplier.name}">${supplier.name}</option>`);
        });
    }
    
    function updateDashboard() {
        const timeRange = $('#time-range').val();
        const supplierFilter = $('#supplier-filter').val();
        
        // Filter POs based on supplier
        let filteredPOs = mockPOs;
        if (supplierFilter !== 'all') {
            filteredPOs = getPOsBySupplier(supplierFilter);
        }
        
        // Calculate statistics
        updateStatistics(filteredPOs);
        
        // Update charts
        updateStatusChart(filteredPOs);
        updateSupplierChart(filteredPOs);
        updateMonthlyTrendChart(timeRange);
    }
    
    function updateStatistics(pos) {
        const totalPOs = pos.length;
        const immediatePOs = pos.filter(po => po.status === 'immediate-action').length;
        const productionPOs = pos.filter(po => po.status === 'production' || po.pendingQuantity > 0).length;
        const transitPOs = pos.filter(po => po.status === 'transit' || po.shippedQuantity > 0).length;
        const grnPOs = pos.filter(po => po.status === 'grn' || po.receivedQuantity > 0).length;
        
        // Calculate total value
        const totalValue = pos.reduce((sum, po) => sum + po.orderedQuantity * po.unitPrice, 0);
        
        // Update statistics cards
        $('#total-pos').text(totalPOs);
        $('#total-value').text('$' + totalValue.toFixed(2));
        $('#pending-delivery').text(productionPOs + transitPOs);
        $('#completed-pos').text(grnPOs);
    }
    
    function updateStatusChart(pos) {
        const immediatePOs = pos.filter(po => po.status === 'immediate-action').length;
        const productionPOs = pos.filter(po => po.status === 'production' || po.pendingQuantity > 0).length;
        const transitPOs = pos.filter(po => po.status === 'transit' || po.shippedQuantity > 0).length;
        const grnPOs = pos.filter(po => po.status === 'grn' || po.receivedQuantity > 0).length;
        
        // Clear previous chart
        $('#status-chart').empty();
        
        // Create new chart
        const ctx = $('<canvas></canvas>').appendTo('#status-chart')[0].getContext('2d');
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Immediate Action', 'Production', 'Transit', 'GRN'],
                datasets: [{
                    data: [immediatePOs, productionPOs, transitPOs, grnPOs],
                    backgroundColor: ['#dc3545', '#0d6efd', '#ffc107', '#198754'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateSupplierChart(pos) {
        // Group POs by supplier
        const supplierCounts = {};
        pos.forEach(po => {
            if (!supplierCounts[po.supplier]) {
                supplierCounts[po.supplier] = 0;
            }
            supplierCounts[po.supplier]++;
        });
        
        // Convert to arrays for chart
        const suppliers = Object.keys(supplierCounts);
        const counts = Object.values(supplierCounts);
        
        // Clear previous chart
        $('#supplier-chart').empty();
        
        // Create new chart
        const ctx = $('<canvas></canvas>').appendTo('#supplier-chart')[0].getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: suppliers,
                datasets: [{
                    label: 'Number of POs',
                    data: counts,
                    backgroundColor: '#0d6efd',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    function updateMonthlyTrendChart(timeRange) {
        // Generate monthly data (simulated)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const productionData = [4, 3, 5, 6, 4, 3];
        const transitData = [2, 3, 2, 4, 5, 6];
        const grnData = [1, 2, 3, 2, 3, 4];
        
        // Adjust data based on time range
        let labels = months;
        let production = productionData;
        let transit = transitData;
        let grn = grnData;
        
        if (timeRange === 'week') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            production = [2, 3, 4, 3, 5, 2, 1];
            transit = [1, 2, 2, 3, 2, 1, 0];
            grn = [0, 1, 1, 2, 1, 1, 0];
        } else if (timeRange === 'quarter') {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
            production = [4, 3, 5, 6, 4, 3, 5, 7, 6];
            transit = [2, 3, 2, 4, 5, 6, 4, 3, 5];
            grn = [1, 2, 3, 2, 3, 4, 3, 2, 4];
        } else if (timeRange === 'year') {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            production = [4, 3, 5, 6, 4, 3, 5, 7, 6, 8, 7, 5];
            transit = [2, 3, 2, 4, 5, 6, 4, 3, 5, 6, 4, 3];
            grn = [1, 2, 3, 2, 3, 4, 3, 2, 4, 5, 3, 2];
        }
        
        // Clear previous chart
        $('#monthly-trend-chart').empty();
        
        // Create new chart
        const ctx = $('<canvas></canvas>').appendTo('#monthly-trend-chart')[0].getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Production',
                        data: production,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Transit',
                        data: transit,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'GRN',
                        data: grn,
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.1)',
                        tension: 0.1,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
});