const CRITERIA = ['Interface', 'Capacity', 'NAND Type', 'Read', 'Write', 'Price', 'Warranty'];
let numAlternatives = 5;
let weights = [];

// Sample data yang sudah tetap
const SAMPLE_DATA = [
    { name: "ADATA SX6000 Pro", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2100, write: 1500, price: 425000, warranty: 5 },
    { name: "Apacer AS2280P4", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2100, write: 1000, price: 380000, warranty: 3 },
    { name: "WD Blue SN750", interface: "PCIe 3.0/NVMe", capacity: 250, nand: "TLC", read: 3300, write: 1200, price: 400000, warranty: 5 },
    { name: "Gigabyte NVMe", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 1700, write: 1100, price: 479000, warranty: 5 },
    { name: "MSI M450", interface: "PCIe 4.0/NVMe", capacity: 250, nand: "TLC", read: 3600, write: 3000, price: 692445, warranty: 5 },
    { name: "Patriot P300", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2100, write: 1650, price: 485000, warranty: 3 },
    { name: "PNY CS1030", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2100, write: 1900, price: 350000, warranty: 5 },
    { name: "Silicon Power P34A", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2200, write: 1600, price: 480000, warranty: 5 },
    { name: "Team MP33", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 1800, write: 1500, price: 391000, warranty: 5 },
    { name: "Team Z44L", interface: "PCIe 4.0/NVMe", capacity: 250, nand: "TLC", read: 3500, write: 3000, price: 545000, warranty: 5 },
    { name: "WD SN550", interface: "PCIe 3.0/NVMe", capacity: 250, nand: "TLC", read: 2400, write: 1950, price: 525000, warranty: 5 },
    { name: "ADATA Legend 710", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "QLC", read: 2100, write: 1000, price: 367000, warranty: 3 },
    { name: "Lexar NM620", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 3300, write: 1300, price: 446500, warranty: 5 },
    { name: "Kingston NV1", interface: "PCIe 3.0/NVMe", capacity: 250, nand: "QLC", read: 2100, write: 1700, price: 489000, warranty: 3 },
    { name: "RX7 NVMe", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 2400, write: 1700, price: 383000, warranty: 3 },
    { name: "Kyo X30", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 3200, write: 1350, price: 420000, warranty: 5 },
    { name: "PNY CS1031", interface: "PCIe 3.0/NVMe", capacity: 256, nand: "TLC", read: 1700, write: 1100, price: 445000, warranty: 5 }
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

function generateForms() {
    numAlternatives = parseInt(document.getElementById('numAlternatives').value);

    let html = '';
    for (let i = 0; i < numAlternatives; i++) {
        // Use sample data if available, otherwise use defaults
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

        html += `
        <div class="alternative-card" id="card_${i}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0;">SSD Alternatif ${i + 1}</h4>
                <button class="delete-btn" onclick="deleteAlternative(${i})" style="background: #dc3545; padding: 8px 15px; font-size: 0.9em;">🗑️ Hapus</button>
            </div>
            <div class="form-grid">
                <div class="form-field">
                    <label>Nama Alternatif:</label>
                    <input type="text" id="alt_name_${i}" placeholder="contoh: Samsung 990 PRO" value="${sampleData.name}">
                </div>
                <div class="form-field">
                    <label>Interface:</label>
                    <select id="alt_interface_${i}">
                        <option value="PCIe 3.0/NVMe" ${sampleData.interface === "PCIe 3.0/NVMe" ? "selected" : ""}>PCIe 3.0/NVMe</option>
                        <option value="PCIe 4.0/NVMe" ${sampleData.interface === "PCIe 4.0/NVMe" ? "selected" : ""}>PCIe 4.0/NVMe</option>
                        <option value="PCIe 5.0/NVMe" ${sampleData.interface === "PCIe 5.0/NVMe" ? "selected" : ""}>PCIe 5.0/NVMe</option>
                    </select>
                </div>
                <div class="form-field">
                    <label>Capacity (GB):</label>
                    <input type="number" id="alt_capacity_${i}" placeholder="contoh: 256" value="${sampleData.capacity}" step="1">
                </div>
                <div class="form-field">
                    <label>NAND Type:</label>
                    <select id="alt_nand_${i}">
                        <option value="QLC" ${sampleData.nand === "QLC" ? "selected" : ""}>QLC</option>
                        <option value="TLC" ${sampleData.nand === "TLC" ? "selected" : ""}>TLC</option>
                        <option value="MLC" ${sampleData.nand === "MLC" ? "selected" : ""}>MLC</option>
                        <option value="SLC" ${sampleData.nand === "SLC" ? "selected" : ""}>SLC</option>
                    </select>
                </div>
                <div class="form-field">
                    <label>Read Speed (MB/s):</label>
                    <input type="number" id="alt_read_${i}" placeholder="contoh: 2100" value="${sampleData.read}" step="1">
                </div>
                <div class="form-field">
                    <label>Write Speed (MB/s):</label>
                    <input type="number" id="alt_write_${i}" placeholder="contoh: 2000" value="${sampleData.write}" step="1">
                </div>
                <div class="form-field">
                    <label>Price:</label>
                    <input type="number" id="alt_price_${i}" placeholder="contoh: 150000" value="${sampleData.price}" step="1000">
                </div>
                <div class="form-field">
                    <label>Warranty (Years):</label>
                    <input type="number" id="alt_warranty_${i}" placeholder="contoh: 5" value="${sampleData.warranty}" step="0.1">
                </div>
            </div>
        </div>`;
    }
    document.getElementById('alternativeForms').innerHTML = html;
    document.getElementById('alternativesSection').style.display = 'block';
}

function deleteAlternative(index) {
    const card = document.getElementById(`card_${index}`);
    if (card) {
        if (confirm(`Apakah Anda yakin ingin menghapus "${document.getElementById(`alt_name_${index}`).value}"?`)) {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            setTimeout(() => {
                card.remove();
                numAlternatives--;
                // Update the alternatives count
                document.getElementById('numAlternatives').value = numAlternatives;
            }, 300);
        }
    }
}

async function calculateTOPSIS() {
    if (weights.length === 0) {
        alert('Weights not found! Please complete AHP first.');
        return;
    }

    // Collect all alternative data (only from visible cards)
    let rawData = [];
    const cards = document.querySelectorAll('.alternative-card');

    cards.forEach((card, index) => {
        const cardId = card.id.split('_')[1];
        const nameInput = document.getElementById(`alt_name_${cardId}`);

        if (nameInput) { // Only collect if element exists
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

    if (rawData.length === 0) {
        alert('Tidak ada data alternatif yang tersedia!');
        return;
    }

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

            // Update progress bar
            document.querySelectorAll('.progress-step')[2].classList.add('completed');

            // Scroll to results
            document.getElementById('topsisSection').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error calculating TOPSIS: ' + error);
    }
}

function displayTOPSISResults(results, rawData) {
    let resultsHTML = '<h3>Hasil Perhitungan TOPSIS:</h3>';

    // Final Ranking Table
    resultsHTML += '<div class="result-item"><strong>🏆 Peringkat Final:</strong>';
    resultsHTML += '<table><thead><tr><th>Rank</th><th>Model SSD</th><th>Closeness Score</th><th>Interface</th><th>Capacity</th><th>NAND</th><th>Read</th><th>Write</th><th>Price</th><th>Warranty</th></tr></thead><tbody>';

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
            <td>${parseFloat(item.price).toLocaleString()}</td>
            <td>${item.warranty} years</td>
        </tr>`;
    }
    resultsHTML += '</tbody></table></div>';

    // Separation measures
    resultsHTML += '<div class="result-item"><strong>Separation dari Positive Ideal (S+):</strong><ul>';
    for (let i = 0; i < rawData.length; i++) {
        resultsHTML += `<li>${rawData[i].name}: ${results.positive_separation[i].toFixed(4)}</li>`;
    }
    resultsHTML += '</ul></div>';

    resultsHTML += '<div class="result-item"><strong>Separation dari Negative Ideal (S-):</strong><ul>';
    for (let i = 0; i < rawData.length; i++) {
        resultsHTML += `<li>${rawData[i].name}: ${results.negative_separation[i].toFixed(4)}</li>`;
    }
    resultsHTML += '</ul></div>';

    document.getElementById('topsisResults').innerHTML = resultsHTML;
}

function goBackToPage1() {
    window.location.href = '/';
}

// Initialize on page load
window.onload = function () {
    loadWeights();
    generateForms();
};