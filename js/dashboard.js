$(document).ready(function() {
    // Mock data for POs (replace with actual data fetching)
    const mockPOs = [
        { poNumber: 'PO-2024-001', supplier: 'ABC Corp', location: 'New York', dueDate: '2024-03-15', status: 'immediate-action', statusText: 'Immediate Action', orderedQuantity: 100, unit: 'pcs', unitPrice: 10.50, currency: 'USD', shippedQuantity: 50, receivedQuantity: 0, pendingQuantity: 50, compCode: 'CC123', poTxn: 'TXN001', saTxn: 'SA001', piNo: 'PI001', deliveryTerm: 'FOB', remarks: 'Urgent', description: 'Widgets', poDate: '2024-02-01' },
        { poNumber: 'PO-2024-002', supplier: 'XYZ Ltd', location: 'London', dueDate: '2024-03-22', status: 'production', statusText: 'In Production', orderedQuantity: 200, unit: 'kg', unitPrice: 5.25, currency: 'EUR', shippedQuantity: 0, receivedQuantity: 0, pendingQuantity: 200, compCode: 'CC456', poTxn: 'TXN002', saTxn: 'SA002', piNo: 'PI002', deliveryTerm: 'CIF', remarks: 'Standard', description: 'Gears', poDate: '2024-02-08' },
        { poNumber: 'PO-2024-003', supplier: 'PQR Inc', location: 'Tokyo', dueDate: '2024-03-29', status: 'transit', statusText: 'In Transit', orderedQuantity: 150, unit: 'm', unitPrice: 7.80, currency: 'JPY', shippedQuantity: 150, receivedQuantity: 100, pendingQuantity: 50, compCode: 'CC789', poTxn: 'TXN003', saTxn: 'SA003', piNo: 'PI003', deliveryTerm: 'DDP', remarks: 'Delayed', description: 'Cables', poDate: '2024-02-15' },
        { poNumber: 'PO-2024-004', supplier: 'LMN Co', location: 'Sydney', dueDate: '2024-04-05', status: 'grn', statusText: 'Goods Received', orderedQuantity: 120, unit: 'l', unitPrice: 3.50, currency: 'AUD', shippedQuantity: 120, receivedQuantity: 120, pendingQuantity: 0, compCode: 'CC012', poTxn: 'TXN004', saTxn: 'SA004', piNo: 'PI004', deliveryTerm: 'EXW', remarks: 'Complete', description: 'Liquids', poDate: '2024-02-22' },
        { poNumber: 'S011739', supplier: 'XYZ Corporation', location: 'Dubai', dueDate: '2024-03-25', status: 'grn', statusText: 'Goods Received', orderedQuantity: 500, unit: 'pcs', unitPrice: 8.99, currency: 'USD', shippedQuantity: 500, receivedQuantity: 469, pendingQuantity: 31, compCode: '733LLC', poTxn: 'IPOCT', saTxn: '0', piNo: 'PI007', deliveryTerm: 'FOB-FREE ON BOARD', remarks: 'Almost complete', description: 'Electronic components', poDate: '2024-02-10' }
    ];

    // Function to simulate searching POs
    function searchPOs(query) {
        query = query.toLowerCase();
        return mockPOs.filter(po =>
            po.poNumber.toLowerCase().includes(query) ||
            po.supplier.toLowerCase().includes(query) ||
            po.location.toLowerCase().includes(query)
        );
    }

    // Function to get a PO by its number
    function getPOByNumber(poNumber) {
        return mockPOs.find(po => po.poNumber === poNumber);
    }

    // Initialize dashboard
    initializeDashboard();
    
    // Handle search
    $('.search-input').on('keyup', function(e) {
        if (e.key === 'Enter') {
            const query = $(this).val();
            if (query) {
                const filteredPOs = searchPOs(query);
                updatePOCards(filteredPOs);
            } else {
                updatePOCards(mockPOs);
            }
        }
    });
    
    // Handle tab changes
    $('#poStatusTabs button').on('click', function() {
        const status = $(this).attr('id').replace('-tab', '');
        loadPOsByStatus(status);
    });
    
    // Handle view all buttons
    $('.view-all-btn').on('click', function() {
        const status = $(this).data('status');
        $('#' + status.replace('-', '') + '-tab').tab('show');
    });
    
    // Handle PO card clicks
    $(document).on('click', '.po-card', function() {
        const poNumber = $(this).data('po-number');
        navigateToPODetails(poNumber);
    });

    // Handle view details button clicks
    $(document).on('click', '.view-details-btn', function(e) {
        e.stopPropagation(); // Prevent triggering the card click event
        const poNumber = $(this).closest('.po-card').data('po-number');
        navigateToPODetails(poNumber);
    });
    
    function initializeDashboard() {
        // Load initial data
        updatePOCards(mockPOs);
        
        // Initialize sidebar toggle
        $('#sidebarCollapse').on('click', function() {
            $('#sidebar').toggleClass('active');
        });
        
        // Load POs for the active tab
        const activeTab = $('#poStatusTabs .nav-link.active').attr('id').replace('-tab', '');
        loadPOsByStatus(activeTab);
    }
    
    function updatePOCards(pos) {
        // Filter POs by category
        const immediateActionPOs = pos.filter(po => po.status === 'immediate-action');
        const productionPOs = pos.filter(po => po.status === 'production');
        const transitPOs = pos.filter(po => po.status === 'transit');
        const grnPOs = pos.filter(po => po.status === 'grn');
        
        // Update counts
        $('#immediate-action-count').text(immediateActionPOs.length);
        $('#production-count').text(productionPOs.length);
        $('#transit-count').text(transitPOs.length);
        $('#grn-count').text(grnPOs.length);
        
        // Render cards for each tab
        renderPOCards(immediateActionPOs, '#immediate-po-cards', 'danger');
        renderPOCards(productionPOs, '#production-po-cards', 'primary');
        renderPOCards(transitPOs, '#transit-po-cards', 'warning');
        renderPOCards(grnPOs, '#grn-po-cards', 'success');
    }
    
    function loadPOsByStatus(status) {
        let filteredPOs;
        
        switch(status) {
            case 'immediate':
                filteredPOs = mockPOs.filter(po => po.status === 'immediate-action');
                break;
            case 'production':
                filteredPOs = mockPOs.filter(po => po.status === 'production');
                break;
            case 'transit':
                filteredPOs = mockPOs.filter(po => po.status === 'transit');
                break;
            case 'grn':
                filteredPOs = mockPOs.filter(po => po.status === 'grn');
                break;
            default:
                filteredPOs = mockPOs;
        }
        
        const containerId = '#' + status + '-po-cards';
        $(containerId).empty();
        
        if (filteredPOs.length === 0) {
            $(containerId).append('<div class="col-12"><p class="text-center">No purchase orders found</p></div>');
            return;
        }
        
        filteredPOs.forEach(po => {
            let statusClass, statusIcon;
            
            switch(po.status) {
                case 'immediate-action':
                    statusClass = 'danger';
                    statusIcon = 'exclamation-circle';
                    break;
                case 'production':
                    statusClass = 'primary';
                    statusIcon = 'gear';
                    break;
                case 'transit':
                    statusClass = 'warning';
                    statusIcon = 'truck';
                    break;
                case 'grn':
                    statusClass = 'success';
                    statusIcon = 'check-circle';
                    break;
            }
            
            const card = `
                <div class="col-md-6 col-lg-4">
                    <div class="card po-card" data-po-number="${po.poNumber}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h5 class="card-title">${po.poNumber}</h5>
                                <i class="bi bi-${statusIcon} text-${statusClass}"></i>
                            </div>
                            <h6 class="card-subtitle mb-2">${po.supplier}</h6>
                            <p class="mb-2"><i class="bi bi-geo-alt me-1"></i> ${po.location}</p>
                            <p class="mb-2"><i class="bi bi-calendar me-1"></i> Due: ${po.dueDate}</p>
                            <div class="mt-3">
                                <span class="badge bg-${statusClass}">${po.statusText}</span>
                            </div>
                            <div class="mt-3 text-end">
                                <button class="btn btn-sm btn-outline-primary view-details-btn">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $(containerId).append(card);
        });
    }
    
    function renderPOCards(pos, containerId, colorClass) {
        const container = $(containerId);
        container.empty();
        
        if (pos.length === 0) {
            container.append('<p class="text-muted">No POs in this category</p>');
            return;
        }
        
        // Display up to 3 cards in the dashboard view
        const displayPOs = pos.slice(0, 3);
        
        displayPOs.forEach(po => {
            let statusIcon;
            
            switch(po.status) {
                case 'immediate-action':
                    statusIcon = 'exclamation-circle';
                    break;
                case 'production':
                    statusIcon = 'gear';
                    break;
                case 'transit':
                    statusIcon = 'truck';
                    break;
                case 'grn':
                    statusIcon = 'check-circle';
                    break;
            }
            
            const card = `
                <div class="card po-card mb-3" data-po-number="${po.poNumber}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">${po.poNumber}</h6>
                            <i class="bi bi-${statusIcon} text-${colorClass}"></i>
                        </div>
                        <p class="card-text text-muted small mb-1">${po.supplier}</p>
                        <p class="card-text small text-truncate">${po.description}</p>
                        <div class="d-flex justify-content-between mt-2 small">
                            <span>Qty: ${po.orderedQuantity}</span>
                            <span>Due: ${po.dueDate}</span>
                        </div>
                        <div class="mt-2 text-end">
                            <button class="btn btn-sm btn-outline-primary view-details-btn">View Details</button>
                        </div>
                    </div>
                </div>
            `;
            
            container.append(card);
        });
        
        // Add "View more" link if there are more than 3 POs
        if (pos.length > 3) {
            const viewMoreLink = `
                <div class="text-center mt-2">
                    <a href="#" class="view-more-link small" data-status="${containerId.replace('#', '').replace('-cards', '')}">
                        View all ${pos.length} POs
                    </a>
                </div>
            `;
            container.append(viewMoreLink);
        }
    }
    
    function navigateToPODetails(poNumber) {
        // Store the PO number in localStorage to retrieve it on the details page
        localStorage.setItem('currentPONumber', poNumber);
        
        // Navigate to the PO details page
        window.location.href = 'po-details.html';
    }
});