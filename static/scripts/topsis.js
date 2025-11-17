const CRITERIA = ['Interface', 'Capacity', 'NAND Type', 'Read', 'Write', 'Price', 'Warranty'];
let numAlternatives = 5;
let weights = [];
let alternativeCounter = 0;

// Sample data yang sudah tetap
const SAMPLE_DATA = [
    { name: "ADATA SX6000 Pro", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2100, write: 1500, price: 425000, warranty: 5 },
    { name: "Apacer AS2280P4", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2100, write: 1000, price: 380000, warranty: 3 },
    { name: "WD Blue SN750", interface: "PCIe 3.0/NVMe", capacity: 250, nand: "TLC", read: 3300, write: 1200, price: 400000, warranty: 5 },
    { name: "Gigabyte NVMe", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 1700, write: 1100, price: 479000, warranty: 5 },
    { name: "MSI M450", interface: "PCIe 4.0/NVMe", capacity: 250, nand: "TLC", read: 3600, write: 3000, price: 692445, warranty: 5 },
];

function loadWeights() {
    const storedWeights = sessionStorage.getItem('ahp_weights');
    if (!storedWeights) {
        alert('Weights not found! Please complete AHP on Page 1 first.');
        window.location.href = '/';
        return;
    }

    weights = JSON.parse(storedWeights);

    // Display weights
    let html = '';
    for (let i = 0; i < CRITERIA.length; i++) {
        html += `
            <div class="weight-item">
                <strong>${CRITERIA[i]}</strong>
                <div>${weights[i].toFixed(4)}</div>
                <div style="font-size: 0.85em; color: #666;">(${(weights[i] * 100).toFixed(2)}%)</div>
            </div>
        `;
    }
    document.getElementById('weightsDisplay').innerHTML = html;
}

// FILE UPLOAD FUNCTIONS

function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Drag and Drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

async function handleFileUpload(file) {
    const statusDiv = document.getElementById('uploadStatus');
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate file size
    if (file.size > maxSize) {
        showUploadStatus('error', ' File terlalu besar! Maksimal 5MB.');
        return;
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
        showUploadStatus('error', 'Format file tidak didukung! Gunakan .xlsx, .xls, atau .csv');
        return;
    }

    showUploadStatus('loading', ' Memproses file...');

    try {
        let data;
        if (isExcel) {
            data = await parseExcelFile(file);
        } else {
            data = await parseCSVFile(file);
        }

        if (data && data.length > 0) {
            populateFormsFromData(data);
            showUploadStatus('success', ` Berhasil memuat ${data.length} data alternatif!`);

            // Show alternatives section
            document.getElementById('alternativesSection').style.display = 'block';

            // Scroll to forms
            setTimeout(() => {
                document.getElementById('alternativesSection').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            showUploadStatus('error', 'Tidak ada data valid yang ditemukan dalam file!');
        }
    } catch (error) {
        showUploadStatus('error', 'Error: ' + error.message);
        console.error('Upload error:', error);
    }
}

async function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                // Import XLSX library
                if (typeof XLSX === 'undefined') {
                    reject(new Error('XLSX library not loaded. Please check your internet connection.'));
                    return;
                }

                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                const parsedData = parseDataFromJSON(jsonData);
                resolve(parsedData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Gagal membaca file'));
        reader.readAsArrayBuffer(file);
    });
}

async function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());

                const jsonData = [];
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim() === '') continue;

                    const values = lines[i].split(',').map(v => v.trim());
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });
                    jsonData.push(obj);
                }

                const parsedData = parseDataFromJSON(jsonData);
                resolve(parsedData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Gagal membaca file'));
        reader.readAsText(file);
    });
}

function parseDataFromJSON(jsonData) {
    const parsedData = [];

    for (const row of jsonData) {
        // Try to find matching columns (case-insensitive and flexible)
        const name = findValue(row, ['name', 'nama', 'model', 'ssd']);
        const interface_ = findValue(row, ['interface', 'type', 'tipe']);
        const capacity = findValue(row, ['capacity', 'kapasitas', 'size']);
        const nand = findValue(row, ['nand type', 'nand', 'nandtype']);
        const read = findValue(row, ['read', 'read speed', 'readspeed', 'baca']);
        const write = findValue(row, ['write', 'write speed', 'writespeed', 'tulis']);
        const price = findValue(row, ['price', 'harga', 'cost']);
        const warranty = findValue(row, ['warranty', 'garansi']);

        if (name) {
            parsedData.push({
                name: name || 'Unknown',
                interface: interface_ || 'PCIe 3.0/NVMe',
                capacity: parseFloat(capacity) || 256,
                nand: nand || 'TLC',
                read: parseFloat(read) || 2100,
                write: parseFloat(write) || 2000,
                price: parseFloat(price) || 100000,
                warranty: parseFloat(warranty) || 5
            });
        }
    }

    return parsedData;
}

