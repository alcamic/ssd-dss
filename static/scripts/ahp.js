const CRITERIA = ['Interface', 'Capacity', 'NAND Type', 'Read', 'Write', 'Price', 'Warranty'];
const NUM_CRITERIA = 7;
let comparisonValues = {};

function generateComparisonScales() {
    let html = '';
    let comparisonIndex = 0;

    for (let i = 0; i < NUM_CRITERIA; i++) {
        for (let j = i + 1; j < NUM_CRITERIA; j++) {
            comparisonIndex++;
            const key = `${i}_${j}`;

            html += `
            <div class="comparison-item">
                <div class="comparison-header">
                    <span class="comparison-number">#${comparisonIndex}</span>
                    <span class="comparison-label left">${CRITERIA[i]}</span>
                    <span class="equal-indicator">vs</span>
                    <span class="comparison-label right">${CRITERIA[j]}</span>
                </div>
                <div class="scale-container">
                    <!-- Left side (Criteria i more important) -->
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_9L" value="9" onchange="updateComparison('${key}', 9)">
                        <label for="${key}_9L" class="scale-button">9</label>
                        <span class="scale-label">Mutlak</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_8L" value="8" onchange="updateComparison('${key}', 8)">
                        <label for="${key}_8L" class="scale-button">8</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_7L" value="7" onchange="updateComparison('${key}', 7)">
                        <label for="${key}_7L" class="scale-button">7</label>
                        <span class="scale-label">Sangat</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_6L" value="6" onchange="updateComparison('${key}', 6)">
                        <label for="${key}_6L" class="scale-button">6</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_5L" value="5" onchange="updateComparison('${key}', 5)">
                        <label for="${key}_5L" class="scale-button">5</label>
                        <span class="scale-label">Lebih</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_4L" value="4" onchange="updateComparison('${key}', 4)">
                        <label for="${key}_4L" class="scale-button">4</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_3L" value="3" onchange="updateComparison('${key}', 3)">
                        <label for="${key}_3L" class="scale-button">3</label>
                        <span class="scale-label">Sedikit</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_2L" value="2" onchange="updateComparison('${key}', 2)">
                        <label for="${key}_2L" class="scale-button">2</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    
                    <!-- Equal (1) -->
                    <div class="scale-divider"></div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_1" value="1" checked onchange="updateComparison('${key}', 1)">
                        <label for="${key}_1" class="scale-button">1</label>
                        <span class="scale-label">Sama</span>
                    </div>
                    <div class="scale-divider"></div>
                    
                    <!-- Right side (Criteria j more important) -->
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_2R" value="0.5" onchange="updateComparison('${key}', 0.5)">
                        <label for="${key}_2R" class="scale-button">2</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_3R" value="0.333" onchange="updateComparison('${key}', 0.333)">
                        <label for="${key}_3R" class="scale-button">3</label>
                        <span class="scale-label">Sedikit</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_4R" value="0.25" onchange="updateComparison('${key}', 0.25)">
                        <label for="${key}_4R" class="scale-button">4</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_5R" value="0.2" onchange="updateComparison('${key}', 0.2)">
                        <label for="${key}_5R" class="scale-button">5</label>
                        <span class="scale-label">Lebih</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_6R" value="0.167" onchange="updateComparison('${key}', 0.167)">
                        <label for="${key}_6R" class="scale-button">6</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_7R" value="0.143" onchange="updateComparison('${key}', 0.143)">
                        <label for="${key}_7R" class="scale-button">7</label>
                        <span class="scale-label">Sangat</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_8R" value="0.125" onchange="updateComparison('${key}', 0.125)">
                        <label for="${key}_8R" class="scale-button">8</label>
                        <span class="scale-label">Antara</span>
                    </div>
                    <div class="scale-option">
                        <input type="radio" name="comparison_${key}" id="${key}_9R" value="0.111" onchange="updateComparison('${key}', 0.111)">
                        <label for="${key}_9R" class="scale-button">9</label>
                        <span class="scale-label">Mutlak</span>
                    </div>
                </div>
            </div>`;

            // Initialize with value 1 (equal importance)
            comparisonValues[key] = 1;
        }
    }

    document.getElementById('comparisonContainer').innerHTML = html;
}

function updateComparison(key, value) {
    comparisonValues[key] = parseFloat(value);
}

function buildPairwiseMatrix() {
    let matrix = [];

    for (let i = 0; i < NUM_CRITERIA; i++) {
        let row = [];
        for (let j = 0; j < NUM_CRITERIA; j++) {
            if (i === j) {
                row.push(1);
            } else if (i < j) {
                const key = `${i}_${j}`;
                row.push(comparisonValues[key]);
            } else {
                const key = `${j}_${i}`;
                row.push(1 / comparisonValues[key]);
            }
        }
        matrix.push(row);
    }

    return matrix;
}

async function calculateAHP() {
    const matrix = buildPairwiseMatrix();

    try {
        const response = await fetch('/calculate_ahp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pairwise_matrix: matrix })
        });

        const data = await response.json();

        if (data.success) {
            let weights = data.weights;
            let resultsHTML = '<h3>Hasil Perhitungan AHP:</h3>';
            resultsHTML += '<div class="result-item"><strong>Bobot Kriteria:</strong><ul>';
            for (let i = 0; i < NUM_CRITERIA; i++) {
                resultsHTML += `<li><strong>${CRITERIA[i]}:</strong> ${weights[i].toFixed(4)} (${(weights[i] * 100).toFixed(2)}%)</li>`;
            }
            resultsHTML += '</ul></div>';
            resultsHTML += `<div class="result-item"><strong>Lambda Max (λmax):</strong> ${data.lambda_max.toFixed(4)}</div>`;
            resultsHTML += `<div class="result-item"><strong>Consistency Ratio (CR):</strong> ${data.consistency_ratio.toFixed(4)}</div>`;

            if (data.is_consistent) {
                resultsHTML += `<div class="result-item success">✓ Matriks KONSISTEN (CR < 0.1)</div>`;
                resultsHTML += `<br><button class="secondary" onclick="proceedToPage2()">➡️ Lanjut ke Input Data (Page 2)</button>`;

                // Store weights in sessionStorage
                sessionStorage.setItem('ahp_weights', JSON.stringify(weights));
                sessionStorage.setItem('ahp_results', JSON.stringify(data));
            } else {
                resultsHTML += `<div class="result-item warning">⚠ Matriks TIDAK KONSISTEN (CR ≥ 0.1). Silakan revisi perbandingan Anda.</div>`;
            }

            document.getElementById('ahpResults').innerHTML = resultsHTML;
            document.getElementById('ahpResults').style.display = 'block';

            // Scroll to results
            document.getElementById('ahpResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error calculating AHP: ' + error);
    }
}

function proceedToPage2() {
    window.location.href = '/page2';
}

// Initialize on page load
window.onload = function () {
    generateComparisonScales();
};