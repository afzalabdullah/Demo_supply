$(document).ready(function() {
    // Mock data for POs (replace with actual data source)
    const mockPOs = [
        {
            poNumber: 'PO-2024-001',
            supplier: 'ABC Corp',
            location: 'New York',
            createdDate: '2024-01-15',
            dueDate: '2024-02-15',
            status: 'immediate-action',
            statusText: 'Immediate Action',
            items: 3,
            poDate: '2024-01-10',
            description: 'Urgent order for critical components',
            orderedQuantity: 100,
            unit: 'pcs',
            unitPrice: 10.50,
            currency: 'USD',
            shippedQuantity: 50,
            receivedQuantity: 0,
            pendingQuantity: 50,
            compCode: 'CMP001'
        },
        {
            poNumber: 'PO-2024-002',
            supplier: 'XYZ Ltd',
            location: 'London',
            createdDate: '2024-02-01',
            dueDate: '2024-03-01',
            status: 'production',
            statusText: 'Production',
            items: 5,
            poDate: '2024-01-25',
            description: 'Standard order for production line',
            orderedQuantity: 200,
            unit: 'pcs',
            unitPrice: 5.25,
            currency: 'GBP',
            shippedQuantity: 150,
            receivedQuantity: 100,
            pendingQuantity: 100,
            compCode: 'CMP002'
        },
        {
            poNumber: 'PO-2024-003',
            supplier: 'PQR Inc',
            location: 'Tokyo',
            createdDate: '2024-02-15',
            dueDate: '2024-03-15',
            status: 'transit',
            statusText: 'In Transit',
            items: 2,
            poDate: '2024-02-10',
            description: 'Order in transit to final destination',
            orderedQuantity: 50,
            unit: 'pcs',
            unitPrice: 20.00,
            currency: 'JPY',
            shippedQuantity: 50,
            receivedQuantity: 0,
            pendingQuantity: 50,
            compCode: 'CMP003'
        },
        {
            poNumber: 'PO-2024-004',
            supplier: 'LMN Co',
            location: 'Sydney',
            createdDate: '2024-03-01',
            dueDate: '2024-04-01',
            status: 'grn',
            statusText: 'GRN',
            items: 4,
            poDate: '2024-02-20',
            description: 'Goods received and processed',
            orderedQuantity: 100,
            unit: 'pcs',
            unitPrice: 7.50,
            currency: 'AUD',
            shippedQuantity: 100,
            receivedQuantity: 100,
            pendingQuantity: 0,
            compCode: 'CMP004'
        }
    ];

    // Function to get PO by number (replace with actual data retrieval)
    function getPOByNumber(poNumber) {
        return mockPOs.find(po => po.poNumber === poNumber);
    }

    // Initialize DataTable
    const poTable = initializeDataTable();
    
    // Handle search
    $('#search-input').on('keyup', function() {
        poTable.search($(this).val()).draw();
    });
    
    // Handle status filter
    $('#status-filter').on('change', function() {
        const status = $(this).val();
        
        if (status === 'all') {
            poTable.column(5).search('').draw();
        } else {
            poTable.column(5).search(status).draw();
        }
    });
    
    // Handle export button
    $('#export-btn').on('click', function() {
        exportTableToCSV('po_data.csv');
    });
    
    // Handle view details button
    $(document).on('click', '.view-details-btn', function(e) {
        e.stopPropagation();
        const poNumber = $(this).data('po-number');
        showPODetails(poNumber);
    });
    
    // Handle row click
    $('#po-table tbody').on('click', 'tr', function() {
        const poNumber = poTable.row(this).data()[0];
        showPODetails(poNumber);
    });
    
    function initializeDataTable() {
        // Prepare data for DataTable
        const tableData = mockPOs.map(po => {
            let statusBadge = '';
            
            if (po.status === 'immediate-action') {
                statusBadge = `<span class="badge bg-danger">${po.statusText}</span>`;
            } else if (po.status === 'production') {
                statusBadge = `<span class="badge bg-primary">${po.statusText}</span>`;
            } else if (po.status === 'transit') {
                statusBadge = `<span class="badge bg-warning text-dark">${po.statusText}</span>`;
            } else if (po.status === 'grn') {
                statusBadge = `<span class="badge bg-success">${po.statusText}</span>`;
            }
            
            return [
                po.poNumber,
                po.supplier,
                po.location,
                po.createdDate,
                po.dueDate,
                statusBadge,
                po.items,
                `<div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-primary me-2 view-details-btn" data-po-number="${po.poNumber}">
                        <i class="bi bi-eye"></i> View
                    </button>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item view-details-btn" href="#" data-po-number="${po.poNumber}"><i class="bi bi-eye me-2"></i>View Details</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-download me-2"></i>Export</a></li>
                        </ul>
                    </div>
                </div>`,
                po.status // Hidden column for filtering
            ];
        });
        
        // Initialize DataTable
        return $('#po-table').DataTable({
            data: tableData,
            columnDefs: [
                { targets: 8, visible: false }, // Hide the status column used for filtering
                { targets: 7, orderable: false } // Actions column not sortable
            ],
            order: [[3, 'desc']], // Sort by created date by default
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            responsive: true,
            language: {
                search: "",
                searchPlaceholder: "Search..."
            }
        });
    }
    
    function showPODetails(poNumber) {
        const po = getPOByNumber(poNumber);
        
        if (!po) {
            alert('Purchase Order not found');
            return;
        }
        
        // Set modal details
        $('#modal-po-number').text(po.poNumber);
        $('#modal-supplier-name').text(po.supplier);
        $('#modal-supplier-location').text(po.location);
        $('#modal-po-date').text(po.poDate);
        $('#modal-due-date').text(po.dueDate);
        
        $('#modal-description').text(po.description);
        $('#modal-ordered-qty').text(`${po.orderedQuantity} ${po.unit}`);
        $('#modal-unit-price').text(`$${po.unitPrice.toFixed(2)}`);
        $('#modal-total-value').text(`$${(po.orderedQuantity * po.unitPrice).toFixed(2)}`);
        $('#modal-currency').text(po.currency);
        
        // Set status badge
        let badgeClass = 'bg-primary';
        if (po.status === 'immediate-action') {
            badgeClass = 'bg-danger';
        } else if (po.status === 'transit') {
            badgeClass = 'bg-warning';
        } else if (po.status === 'grn') {
            badgeClass = 'bg-success';
        }
        
        $('#modal-status-badge').removeClass('bg-primary bg-danger bg-warning bg-success')
            .addClass(badgeClass)
            .text(po.statusText);
        
        $('#modal-status-text').text(po.statusText);
        $('#modal-shipped-qty').text(`${po.shippedQuantity} ${po.unit}`);
        $('#modal-received-qty').text(`${po.receivedQuantity} ${po.unit}`);
        $('#modal-pending-qty').text(`${po.pendingQuantity} ${po.unit}`);
        $('#modal-comp-code').text(po.compCode);
        
        // Show modal
        $('#viewDetailsModal').modal('show');
    }
    
    function exportTableToCSV(filename) {
        const csv = [];
        const rows = document.querySelectorAll('#po-table tr');
        
        for (let i = 0; i < rows.length; i++) {
            const row = [], cols = rows[i].querySelectorAll('td, th');
            
            for (let j = 0; j < cols.length; j++) {
                // Get the text content and remove HTML tags
                let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/"/g, '""');
                row.push('"' + text + '"');
            }
            
            csv.push(row.slice(0, 7).join(',')); // Exclude the hidden column and actions
        }
        
        // Download CSV file
        downloadCSV(csv.join('\n'), filename);
    }
    
    function downloadCSV(csv, filename) {
        const csvFile = new Blob([csv], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});