function findValue(obj, keys) {
    for (const key of keys) {
        for (const objKey in obj) {
            if (objKey.toLowerCase().replace(/\s+/g, '') === key.toLowerCase().replace(/\s+/g, '')) {
                return obj[objKey];
            }
        }
    }
    return null;
}

function showUploadStatus(type, message) {
    const statusDiv = document.getElementById('uploadStatus');
    statusDiv.style.display = 'block';
    statusDiv.className = 'upload-status ' + type;
    statusDiv.innerHTML = message;

    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

function populateFormsFromData(data) {
    numAlternatives = data.length;
    document.getElementById('numAlternatives').value = numAlternatives;

    let html = '';
    alternativeCounter = 0;

    data.forEach((item, index) => {
        html += generateAlternativeCard(alternativeCounter, item);
        alternativeCounter++;
    });

    document.getElementById('alternativeForms').innerHTML = html;
}

// TEMPLATE DOWNLOAD FUNCTIONS

function downloadTemplate(type) {
    const templateData = [
        {
            'Name': 'Samsung 990 PRO',
            'Interface': 'PCIe 4.0/NVMe',
            'Capacity': 512,
            'NAND Type': 'TLC',
            'Read': 7450,
            'Write': 6900,
            'Price': 1200000,
            'Warranty': 5
        },
        {
            'Name': 'WD Black SN850X',
            'Interface': 'PCIe 4.0/NVMe',
            'Capacity': 500,
            'NAND Type': 'TLC',
            'Read': 7300,
            'Write': 6600,
            'Price': 1150000,
            'Warranty': 5
        },
        {
            'Name': 'Kingston NV2',
            'Interface': 'PCIe 4.0/NVMe',
            'Capacity': 500,
            'NAND Type': 'QLC',
            'Read': 3500,
            'Write': 2800,
            'Price': 650000,
            'Warranty': 3
        }
    ];

    if (type === 'excel') {
        downloadExcelTemplate(templateData);
    } else {
        downloadCSVTemplate(templateData);
    }
}

function downloadExcelTemplate(data) {
    if (typeof XLSX === 'undefined') {
        alert('XLSX library not loaded. Please refresh the page and try again.');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SSD Data');
    XLSX.writeFile(wb, 'template_ssd_data.xlsx');
}

function downloadCSVTemplate(data) {
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        csv += headers.map(header => row[header]).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_ssd_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// FORM GENERATION FUNCTIONS

function generateForms() {
    numAlternatives = parseInt(document.getElementById('numAlternatives').value);

    let html = '';
    alternativeCounter = 0;

    for (let i = 0; i < numAlternatives; i++) {
        const sampleData = i < SAMPLE_DATA.length ? SAMPLE_DATA[i] : {
            name: `SSD ${i + 1}`,
            interface: "PCIe 3.0/NVMe",
            capacity: 256,
            nand: "TLC",
            read: 2100,
            write: 2000,
            price: 100000,
            warranty: 5
        };

        html += generateAlternativeCard(alternativeCounter, sampleData);
        alternativeCounter++;
    }

    document.getElementById('alternativeForms').innerHTML = html;
    document.getElementById('alternativesSection').style.display = 'block';
}

function generateAlternativeCard(index, data) {
    return `
    <div class="alternative-card" id="card_${index}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0;">SSD Alternatif ${index + 1}</h4>
            <button class="delete-btn" onclick="deleteAlternative(${index})" style="background: #dc3545; padding: 8px 15px; font-size: 0.9em;">Hapus</button>
        </div>
        <div class="form-grid">
            <div class="form-field">
                <label>Nama Alternatif:</label>
                <input type="text" id="alt_name_${index}" placeholder="contoh: Samsung 990 PRO" value="${data.name}">
            </div>
            <div class="form-field">
                <label>Interface:</label>
                <select id="alt_interface_${index}">
                    <option value="PCIe 3.0/NVMe" ${data.interface === "PCIe 3.0/NVMe" ? "selected" : ""}>PCIe 3.0/NVMe</option>
                    <option value="PCIe 4.0/NVMe" ${data.interface === "PCIe 4.0/NVMe" ? "selected" : ""}>PCIe 4.0/NVMe</option>
                    <option value="PCIe 5.0/NVMe" ${data.interface === "PCIe 5.0/NVMe" ? "selected" : ""}>PCIe 5.0/NVMe</option>
                </select>
            </div>
            <div class="form-field">
                <label>Capacity (GB):</label>
                <input type="number" id="alt_capacity_${index}" placeholder="contoh: 256" value="${data.capacity}" step="1">
            </div>
            <div class="form-field">
                <label>NAND Type:</label>
                <select id="alt_nand_${index}">
                    <option value="QLC" ${data.nand === "QLC" ? "selected" : ""}>QLC</option>
                    <option value="TLC" ${data.nand === "TLC" ? "selected" : ""}>TLC</option>
                    <option value="MLC" ${data.nand === "MLC" ? "selected" : ""}>MLC</option>
                    <option value="SLC" ${data.nand === "SLC" ? "selected" : ""}>SLC</option>
                </select>
            </div>
            <div class="form-field">
                <label>Read Speed (MB/s):</label>
                <input type="number" id="alt_read_${index}" placeholder="contoh: 2100" value="${data.read}" step="1">
            </div>
            <div class="form-field">
                <label>Write Speed (MB/s):</label>
                <input type="number" id="alt_write_${index}" placeholder="contoh: 2000" value="${data.write}" step="1">
            </div>
            <div class="form-field">
                <label>Price:</label>
                <input type="number" id="alt_price_${index}" placeholder="contoh: 150000" value="${data.price}" step="1000">
            </div>
            <div class="form-field">
                <label>Warranty (Years):</label>
                <input type="number" id="alt_warranty_${index}" placeholder="contoh: 5" value="${data.warranty}" step="0.1">
            </div>
        </div>
    </div>`;
}

function addNewAlternative() {
    const newData = {
        name: `New SSD ${alternativeCounter + 1}`,
        interface: "PCIe 3.0/NVMe",
        capacity: 256,
        nand: "TLC",
        read: 2100,
        write: 2000,
        price: 100000,
        warranty: 5
    };

    const newCard = generateAlternativeCard(alternativeCounter, newData);
    document.getElementById('alternativeForms').insertAdjacentHTML('beforeend', newCard);
    alternativeCounter++;

    // Scroll to new card
    setTimeout(() => {
        document.getElementById(`card_${alternativeCounter - 1}`).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

function deleteAlternative(index) {
    const card = document.getElementById(`card_${index}`);
    if (card) {
        const altName = document.getElementById(`alt_name_${index}`).value;
        if (confirm(`Apakah Anda yakin ingin menghapus "${altName}"?`)) {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            setTimeout(() => {
                card.remove();
            }, 300);
        }
    }
}

function clearAllAlternatives() {
    if (confirm('Apakah Anda yakin ingin menghapus SEMUA data alternatif?')) {
        document.getElementById('alternativeForms').innerHTML = '';
        document.getElementById('alternativesSection').style.display = 'none';
        alternativeCounter = 0;
    }
}

// TOPSIS CALCULATION

async function calculateTOPSIS() {
    if (weights.length === 0) {
        alert('Weights not found! Please complete AHP first.');
        return;
    }

    const cards = document.querySelectorAll('.alternative-card');

    if (cards.length === 0) {
        alert('Tidak ada data alternatif yang tersedia!');
        return;
    }

    let rawData = [];
    cards.forEach((card) => {
        const cardId = card.id.split('_')[1];
        const nameInput = document.getElementById(`alt_name_${cardId}`);

        if (nameInput) {
            rawData.push({
                name: nameInput.value,
                interface: document.getElementById(`alt_interface_${cardId}`).value,
                capacity: document.getElementById(`alt_capacity_${cardId}`).value,
                nand_type: document.getElementById(`alt_nand_${cardId}`).value,
                read: document.getElementById(`alt_read_${cardId}`).value,
                write: document.getElementById(`alt_write_${cardId}`).value,
                price: document.getElementById(`alt_price_${cardId}`).value,
                warranty: document.getElementById(`alt_warranty_${cardId}`).value
            });
        }
    });

    try {
        const response = await fetch('/calculate_topsis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                raw_data: rawData,
                weights: weights
            })
        });

        const data = await response.json();

        if (data.success) {
            displayTOPSISResults(data.results, rawData);
            document.getElementById('topsisSection').style.display = 'block';
            document.querySelectorAll('.progress-step')[2].classList.add('completed');

            setTimeout(() => {
                document.getElementById('topsisSection').scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error calculating TOPSIS: ' + error);
    }
}

function displayTOPSISResults(results, rawData) {
    let resultsHTML = '<h3>Hasil Perhitungan TOPSIS:</h3>';

    resultsHTML += '<div class="result-item"><strong>🏆 Peringkat Final:</strong>';
    resultsHTML += '<table id="resultsTable"><thead><tr><th>Rank</th><th>Model SSD</th><th>Closeness Score</th><th>Interface</th><th>Capacity</th><th>NAND</th><th>Read</th><th>Write</th><th>Price</th><th>Warranty</th></tr></thead><tbody>';

    let rankData = [];
    for (let i = 0; i < rawData.length; i++) {
        rankData.push({
            index: i,
            name: rawData[i].name,
            interface: rawData[i].interface,
            capacity: rawData[i].capacity,
            nand: rawData[i].nand_type,
            read: rawData[i].read,
            write: rawData[i].write,
            price: rawData[i].price,
            warranty: rawData[i].warranty,
            closeness: results.closeness[i],
            rank: results.ranks[i]
        });
    }
    rankData.sort((a, b) => a.rank - b.rank);

    for (let item of rankData) {
        let rowClass = '';
        if (item.rank === 1) rowClass = 'rank-1';
        else if (item.rank === 2) rowClass = 'rank-2';
        else if (item.rank === 3) rowClass = 'rank-3';

        resultsHTML += `<tr class="${rowClass}">
            <td><strong>${item.rank}</strong></td>
            <td><strong>${item.name}</strong></td>
            <td>${item.closeness.toFixed(4)}</td>
            <td>${item.interface}</td>
            <td>${item.capacity} GB</td>
            <td>${item.nand}</td>
            <td>${item.read} MB/s</td>
            <td>${item.write} MB/s</td>
            <td>Rp ${parseFloat(item.price).toLocaleString('id-ID')}</td>
            <td>${item.warranty} years</td>
        </tr>`;
    }
    resultsHTML += '</tbody></table></div>';

    document.getElementById('topsisResults').innerHTML = resultsHTML;

    // Store results for export
    window.topsisResults = rankData;
}

// EXPORT FUNCTIONS

function exportResults(type) {
    if (!window.topsisResults || window.topsisResults.length === 0) {
        alert('Tidak ada hasil untuk diekspor!');
        return;
    }

    if (type === 'excel') {
        exportToExcel();
    } else {
        exportToCSV();
    }
}

function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('XLSX library not loaded. Please refresh the page and try again.');
        return;
    }

    const exportData = window.topsisResults.map(item => ({
        'Rank': item.rank,
        'Model SSD': item.name,
        'Closeness Score': item.closeness.toFixed(4),
        'Interface': item.interface,
        'Capacity (GB)': item.capacity,
        'NAND Type': item.nand,
        'Read Speed (MB/s)': item.read,
        'Write Speed (MB/s)': item.write,
        'Price (IDR)': item.price,
        'Warranty (Years)': item.warranty
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TOPSIS Results');

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `TOPSIS_Results_${date}.xlsx`);
}

function exportToCSV() {
    const headers = ['Rank', 'Model SSD', 'Closeness Score', 'Interface', 'Capacity (GB)',
        'NAND Type', 'Read Speed (MB/s)', 'Write Speed (MB/s)', 'Price (IDR)', 'Warranty (Years)'];
    let csv = headers.join(',') + '\n';

    window.topsisResults.forEach(item => {
        csv += [
            item.rank,
            `"${item.name}"`,
            item.closeness.toFixed(4),
            item.interface,
            item.capacity,
            item.nand,
            item.read,
            item.write,
            item.price,
            item.warranty
        ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `TOPSIS_Results_${date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function goBackToPage1() {
    if (confirm('Kembali ke halaman AHP? Data yang belum disimpan akan hilang.')) {
        window.location.href = '/page1';
    }
}

// INITIALIZATION

window.onload = function () {
    loadWeights();
    setupFileUpload();

    // Load XLSX library for Excel support
    if (typeof XLSX === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        document.head.appendChild(script);
    }
};