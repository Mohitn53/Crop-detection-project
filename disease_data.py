
# Disease Solutions Database
DISEASE_SOLUTIONS = {
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "severity": "Medium",
        "organic": [
            "Neem oil spray (3 ml/L water)",
            "Remove and destroy infected leaves immediately",
            "Spray with Trichoderma viride (5-10 g/L)",
            "Apply Bordeaux mixture (1%)"
        ],
        "chemical": [
            "Mancozeb 75% WP (2 g/L water)",
            "Chlorothalonil 75% WP (2 g/L)",
            "Azoxystrobin 23% SC (1 ml/L)"
        ],
        "prevention": [
            "Avoid overhead irrigation",
            "Ensure proper plant spacing for air circulation",
            "Crop rotation with non-solanaceous crops",
            "Mulching to prevent soil splash"
        ]
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "severity": "High",
        "organic": [
            "Copper oxychloride spray (3 g/L)",
            "Bordeaux mixture (1%) spray",
            "Remove infected plants immediately"
        ],
        "chemical": [
            "Mancozeb 75% WP (2.5 g/L)",
            "Cymoxanil + Mancozeb (2 g/L)",
            "Metalaxyl 8% + Mancozeb 64% WP (2.5 g/L)"
        ],
        "prevention": [
            "Plant resistant varieties",
            "Avoid wet foliage - irrigate in morning",
            "Ensure proper drainage",
            "Destroy volunteer plants and crop residue"
        ]
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "severity": "Medium",
        "organic": [
            "Copper-based bactericides (2-3 g/L)",
            "Remove infected plant parts",
            "Neem oil spray"
        ],
        "chemical": [
            "Streptocycline 90% + Copper oxychloride 50% (0.3 g/L)",
            "Copper hydroxide (2 g/L)"
        ],
        "prevention": [
            "Use certified disease-free seeds",
            "Avoid overhead irrigation",
            "Crop rotation for 2-3 years"
        ]
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "severity": "Medium",
        "organic": [
            "Neem oil spray (3 ml/L)",
            "Copper-based fungicides",
            "Remove infected foliage"
        ],
        "chemical": [
            "Mancozeb 75% WP (2.5 g/L)",
            "Chlorothalonil 75% WP (2 g/L)",
            "Azoxystrobin 23% SC (1 ml/L)"
        ],
        "prevention": [
            "Use certified disease-free seed potatoes",
            "Crop rotation (3-4 years)",
            "Hill up soil around plants"
        ]
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight",
        "severity": "Very High",
        "organic": [
            "Copper oxychloride (3 g/L) - preventive",
            "Destroy infected plants immediately"
        ],
        "chemical": [
            "Mancozeb 75% WP (2.5 g/L)",
            "Metalaxyl + Mancozeb (2.5 g/L)",
            "Cymoxanil + Mancozeb (2 g/L)"
        ],
        "prevention": [
            "Plant certified disease-free tubers",
            "Early planting to avoid monsoon",
            "Monitor weather for disease-favorable conditions"
        ]
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease": "Black Rot",
        "severity": "High",
        "organic": [
            "Prune out infected branches",
            "Remove mummified fruits",
            "Copper-based fungicides"
        ],
        "chemical": [
            "Mancozeb 75% WP (2.5 g/L)",
            "Captan 50% WP (2 g/L)",
            "Thiophanate-methyl 70% WP (1 g/L)"
        ],
        "prevention": [
            "Remove all mummies and cankers",
            "Prune dead wood",
            "Maintain tree vigor with proper nutrition"
        ]
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Bell Pepper",
        "disease": "Bacterial Spot",
        "severity": "Medium",
        "organic": [
            "Copper-based bactericides (2 g/L)",
            "Remove and destroy infected plants",
            "Neem oil spray"
        ],
        "chemical": [
            "Streptocycline + Copper oxychloride (0.3 g/L)",
            "Copper hydroxide (2 g/L)"
        ],
        "prevention": [
            "Use certified pathogen-free seeds",
            "Avoid working with wet plants",
            "2-3 year crop rotation"
        ]
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease": "Black Rot",
        "severity": "High",
        "organic": [
            "Remove infected berries and leaves",
            "Copper-based fungicides",
            "Bordeaux mixture spray"
        ],
        "chemical": [
            "Mancozeb 75% WP (2.5 g/L)",
            "Captan 50% WP (2 g/L)",
            "Azoxystrobin 23% SC (1 ml/L)"
        ],
        "prevention": [
            "Remove mummified berries",
            "Prune for air circulation",
            "Apply fungicides from bud break to harvest"
        ]
    }
}

# Healthy plant responses
HEALTHY_RESPONSES = {
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy",
        "message": "Your tomato plant appears healthy! Keep up the good practices.",
        "maintenance": [
            "Continue regular watering (avoid wetting leaves)",
            "Maintain balanced fertilization",
            "Monitor for early signs of pests or diseases",
            "Prune suckers for better air circulation"
        ]
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy",
        "message": "Your potato plant is healthy!",
        "maintenance": [
            "Continue proper hilling",
            "Maintain consistent soil moisture",
            "Monitor for Colorado potato beetles",
            "Apply balanced NPK fertilizer"
        ]
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease": "Healthy",
        "message": "Your apple tree appears healthy!",
        "maintenance": [
            "Continue annual pruning",
            "Monitor for pest activity",
            "Apply dormant oil spray in spring",
            "Remove fallen fruit and leaves"
        ]
    },
    "Pepper,_bell___healthy": {
        "crop": "Bell Pepper",
        "disease": "Healthy",
        "message": "Your bell pepper plant is healthy!",
        "maintenance": [
            "Continue consistent watering",
            "Apply balanced fertilizer",
            "Monitor for aphids and other pests",
            "Mulch to maintain soil moisture"
        ]
    }
}
