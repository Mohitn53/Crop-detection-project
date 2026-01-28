/**
 * Plant Disease Solutions Database
 * Stores comprehensive treatment and prevention methods for various plant diseases
 */

const diseaseSolutions = {
  // TOMATO DISEASES
  "Tomato___Early_blight": {
    crop: "Tomato",
    disease: "Early Blight",
    severity: "Medium",
    india: {
      organic: [
        "Neem oil spray (3 ml/L water)",
        "Remove and destroy infected leaves immediately",
        "Spray with Trichoderma viride (5-10 g/L)",
        "Apply Bordeaux mixture (1%)",
        "Use copper-based fungicides"
      ],
      chemical: [
        "Mancozeb 75% WP (2 g/L water)",
        "Chlorothalonil 75% WP (2 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)",
        "Difenoconazole 25% EC (0.5 ml/L)"
      ],
      prevention: [
        "Avoid overhead irrigation",
        "Ensure proper plant spacing for air circulation",
        "Crop rotation with non-solanaceous crops",
        "Mulching to prevent soil splash",
        "Remove plant debris after harvest"
      ]
    }
  },

  "Tomato___Late_blight": {
    crop: "Tomato",
    disease: "Late Blight",
    severity: "High",
    india: {
      organic: [
        "Copper oxychloride spray (3 g/L)",
        "Bordeaux mixture (1%) spray",
        "Remove infected plants immediately",
        "Use resistant varieties"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Cymoxanil + Mancozeb (2 g/L)",
        "Metalaxyl 8% + Mancozeb 64% WP (2.5 g/L)",
        "Dimethomorph 50% WP (1 g/L)"
      ],
      prevention: [
        "Plant resistant varieties",
        "Avoid wet foliage - irrigate in morning",
        "Ensure proper drainage",
        "Wide plant spacing",
        "Destroy volunteer plants and crop residue"
      ]
    }
  },

  "Tomato___Bacterial_spot": {
    crop: "Tomato",
    disease: "Bacterial Spot",
    severity: "Medium",
    india: {
      organic: [
        "Copper-based bactericides (2-3 g/L)",
        "Remove infected plant parts",
        "Use disease-free seeds",
        "Neem oil spray"
      ],
      chemical: [
        "Streptocycline 90% + Copper oxychloride 50% (0.3 g/L)",
        "Copper hydroxide (2 g/L)",
        "Kasugamycin 3% SL (2 ml/L)"
      ],
      prevention: [
        "Use certified disease-free seeds",
        "Avoid overhead irrigation",
        "Sanitize tools between plants",
        "Crop rotation for 2-3 years",
        "Remove weeds that harbor bacteria"
      ]
    }
  },

  "Tomato___Leaf_Mold": {
    crop: "Tomato",
    disease: "Leaf Mold",
    severity: "Medium",
    india: {
      organic: [
        "Improve air circulation",
        "Remove infected leaves",
        "Baking soda spray (5 g/L + few drops soap)",
        "Neem oil application"
      ],
      chemical: [
        "Chlorothalonil 75% WP (2 g/L)",
        "Mancozeb 75% WP (2 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)"
      ],
      prevention: [
        "Ensure good ventilation in greenhouse",
        "Reduce humidity levels",
        "Avoid overhead watering",
        "Use resistant varieties",
        "Proper plant spacing"
      ]
    }
  },

  "Tomato___Septoria_leaf_spot": {
    crop: "Tomato",
    disease: "Septoria Leaf Spot",
    severity: "Medium",
    india: {
      organic: [
        "Copper-based fungicide spray",
        "Remove infected lower leaves",
        "Compost tea spray",
        "Neem oil application"
      ],
      chemical: [
        "Mancozeb 75% WP (2 g/L)",
        "Chlorothalonil 75% WP (2 g/L)",
        "Azoxystrobin + Difenoconazole (1 ml/L)"
      ],
      prevention: [
        "Mulch around plants",
        "Water at base of plants only",
        "Stake plants for air circulation",
        "3-year crop rotation",
        "Remove plant debris"
      ]
    }
  },

  // POTATO DISEASES
  "Potato___Early_blight": {
    crop: "Potato",
    disease: "Early Blight",
    severity: "Medium",
    india: {
      organic: [
        "Neem oil spray (3 ml/L)",
        "Copper-based fungicides",
        "Remove infected foliage",
        "Trichoderma application to soil"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Chlorothalonil 75% WP (2 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)",
        "Difenoconazole 25% EC (0.5 ml/L)"
      ],
      prevention: [
        "Use certified disease-free seed potatoes",
        "Crop rotation (3-4 years)",
        "Hill up soil around plants",
        "Balanced fertilization",
        "Destroy crop residue after harvest"
      ]
    }
  },

  "Potato___Late_blight": {
    crop: "Potato",
    disease: "Late Blight",
    severity: "Very High",
    india: {
      organic: [
        "Copper oxychloride (3 g/L) - preventive",
        "Bordeaux mixture spray",
        "Destroy infected plants immediately",
        "Use resistant varieties"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Metalaxyl + Mancozeb (2.5 g/L)",
        "Cymoxanil + Mancozeb (2 g/L)",
        "Dimethomorph + Pyraclostrobin (1.5 ml/L)"
      ],
      prevention: [
        "Plant certified disease-free tubers",
        "Early planting to avoid monsoon",
        "Earthing up properly",
        "Monitor weather for disease-favorable conditions",
        "Destroy cull piles and volunteers"
      ]
    }
  },

  // PEPPER DISEASES
  "Pepper,_bell___Bacterial_spot": {
    crop: "Bell Pepper",
    disease: "Bacterial Spot",
    severity: "Medium",
    india: {
      organic: [
        "Copper-based bactericides (2 g/L)",
        "Remove and destroy infected plants",
        "Use disease-free seeds and transplants",
        "Neem oil spray"
      ],
      chemical: [
        "Streptocycline + Copper oxychloride (0.3 g/L)",
        "Copper hydroxide (2 g/L)",
        "Kasugamycin 3% SL (2 ml/L)"
      ],
      prevention: [
        "Use certified pathogen-free seeds",
        "Avoid working with wet plants",
        "Drip irrigation instead of overhead",
        "2-3 year crop rotation",
        "Sanitize tools and equipment"
      ]
    }
  },

  // APPLE DISEASES
  "Apple___Apple_scab": {
    crop: "Apple",
    disease: "Apple Scab",
    severity: "High",
    india: {
      organic: [
        "Sulfur-based fungicides",
        "Neem oil spray",
        "Remove fallen leaves (harbor spores)",
        "Prune for better air circulation"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Captan 50% WP (2 g/L)",
        "Dodine 65% WP (1 g/L)",
        "Myclobutanil 10% WP (0.5 g/L)"
      ],
      prevention: [
        "Plant resistant varieties",
        "Rake and destroy fallen leaves",
        "Prune to improve air flow",
        "Apply dormant spray in early spring",
        "Avoid overhead irrigation"
      ]
    }
  },

  "Apple___Black_rot": {
    crop: "Apple",
    disease: "Black Rot",
    severity: "High",
    india: {
      organic: [
        "Prune out infected branches",
        "Remove mummified fruits",
        "Copper-based fungicides",
        "Improve orchard sanitation"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Captan 50% WP (2 g/L)",
        "Thiophanate-methyl 70% WP (1 g/L)",
        "Ziram 76% WP (2 g/L)"
      ],
      prevention: [
        "Remove all mummies and cankers",
        "Prune dead wood",
        "Maintain tree vigor with proper nutrition",
        "Avoid tree stress",
        "Regular monitoring and early treatment"
      ]
    }
  },

  "Apple___Cedar_apple_rust": {
    crop: "Apple",
    disease: "Cedar Apple Rust",
    severity: "Medium",
    india: {
      organic: [
        "Remove nearby cedar/juniper trees if possible",
        "Sulfur spray",
        "Neem oil application",
        "Plant resistant varieties"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Myclobutanil 10% WP (0.5 g/L)",
        "Propiconazole 25% EC (1 ml/L)"
      ],
      prevention: [
        "Plant resistant apple varieties",
        "Remove cedar/juniper within 2-mile radius",
        "Apply fungicides during spore release period",
        "Monitor weather conditions"
      ]
    }
  },

  // GRAPE DISEASES
  "Grape___Black_rot": {
    crop: "Grape",
    disease: "Black Rot",
    severity: "High",
    india: {
      organic: [
        "Remove infected berries and leaves",
        "Copper-based fungicides",
        "Bordeaux mixture spray",
        "Improve air circulation through pruning"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Captan 50% WP (2 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)",
        "Myclobutanil 10% WP (0.5 g/L)"
      ],
      prevention: [
        "Remove mummified berries",
        "Prune for air circulation",
        "Remove infected plant parts promptly",
        "Apply fungicides from bud break to harvest",
        "Clean up fallen debris"
      ]
    }
  },

  "Grape___Esca_(Black_Measles)": {
    crop: "Grape",
    disease: "Esca (Black Measles)",
    severity: "High",
    india: {
      organic: [
        "Remove severely infected vines",
        "Prune out dead wood",
        "Trichoderma treatment",
        "Improve vine nutrition"
      ],
      chemical: [
        "Sodium arsenite (restricted use)",
        "Protective fungicides during pruning wounds",
        "Copper-based compounds on cuts"
      ],
      prevention: [
        "Use proper pruning techniques",
        "Avoid large pruning wounds",
        "Disinfect pruning tools",
        "Maintain vine vigor",
        "Remove dead wood annually"
      ]
    }
  },

  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    crop: "Grape",
    disease: "Leaf Blight",
    severity: "Medium",
    india: {
      organic: [
        "Remove infected leaves",
        "Neem oil spray",
        "Copper-based fungicides",
        "Improve air circulation"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Carbendazim 50% WP (1 g/L)",
        "Hexaconazole 5% SC (2 ml/L)"
      ],
      prevention: [
        "Canopy management for air flow",
        "Remove lower leaves near soil",
        "Avoid overhead irrigation",
        "Balanced fertilization",
        "Timely fungicide applications"
      ]
    }
  },

  // CORN DISEASES
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    crop: "Corn (Maize)",
    disease: "Gray Leaf Spot",
    severity: "Medium",
    india: {
      organic: [
        "Crop rotation with non-cereals",
        "Remove crop debris",
        "Use resistant hybrids",
        "Trichoderma seed treatment"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)",
        "Propiconazole 25% EC (1 ml/L)",
        "Pyraclostrobin + Epoxiconazole (1 ml/L)"
      ],
      prevention: [
        "Plant resistant varieties",
        "Crop rotation (2-3 years)",
        "Bury crop residue by tillage",
        "Balanced nitrogen application",
        "Timely planting"
      ]
    }
  },

  "Corn_(maize)___Common_rust_": {
    crop: "Corn (Maize)",
    disease: "Common Rust",
    severity: "Low to Medium",
    india: {
      organic: [
        "Plant resistant varieties",
        "Remove infected leaves",
        "Sulfur dust application",
        "Neem oil spray"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Propiconazole 25% EC (1 ml/L)",
        "Azoxystrobin 23% SC (1 ml/L)"
      ],
      prevention: [
        "Use resistant hybrids",
        "Early planting to avoid peak infection",
        "Balanced fertilization",
        "Monitor fields regularly",
        "Apply fungicides if severe"
      ]
    }
  },

  "Corn_(maize)___Northern_Leaf_Blight": {
    crop: "Corn (Maize)",
    disease: "Northern Leaf Blight",
    severity: "Medium to High",
    india: {
      organic: [
        "Crop rotation",
        "Bury crop residue",
        "Use resistant varieties",
        "Trichoderma application"
      ],
      chemical: [
        "Mancozeb 75% WP (2.5 g/L)",
        "Carbendazim 50% WP (1 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)",
        "Propiconazole 25% EC (1 ml/L)"
      ],
      prevention: [
        "Plant resistant hybrids",
        "Crop rotation with non-cereals",
        "Deep plowing to bury debris",
        "Avoid excessive nitrogen",
        "Timely sowing"
      ]
    }
  },

  // PEACH DISEASES
  "Peach___Bacterial_spot": {
    crop: "Peach",
    disease: "Bacterial Spot",
    severity: "Medium to High",
    india: {
      organic: [
        "Copper-based bactericides",
        "Prune for air circulation",
        "Remove infected fruit",
        "Plant resistant varieties"
      ],
      chemical: [
        "Copper hydroxide (2-3 g/L)",
        "Streptomycin sulfate (0.1 g/L) - limited use",
        "Oxytetracycline"
      ],
      prevention: [
        "Plant resistant cultivars",
        "Avoid overhead irrigation",
        "Prune to improve air flow",
        "Remove infected branches",
        "Windbreaks to reduce leaf injury"
      ]
    }
  },

  // STRAWBERRY DISEASES
  "Strawberry___Leaf_scorch": {
    crop: "Strawberry",
    disease: "Leaf Scorch",
    severity: "Medium",
    india: {
      organic: [
        "Remove infected leaves",
        "Neem oil spray",
        "Improve air circulation",
        "Use certified disease-free plants"
      ],
      chemical: [
        "Mancozeb 75% WP (2 g/L)",
        "Captan 50% WP (2 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)"
      ],
      prevention: [
        "Use certified disease-free planting stock",
        "Remove old leaves after harvest",
        "Proper plant spacing",
        "Drip irrigation",
        "Rotate planting areas"
      ]
    }
  },

  // ORANGE DISEASES
  "Orange___Haunglongbing_(Citrus_greening)": {
    crop: "Orange/Citrus",
    disease: "Huanglongbing (Citrus Greening)",
    severity: "Very High (Fatal)",
    india: {
      organic: [
        "Remove and destroy infected trees immediately",
        "Control psyllid vectors with neem oil",
        "Use disease-free planting material",
        "Nutritional therapy (foliar zinc, manganese)"
      ],
      chemical: [
        "Imidacloprid for psyllid control (0.3 ml/L)",
        "Thiamethoxam for vector management",
        "No cure exists - focus on vector control",
        "Micronutrient sprays to support tree health"
      ],
      prevention: [
        "Plant only certified disease-free nursery stock",
        "Intensive psyllid monitoring and control",
        "Remove infected trees immediately",
        "Use reflective mulches to repel psyllids",
        "Quarantine measures in new plantings"
      ]
    }
  },

  // SQUASH DISEASES
  "Squash___Powdery_mildew": {
    crop: "Squash",
    disease: "Powdery Mildew",
    severity: "Medium",
    india: {
      organic: [
        "Baking soda spray (5 g/L + soap drops)",
        "Neem oil application (3 ml/L)",
        "Milk spray (1:9 milk to water ratio)",
        "Sulfur dust application"
      ],
      chemical: [
        "Sulfex (Sulfur 80% WP) (3 g/L)",
        "Hexaconazole 5% SC (2 ml/L)",
        "Carbendazim 50% WP (1 g/L)",
        "Azoxystrobin 23% SC (1 ml/L)"
      ],
      prevention: [
        "Plant resistant varieties",
        "Ensure proper air circulation",
        "Avoid overhead watering",
        "Remove infected leaves",
        "Apply preventive fungicides"
      ]
    }
  },

  // CHERRY DISEASES
  "Cherry_(including_sour)___Powdery_mildew": {
    crop: "Cherry",
    disease: "Powdery Mildew",
    severity: "Medium",
    india: {
      organic: [
        "Sulfur spray",
        "Neem oil application",
        "Prune for air circulation",
        "Baking soda solution"
      ],
      chemical: [
        "Sulfex 80% WP (3 g/L)",
        "Myclobutanil 10% WP (0.5 g/L)",
        "Propiconazole 25% EC (1 ml/L)",
        "Trifloxystrobin + Tebuconazole (0.5 ml/L)"
      ],
      prevention: [
        "Plant resistant varieties",
        "Prune to improve air flow",
        "Avoid excessive nitrogen",
        "Remove infected shoots",
        "Preventive fungicide applications"
      ]
    }
  }
};

