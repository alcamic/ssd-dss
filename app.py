from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

class AHP:
    """Analytical Hierarchy Process for calculating criteria weights"""
    
    def __init__(self, pairwise_matrix):
        self.matrix = np.array(pairwise_matrix, dtype=float)
        self.n = len(self.matrix)
    
    def calculate_weights(self):
        """Calculate weights using eigenvector method"""
        # Normalize each column
        column_sums = self.matrix.sum(axis=0)
        normalized_matrix = self.matrix / column_sums
        
        # Calculate average of each row (weights)
        weights = normalized_matrix.mean(axis=1)
        return weights
    
    def calculate_consistency_ratio(self):
        """Calculate Consistency Ratio to check matrix consistency"""
        weights = self.calculate_weights()
        
        # Calculate weighted sum vector
        weighted_sum = self.matrix.dot(weights)
        
        # Calculate lambda max
        lambda_max = (weighted_sum / weights).mean()
        
        # Calculate Consistency Index (CI)
        ci = (lambda_max - self.n) / (self.n - 1)
        
        # Random Index (RI) values for different matrix sizes
        ri_values = {1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 
                     7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}
        ri = ri_values.get(self.n, 1.49)
        
        # Calculate Consistency Ratio (CR)
        cr = ci / ri if ri != 0 else 0
        
        return cr, lambda_max

class TOPSIS:
    """TOPSIS method for ranking alternatives"""
    
    def __init__(self, decision_matrix, weights, benefit_criteria):
        self.matrix = np.array(decision_matrix, dtype=float)
        self.weights = np.array(weights, dtype=float)
        self.benefit_criteria = benefit_criteria
        self.m, self.n = self.matrix.shape
    
    def normalize_matrix(self):
        """Normalize decision matrix using vector normalization"""
        normalized = np.zeros_like(self.matrix)
        for j in range(self.n):
            norm = np.sqrt(np.sum(self.matrix[:, j] ** 2))
            normalized[:, j] = self.matrix[:, j] / norm if norm != 0 else 0
        return normalized
    
    def weighted_normalized_matrix(self, normalized):
        """Apply weights to normalized matrix"""
        return normalized * self.weights
    
    def ideal_solutions(self, weighted_normalized):
        """Calculate positive and negative ideal solutions"""
        positive_ideal = np.zeros(self.n)
        negative_ideal = np.zeros(self.n)
        
        for j in range(self.n):
            if self.benefit_criteria[j]:  # Benefit criterion
                positive_ideal[j] = weighted_normalized[:, j].max()
                negative_ideal[j] = weighted_normalized[:, j].min()
            else:  # Cost criterion
                positive_ideal[j] = weighted_normalized[:, j].min()
                negative_ideal[j] = weighted_normalized[:, j].max()
        
        return positive_ideal, negative_ideal
    
    def separation_measures(self, weighted_normalized, positive_ideal, negative_ideal):
        """Calculate separation from ideal solutions"""
        positive_separation = np.sqrt(np.sum((positive_ideal - weighted_normalized ) ** 2, axis=1))
        negative_separation = np.sqrt(np.sum((weighted_normalized - negative_ideal) ** 2, axis=1))
        return positive_separation, negative_separation
    
    def relative_closeness(self, positive_separation, negative_separation):
        """Calculate relative closeness to ideal solution"""
        return negative_separation / (positive_separation + negative_separation)
    
    def calculate(self):
        """Execute complete TOPSIS calculation"""
        # Step 1: Normalize
        normalized = self.normalize_matrix()
        
        # Step 2: Weight normalized matrix
        weighted_normalized = self.weighted_normalized_matrix(normalized)
        
        # Step 3: Ideal solutions
        positive_ideal, negative_ideal = self.ideal_solutions(weighted_normalized)
        
        # Step 4: Separation measures
        positive_sep, negative_sep = self.separation_measures(
            weighted_normalized, positive_ideal, negative_ideal
        )
        
        # Step 5: Relative closeness
        closeness = self.relative_closeness(positive_sep, negative_sep)
        
        # Rank alternatives based on maximum closeness
        ranks = np.argsort(np.argsort(-closeness)) + 1
        
        return {
            'normalized_matrix': normalized.tolist(),
            'weighted_normalized_matrix': weighted_normalized.tolist(),
            'positive_ideal': positive_ideal.tolist(),
            'negative_ideal': negative_ideal.tolist(),
            'positive_separation': positive_sep.tolist(),
            'negative_separation': negative_sep.tolist(),
            'closeness': closeness.tolist(),
            'ranks': ranks.tolist()
        }

# Mapping functions for categorical values
def map_interface(value):
    """Map Interface to numerical value (higher is better)"""
    mapping = {
        'PCIe 3.0/NVMe': 1,
        'PCIe 4.0/NVMe': 2,
        'PCIe 5.0/NVMe': 3
    }
    return mapping.get(value, 0)

def map_nand_type(value):
    """Map NAND Type to numerical value (SLC is best)"""
    mapping = {
        'QLC': 1,
        'TLC': 2,
        'MLC': 3,
        'SLC': 4
    }
    return mapping.get(value, 0)

@app.route('/')
def index():
    return render_template('page1_ahp.html')

@app.route('/page2')
def page2():
    return render_template('page2_data.html')

@app.route('/calculate_ahp', methods=['POST'])
def calculate_ahp():
    try:
        data = request.get_json()
        pairwise_matrix = data['pairwise_matrix']
        
        ahp = AHP(pairwise_matrix)
        weights = ahp.calculate_weights()
        cr, lambda_max = ahp.calculate_consistency_ratio()
        
        return jsonify({
            'success': True,
            'weights': weights.tolist(),
            'consistency_ratio': float(cr),
            'lambda_max': float(lambda_max),
            'is_consistent': bool(cr < 0.1)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/calculate_topsis', methods=['POST'])
def calculate_topsis():
    try:
        data = request.get_json()
        raw_data = data['raw_data']
        weights = data['weights']
        
        # Fixed criteria types (benefit=True, cost=False)
        benefit_criteria = [True, True, True, True, True, False, True]
        # Interface, Capacity, NAND Type, Read, Write, Price (cost), Warranty
        
        # Process each alternative
        decision_matrix = []
        for alt in raw_data:
            row = [
                map_interface(alt['interface']),
                float(alt['capacity']) / 100,  # GB divided by 100
                map_nand_type(alt['nand_type']),
                float(alt['read']) / 1000,  # MB/s divided by 1000
                float(alt['write']) / 1000,  # MB/s divided by 1000
                float(alt['price']) / 100000,  # Price divided by 100,000
                float(alt['warranty'])  # Years as is
            ]
            decision_matrix.append(row)
        
        topsis = TOPSIS(decision_matrix, weights, benefit_criteria)
        results = topsis.calculate()
        
        return jsonify({
            'success': True,
            'results': results,
            'processed_matrix': decision_matrix
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)