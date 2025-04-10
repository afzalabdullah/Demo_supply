$(document).ready(function() {
    // Mock data for POs (replace with actual data fetching)
    const mockPOs = [
        {
            poNumber: 'PO-2024-001',
            supplier: 'ABC Corp',
            location: 'New York, USA',
            poDate: '2024-01-15',
            expectedDelivery: '2024-02-28',
            description: 'Widgets - Model X',
            orderedQuantity: 1000,
            unit: 'pcs',
            unitPrice: 10.50,
            leadTime: 30,
            shipmentAdvice: 'SA-2024-001',
            grnNumber: 'GRN-2024-001',
            shippedQuantity: 800,
            receivedQuantity: 750,
            pendingQuantity: 250,
            status: 'transit',
            remarks: 'Partial shipment received. Balance to follow.',
        },
        {
            poNumber: 'PO-2024-002',
            supplier: 'XYZ Ltd',
            location: 'London, UK',
            poDate: '2024-02-01',
            expectedDelivery: '2024-03-15',
            description: 'Gears - Type B',
            orderedQuantity: 500,
            unit: 'pcs',
            unitPrice: 5.25,
            leadTime: 21,
            shipmentAdvice: 'SA-2024-002',
            grnNumber: null,
            shippedQuantity: 500,
            receivedQuantity: 0,
            pendingQuantity: 500,
            status: 'immediate-action',
            remarks: 'Awaiting shipment confirmation.',
        },
        {
            poNumber: 'PO-2024-003',
            supplier: 'Acme Industries',
            location: 'Tokyo, Japan',
            poDate: '2024-02-10',
            expectedDelivery: '2024-03-25',
            description: 'Springs - Heavy Duty',
            orderedQuantity: 2000,
            unit: 'pcs',
            unitPrice: 2.75,
            leadTime: 28,
            shipmentAdvice: null,
            grnNumber: 'GRN-2024-003',
            shippedQuantity: 2000,
            receivedQuantity: 2000,
            pendingQuantity: 0,
            status: 'grn',
            remarks: 'Goods received in good condition.',
        },
        {
            poNumber: 'PO-2024-004',
            supplier: 'Beta Systems',
            location: 'Toronto, Canada',
            poDate: '2024-03-01',
            expectedDelivery: '2024-04-15',
            description: 'Cables - Standard',
            orderedQuantity: 1500,
            unit: 'pcs',
            unitPrice: 1.50,
            leadTime: 14,
            shipmentAdvice: 'SA-2024-004',
            grnNumber: null,
            shippedQuantity: 1000,
            receivedQuantity: 1000,
            pendingQuantity: 500,
            status: 'production',
            remarks: 'Second shipment pending.',
        }
    ];

    // Function to simulate searching POs
    function searchPOs(query) {
        query = query.toLowerCase();
        return mockPOs.filter(po =>
            po.poNumber.toLowerCase().includes(query) ||
            po.supplier.toLowerCase().includes(query) ||
            po.description.toLowerCase().includes(query)
        );
    }

    // Function to simulate fetching PO by number
    function getPOByNumber(poNumber) {
        return mockPOs.find(po => po.poNumber === poNumber);
    }

    // Get PO number from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const poNumber = urlParams.get('po');
    
    if (poNumber) {
        // Show PO details if PO number is provided
        showPODetails(poNumber);
    } else {
        // Show PO selection list
        showPOList();
    }
    
    // Handle back button click
    $('#back-to-list').on('click', function() {
        $('#po-details-container').addClass('d-none');
        $('#po-selection-container').removeClass('d-none');
    });
    
    // Handle PO search
    $('#po-search-btn').on('click', function() {
        const query = $('#po-search').val();
        if (query) {
            const filteredPOs = searchPOs(query);
            renderPOList(filteredPOs);
        } else {
            renderPOList(mockPOs);
        }
    });
    
    // Search on Enter key
    $('#po-search').on('keypress', function(e) {
        if (e.which === 13) {
            $('#po-search-btn').click();
        }
    });
    
    // Handle add comment button
    $('#add-comment-btn').on('click', function() {
        const comment = $('#comment-input').val().trim();
        if (comment) {
            addComment(comment);
            $('#comment-input').val('');
        }
    });
    
    function showPOList() {
        $('#po-details-container').addClass('d-none');
        $('#po-selection-container').removeClass('d-none');
        renderPOList(mockPOs);
    }
    
    function renderPOList(pos) {
        const container = $('#po-list-container');
        container.empty();
        
        if (pos.length === 0) {
            container.append('<div class="col-12"><p class="text-center">No purchase orders found</p></div>');
            return;
        }
        
        pos.forEach(po => {
            let statusClass = 'primary';
            let statusText = 'Production';
            
            if (po.status === 'immediate-action') {
                statusClass = 'danger';
                statusText = 'Immediate Action';
            } else if (po.status === 'transit') {
                statusClass = 'warning';
                statusText = 'Transit';
            } else if (po.status === 'grn') {
                statusClass = 'success';
                statusText = 'GRN';
            }
            
            const card = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card po-card h-100" data-po-number="${po.poNumber}">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">${po.poNumber}</h5>
                            <span class="badge bg-${statusClass}">${statusText}</span>
                        </div>
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">${po.supplier}</h6>
                            <p class="card-text">${po.description}</p>
                            <div class="d-flex justify-content-between mt-3">
                                <div>
                                    <p class="mb-0 small"><strong>Ordered:</strong> ${po.orderedQuantity}</p>
                                    <p class="mb-0 small"><strong>Pending:</strong> ${po.pendingQuantity}</p>
                                </div>
                                <div>
                                    <p class="mb-0 small"><strong>PO Date:</strong> ${po.poDate}</p>
                                    <p class="mb-0 small"><strong>Expected:</strong> ${po.expectedDelivery || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <button class="btn btn-primary w-100 view-po-btn" data-po-number="${po.poNumber}">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }
    
    // Handle PO card clicks
    $(document).on('click', '.view-po-btn', function() {
        const poNumber = $(this).data('po-number');
        showPODetails(poNumber);
    });
    
    function showPODetails(poNumber) {
        const po = getPOByNumber(poNumber);
        
        if (!po) {
            alert('Purchase Order not found');
            return;
        }
        
        // Update URL without reloading the page
        const newUrl = window.location.pathname + '?po=' + poNumber;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Hide selection and show details
        $('#po-selection-container').addClass('d-none');
        $('#po-details-container').removeClass('d-none');
        
        // Set PO details
        $('#po-number-title').text(po.poNumber);
        
        // Set supplier info
        $('#supplier-name').text(po.supplier);
        $('#supplier-location').text(po.location);
        $('#po-date').text(po.poDate);
        
        if (po.expectedDelivery) {
            $('#expected-delivery').text(po.expectedDelivery);
            $('#expected-delivery-container').show();
        } else {
            $('#expected-delivery-container').hide();
        }
        
        // Set order details
        $('#item-description').text(po.description);
        $('#ordered-quantity').text(`${po.orderedQuantity} ${po.unit}`);
        $('#unit-price').text(`$${po.unitPrice.toFixed(2)}`);
        $('#total-value').text(`$${(po.orderedQuantity * po.unitPrice).toFixed(2)}`);
        $('#lead-time').text(`${po.leadTime} days`);
        
        // Set shipment & delivery info
        if (po.shipmentAdvice) {
            $('#shipment-advice').text(po.shipmentAdvice);
            $('#shipment-advice-container').show();
            $('#no-shipment-advice').hide();
            $('#shipment-doc-btn').removeClass('disabled');
        } else {
            $('#shipment-advice-container').hide();
            $('#no-shipment-advice').show();
            $('#shipment-doc-btn').addClass('disabled');
        }
        
        if (po.grnNumber) {
            $('#grn-number').text(po.grnNumber);
            $('#grn-number-container').show();
            $('#no-grn').hide();
            $('#grn-doc-btn').removeClass('disabled');
        } else {
            $('#grn-number-container').hide();
            $('#no-grn').show();
            $('#grn-doc-btn').addClass('disabled');
        }
        
        $('#shipped-quantity').text(`${po.shippedQuantity} ${po.unit}`);
        $('#received-quantity').text(`${po.receivedQuantity} ${po.unit}`);
        $('#pending-quantity').text(`${po.pendingQuantity} ${po.unit}`);
        
        // Set status badge
        let statusClass = 'primary';
        let statusText = 'Production';
        
        if (po.status === 'immediate-action') {
            statusClass = 'danger';
            statusText = 'Immediate Action';
        } else if (po.status === 'transit') {
            statusClass = 'warning';
            statusText = 'Transit';
        } else if (po.status === 'grn') {
            statusClass = 'success';
            statusText = 'GRN';
        }
        
        $('#po-status-badge').removeClass('bg-primary bg-danger bg-warning bg-success')
            .addClass(`bg-${statusClass}`)
            .text(statusText);
        
        // Calculate progress percentages
        const totalQuantity = po.orderedQuantity;
        const productionPercentage = ((totalQuantity - po.shippedQuantity) / totalQuantity) * 100;
        const transitPercentage = ((po.shippedQuantity - po.receivedQuantity) / totalQuantity) * 100;
        const receivedPercentage = (po.receivedQuantity / totalQuantity) * 100;
        
        // Update progress bars
        $('#production-percentage').text(`${productionPercentage.toFixed(0)}%`);
        $('#transit-percentage').text(`${transitPercentage.toFixed(0)}%`);
        $('#received-percentage').text(`${receivedPercentage.toFixed(0)}%`);
        
        $('#production-progress').css('width', `${productionPercentage}%`);
        $('#transit-progress').css('width', `${transitPercentage}%`);
        $('#received-progress').css('width', `${receivedPercentage}%`);
        
        // Initialize comments
        initializeComments(po);
    }
    
    function initializeComments(po) {
        const commentsContainer = $('#comments-container');
        commentsContainer.empty();
        
        // Add initial comments
        const initialComments = [
            {
                text: `PO ${po.poNumber} created on ${po.poDate}`,
                date: new Date(2025, 1, 28, 9, 30)
            }
        ];
        
        if (po.remarks) {
            initialComments.push({
                text: `Remarks: ${po.remarks}`,
                date: new Date(2025, 1, 28, 10, 15)
            });
        }
        
        if (po.shipmentAdvice) {
            initialComments.push({
                text: `Shipment advice ${po.shipmentAdvice} received`,
                date: new Date(2025, 2, 5, 14, 20)
            });
        }

        if (po.grnNumber) {
            initialComments.push({
                text: `GRN ${po.grnNumber} processed`,
                date: new Date(2025, 2, 15, 11, 45)
            });
        }

        // Render comments
        initialComments.forEach(comment => {
            renderComment(comment.text, comment.date);
        });
    }
    
    function addComment(text) {
        renderComment(text, new Date());
    }
    
    function renderComment(text, date) {
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const commentHtml = `
            <div class="bg-light p-2 rounded mb-2">
                <p class="mb-1">${text}</p>
                <p class="text-muted small mb-0">${formattedDate}</p>
            </div>
        `;
        $('#comments-container').append(commentHtml);
    }
});