// HEALTHY PLANT RESPONSES
const healthyResponses = {
  "Tomato___healthy": {
    crop: "Tomato",
    disease: "Healthy",
    severity: "None",
    message: "Your tomato plant appears healthy! Keep up the good practices.",
    maintenance: [
      "Continue regular watering (avoid wetting leaves)",
      "Maintain balanced fertilization",
      "Monitor for early signs of pests or diseases",
      "Ensure proper plant spacing",
      "Prune suckers for better air circulation"
    ]
  },
  "Potato___healthy": {
    crop: "Potato",
    disease: "Healthy",
    severity: "None",
    message: "Your potato plant is healthy!",
    maintenance: [
      "Continue proper hilling",
      "Maintain consistent soil moisture",
      "Monitor for Colorado potato beetles",
      "Apply balanced NPK fertilizer",
      "Harvest at proper maturity"
    ]
  },
  "Apple___healthy": {
    crop: "Apple",
    disease: "Healthy",
    severity: "None",
    message: "Your apple tree appears healthy!",
    maintenance: [
      "Continue annual pruning",
      "Monitor for pest activity",
      "Apply dormant oil spray in spring",
      "Maintain proper tree nutrition",
      "Remove fallen fruit and leaves"
    ]
  },
  "Grape___healthy": {
    crop: "Grape",
    disease: "Healthy",
    severity: "None",
    message: "Your grape vine is healthy!",
    maintenance: [
      "Continue proper canopy management",
      "Maintain adequate spacing between vines",
      "Monitor for fungal diseases",
      "Proper pruning in dormant season",
      "Balanced fertilization"
    ]
  },
  "Pepper,_bell___healthy": {
    crop: "Bell Pepper",
    disease: "Healthy",
    severity: "None",
    message: "Your bell pepper plant is healthy!",
    maintenance: [
      "Continue consistent watering",
      "Apply balanced fertilizer",
      "Monitor for aphids and other pests",
      "Mulch to maintain soil moisture",
      "Provide support if needed"
    ]
  },
  "Corn_(maize)___healthy": {
    crop: "Corn (Maize)",
    disease: "Healthy",
    severity: "None",
    message: "Your corn plant is healthy!",
    maintenance: [
      "Ensure adequate water during tasseling",
      "Side-dress with nitrogen",
      "Monitor for corn borers",
      "Maintain weed control",
      "Check for adequate pollination"
    ]
  },
  "Peach___healthy": {
    crop: "Peach",
    disease: "Healthy",
    severity: "None",
    message: "Your peach tree is healthy!",
    maintenance: [
      "Continue annual pruning",
      "Monitor for brown rot",
      "Thin fruits for better size",
      "Apply balanced fertilizer in spring",
      "Protect from late frost"
    ]
  },
  "Strawberry___healthy": {
    crop: "Strawberry",
    disease: "Healthy",
    severity: "None",
    message: "Your strawberry plant is healthy!",
    maintenance: [
      "Remove runners if not needed",
      "Mulch around plants",
      "Monitor for gray mold",
      "Adequate watering during fruit development",
      "Renew beds every 3-4 years"
    ]
  },
  "Blueberry___healthy": {
    crop: "Blueberry",
    disease: "Healthy",
    severity: "None",
    message: "Your blueberry plant is healthy!",
    maintenance: [
      "Maintain acidic soil pH (4.5-5.5)",
      "Mulch with pine needles or sawdust",
      "Prune old wood in winter",
      "Adequate water during fruit development",
      "Monitor for mummy berry"
    ]
  },
  "Cherry_(including_sour)___healthy": {
    crop: "Cherry",
    disease: "Healthy",
    severity: "None",
    message: "Your cherry tree is healthy!",
    maintenance: [
      "Annual pruning to maintain shape",
      "Monitor for cherry fruit fly",
      "Net trees to protect from birds",
      "Apply balanced fertilizer",
      "Remove water sprouts"
    ]
  },
  "Raspberry___healthy": {
    crop: "Raspberry",
    disease: "Healthy",
    severity: "None",
    message: "Your raspberry canes are healthy!",
    maintenance: [
      "Prune out fruited canes after harvest",
      "Thin new canes in spring",
      "Maintain adequate moisture",
      "Monitor for Japanese beetles",
      "Apply mulch to suppress weeds"
    ]
  },
  "Soybean___healthy": {
    crop: "Soybean",
    disease: "Healthy",
    severity: "None",
    message: "Your soybean plants are healthy!",
    maintenance: [
      "Monitor for soybean aphids",
      "Ensure adequate potassium",
      "Scout for stink bugs during pod fill",
      "Maintain good weed control",
      "Inoculate seeds with Rhizobium"
    ]
  }
};

