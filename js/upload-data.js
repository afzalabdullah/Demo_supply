import * as $ from 'jquery';
import * as XLSX from 'xlsx';

$(document).ready(function() {
    // File upload variables
    let selectedFile = null;
    let previewData = null;
    
    // Handle file input change
    $('#file-input').on('change', function(e) {
        handleFileSelection(e.target.files[0]);
    });
    
    // Handle browse button click
    $('#browse-btn').on('click', function() {
        $('#file-input').click();
    });
    
    // Handle drag and drop
    const uploadZone = document.getElementById('upload-zone');
    
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('bg-light');
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('bg-light');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('bg-light');
        
        const file = e.dataTransfer.files[0];
        handleFileSelection(file);
    });
    
    // Handle remove file button
    $('#remove-file-btn').on('click', function() {
        clearFile();
    });
    
    // Handle clear button
    $('#clear-btn').on('click', function() {
        clearFile();
    });
    
    // Handle upload button
    $('#upload-btn').on('click', function() {
        if (!selectedFile) {
            showAlert('error', 'Please select a file to upload');
            return;
        }
        
        // Simulate upload process
        $(this).prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Uploading...');
        
        setTimeout(function() {
            showAlert('success', 'File uploaded and processed successfully');
            $('#upload-btn').prop('disabled', false).html('Upload');
        }, 2000);
    });
    
    // Handle download template button
    $('#download-template-btn').on('click', function() {
        // Create CSV content for the template
        const headers = [
            'Supp Code', 'Supp Name', 'PO Txn', 'PO No', 'Ph Dt', 'Item Code', 'Item Desc',
            'SA Txn', 'SA No', 'Sh Dt', 'Bl Awb', 'Boe No', 'GRN Loc', 'GRN Txn', 'GRN No',
            'Order Qty', 'Currency', 'PO Rate', 'Shipped Qty', 'Rcvd Qty', 'Pend Qty',
            'GRN Rate', 'GRN Value', 'GRN Date', 'Budg Cat', 'Shipment Ets Dt', 'Shipment Eta Dt',
            'PO STATUS', 'PO ITEM STATUS', 'PI NO', 'Comp Code', 'REMARKS', 'Req No',
            'Supplier Ref No', 'Mode of Payment', 'Delivery Term'
        ];
        
        // Create sample row
        const sampleRow = [
            'S003735', 'XYZ', 'IPOCT', '8262500030', '28-Feb-25', '245800100306',
            'B2B INDIAN MILANO PORCELAIN FLOOR TILE (58) ENRICH GRAFFITE MATT 60X60CM (4 NOS/CTN,1.44SQM)',
            '0', '0', '', '', '', '0', '0', '0', '1457.28', 'USD', '', '0', '0', '1457.28',
            '', '', '', '', '', '', 'OPEN', 'OPEN', 'SQUE24-250001093', '826LLC',
            'stock and sale SHAFFY\'S CUSTOMER', 'REQ-8262500073 ,28-FEB-25', 'SQUE24-250001093',
            '', 'FOB-FREE ON BOARD'
        ];
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n' + sampleRow.join(',');
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'po_template.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // Handle manual entry form
    $('#manual-entry-form').on('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        alert('PO data saved successfully');
        
        // Clear form
        $(this).trigger('reset');
    });
    
    // Handle clear form button
    $('#clear-form-btn').on('click', function() {
        $('#manual-entry-form').trigger('reset');
    });
    
    function handleFileSelection(file) {
        if (!file) return;
        
        // Check file type
        const fileType = file.name.split('.').pop().toLowerCase();
        if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
            showAlert('error', 'Please upload a CSV or Excel file');
            return;
        }
        
        // Update file info
        selectedFile = file;
        $('#file-name').text(file.name);
        $('#file-size').text(formatFileSize(file.size));
        $('#file-info').removeClass('d-none');
        
        // Hide any previous alerts
        $('#upload-alert').addClass('d-none');
        
        // Read and preview file
        if (fileType === 'csv') {
            readCSVFile(file);
        } else {
            readExcelFile(file);
        }
    }
    
    function readCSVFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Extract headers and data
            const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
            
            const data = [];
            for (let i = 1; i < Math.min(lines.length, 6); i++) {
                if (lines[i].trim() === '') continue;
                
                const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
                const row = {};
                
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                
                data.push(row);
            }
            
            // Store preview data and show preview
            previewData = { headers, data };
            showPreview(previewData);
        };
        
        reader.readAsText(file);
    }
    
    function readExcelFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const fileData = new Uint8Array(e.target.result);
            const workbook = XLSX.read(fileData, { type: 'array' });
            
            // Get the first sheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            // Extract headers and data
            const headers = jsonData[0];
            const rows = jsonData.slice(1, 6); // Get first 5 rows for preview
            
            const data = rows.map(row => {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index] || '';
                });
                return rowData;
            });
            
            // Store preview data and show preview
            previewData = { headers, data };
            showPreview(previewData);
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    function showPreview(previewData) {
        const { headers, data } = previewData;
        
        // Clear previous preview
        $('#preview-table thead tr').empty();
        $('#preview-table tbody').empty();
        
        // Add headers
        headers.forEach(header => {
            $('#preview-table thead tr').append(`<th>${header}</th>`);
        });
        
        // Add data rows
        data.forEach(row => {
            const tr = $('<tr></tr>');
            
            headers.forEach(header => {
                tr.append(`<td>${row[header] || ''}</td>`);
            });
            
            $('#preview-table tbody').append(tr);
        });
        
        // Show preview card
        $('#preview-card').removeClass('d-none');
    }
    
    function clearFile() {
        selectedFile = null;
        previewData = null;
        
        $('#file-input').val('');
        $('#file-info').addClass('d-none');
        $('#preview-card').addClass('d-none');
        $('#upload-alert').addClass('d-none');
    }
    
    function showAlert(type, message) {
        const alertElement = $('#upload-alert');
        
        alertElement.removeClass('d-none alert-success alert-danger');
        
        if (type === 'success') {
            alertElement.addClass('alert-success');
            alertElement.html(`<i class="bi bi-check-circle-fill me-2"></i> ${message}`);
        } else {
            alertElement.addClass('alert-danger');
            alertElement.html(`<i class="bi bi-exclamation-circle-fill me-2"></i> ${message}`);
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});