/**
 * Get treatment solution for a detected disease
 * @param {string} diseaseLabel - The disease label from model prediction (e.g., "Tomato___Early_blight")
 * @returns {object} Treatment solutions or appropriate message if not found
 */
function getSolution(diseaseLabel) {
  // Normalize the label
  const normalizedLabel = diseaseLabel.trim();

  // Check if it's a healthy plant
  if (normalizedLabel.toLowerCase().includes('healthy') || healthyResponses[normalizedLabel]) {
    return healthyResponses[normalizedLabel] || {
      crop: normalizedLabel.split('___')[0],
      disease: "Healthy",
      severity: "None",
      message: "Your plant appears healthy! Continue with good agricultural practices.",
      maintenance: [
        "Maintain regular monitoring",
        "Ensure proper watering and nutrition",
        "Keep the area clean and weed-free"
      ]
    };
  }

  // Check if solution exists for the disease
  if (diseaseSolutions[normalizedLabel]) {
    return diseaseSolutions[normalizedLabel];
  }

  // If no solution found, return appropriate message
  const parts = normalizedLabel.split('___');
  const crop = parts[0] || "Unknown";
  const disease = parts[1] || normalizedLabel;

  return {
    crop: crop,
    disease: disease,
    severity: "Unknown",
    message: `No specific solution available for "${disease}" in ${crop}.`,
    recommendation: "Please consult with a local agricultural extension officer or plant pathologist for proper diagnosis and treatment.",
    general_advice: {
      immediate_actions: [
        "Isolate affected plants if possible",
        "Document symptoms with photos",
        "Collect samples for laboratory diagnosis",
        "Avoid spreading to healthy plants"
      ],
      contact: [
        "Nearest Krishi Vigyan Kendra (KVK)",
        "State Agricultural University",
        "ICAR institutes",
        "Local agricultural extension services"
      ]
    }
  };
}

/**
 * Export functions for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    diseaseSolutions,
    healthyResponses,
    getSolution
  };
}
