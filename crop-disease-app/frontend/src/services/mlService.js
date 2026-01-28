// Mock ML Disease Prediction Service
// This simulates the ML model output for hackathon demo

// PlantVillage dataset classes mapped to predictions
const DISEASE_DATABASE = [
  {
    disease: 'Apple Scab',
    plantType: 'Apple',
    severity: 'Medium',
    recommendations: [
      'Remove and destroy all infected leaves and fruit',
      'Apply fungicide spray during early spring',
      'Prune trees to improve air circulation',
      'Water plants at the base, avoid wetting leaves',
      'Use resistant apple varieties for future planting'
    ],
    additionalInfo: {
      symptoms: [
        'Olive-green to brown spots on leaves',
        'Velvety or fuzzy texture on infected areas',
        'Leaves may curl, yellow, and drop early',
        'Scabby lesions on fruit surface',
        'Cracked or deformed fruit'
      ],
      causes: [
        'Fungus Venturia inaequalis',
        'Cool, wet spring weather (60-70°F)',
        'Moisture on leaves for 9+ hours',
        'Overwintering spores in fallen leaves'
      ],
      preventionTips: [
        'Plant scab-resistant varieties',
        'Rake and destroy fallen leaves in autumn',
        'Apply dormant spray before bud break',
        'Maintain proper tree spacing',
        'Use drip irrigation instead of overhead watering'
      ]
    }
  },
  {
    disease: 'Tomato Late Blight',
    plantType: 'Tomato',
    severity: 'High',
    recommendations: [
      'Remove and destroy infected plants immediately',
      'Do not compost infected plant material',
      'Apply copper-based fungicide preventively',
      'Improve air circulation between plants',
      'Avoid overhead irrigation'
    ],
    additionalInfo: {
      symptoms: [
        'Water-soaked, gray-green spots on leaves',
        'White fuzzy growth on leaf undersides',
        'Dark brown lesions on stems',
        'Firm, brown rot on fruit',
        'Rapid plant death in humid conditions'
      ],
      causes: [
        'Oomycete Phytophthora infestans',
        'Cool temperatures (60-70°F)',
        'High humidity and moisture',
        'Spores spread by wind and rain'
      ],
      preventionTips: [
        'Use certified disease-free seeds/transplants',
        'Rotate crops (3+ year rotation)',
        'Stake plants for better airflow',
        'Apply fungicides before symptoms appear',
        'Remove volunteer tomato and potato plants'
      ]
    }
  },
  {
    disease: 'Corn Common Rust',
    plantType: 'Corn (Maize)',
    severity: 'Medium',
    recommendations: [
      'Apply foliar fungicide if infection is early and severe',
      'Plant resistant corn hybrids',
      'Scout fields regularly for early detection',
      'Time planting to avoid peak rust conditions',
      'Ensure adequate plant nutrition'
    ],
    additionalInfo: {
      symptoms: [
        'Circular to elongated reddish-brown pustules',
        'Pustules on both leaf surfaces',
        'Powdery rust-colored spores when rubbed',
        'Pustules turn dark brown/black as they age',
        'Severe cases: premature leaf death'
      ],
      causes: [
        'Fungus Puccinia sorghi',
        'Moderate temperatures (60-77°F)',
        'High humidity and frequent dew',
        'Windborne spores from southern regions'
      ],
      preventionTips: [
        'Select resistant hybrids',
        'Adjust planting dates',
        'Monitor weather forecasts',
        'Scout fields starting at tasseling',
        'Maintain balanced fertilization'
      ]
    }
  },
  {
    disease: 'Grape Black Rot',
    plantType: 'Grape',
    severity: 'High',
    recommendations: [
      'Remove all mummified berries and infected canes',
      'Apply protective fungicides from bud break',
      'Improve canopy management for air flow',
      'Prune vines during dormancy',
      'Keep vineyard floor clean'
    ],
    additionalInfo: {
      symptoms: [
        'Tan circular spots with dark borders on leaves',
        'Black pycnidia (spore structures) in spots',
        'Light brown soft rot on berries',
        'Berries shrivel into hard black mummies',
        'Cankers on shoots and tendrils'
      ],
      causes: [
        'Fungus Guignardia bidwellii',
        'Warm temperatures (80-90°F optimal)',
        'Extended wet periods (6+ hours)',
        'Overwintering mummies on vines/ground'
      ],
      preventionTips: [
        'Sanitation: remove all mummies',
        'Proper trellis and training systems',
        'Timely fungicide applications',
        'Avoid excess nitrogen fertilization',
        'Select less susceptible varieties'
      ]
    }
  },
  {
    disease: 'Potato Early Blight',
    plantType: 'Potato',
    severity: 'Medium',
    recommendations: [
      'Remove infected lower leaves promptly',
      'Apply chlorothalonil or mancozeb fungicides',
      'Maintain adequate nitrogen fertilization',
      'Harvest potatoes at full maturity',
      'Practice crop rotation with non-hosts'
    ],
    additionalInfo: {
      symptoms: [
        'Dark brown spots with concentric rings (target spots)',
        'Yellowing of tissue around spots',
        'Lower/older leaves affected first',
        'Leaf drop and premature defoliation',
        'Sunken dark lesions on tubers'
      ],
      causes: [
        'Fungus Alternaria solani',
        'Warm temperatures (75-84°F)',
        'Alternating wet and dry conditions',
        'Plant stress (drought, nutrient deficiency)'
      ],
      preventionTips: [
        'Use certified disease-free seed potatoes',
        'Proper irrigation management',
        'Adequate fertilization',
        '2-3 year crop rotation',
        'Destroy crop debris after harvest'
      ]
    }
  },
  {
    disease: 'Pepper Bacterial Spot',
    plantType: 'Pepper (Bell)',
    severity: 'High',
    recommendations: [
      'Remove and destroy infected plants',
      'Apply copper-based bactericides',
      'Avoid working with plants when wet',
      'Use drip irrigation',
      'Sanitize all tools and equipment'
    ],
    additionalInfo: {
      symptoms: [
        'Small, water-soaked spots on leaves',
        'Spots become brown with yellow halos',
        'Raised, scab-like lesions on fruit',
        'Leaf drop in severe cases',
        'Stunted plant growth'
      ],
      causes: [
        'Bacteria Xanthomonas campestris',
        'Warm, humid conditions',
        'Splashing water spreads bacteria',
        'Contaminated seeds or transplants'
      ],
      preventionTips: [
        'Use certified disease-free seeds',
        'Hot water seed treatment',
        'Avoid overhead irrigation',
        'Rotate with non-host crops',
        'Control weeds in pepper family'
      ]
    }
  },
  {
    disease: 'Strawberry Leaf Scorch',
    plantType: 'Strawberry',
    severity: 'Medium',
    recommendations: [
      'Remove and destroy infected leaves',
      'Apply fungicides before symptoms appear',
      'Renovate strawberry beds after harvest',
      'Improve air circulation in plantings',
      'Avoid overhead irrigation'
    ],
    additionalInfo: {
      symptoms: [
        'Irregular dark purple spots on leaves',
        'Spots may merge causing "scorched" appearance',
        'Red-purple discoloration between veins',
        'Dried, brown leaf margins',
        'Reduced fruit production'
      ],
      causes: [
        'Fungus Diplocarpon earlianum',
        'Wet, cool weather (60-80°F)',
        'Splashing rain or irrigation',
        'Overcrowded plantings'
      ],
      preventionTips: [
        'Plant resistant varieties',
        'Use clean, certified plants',
        'Proper plant spacing',
        'Mulch to reduce soil splash',
        'Remove old leaves after harvest'
      ]
    }
  },
  {
    disease: 'Healthy Leaf',
    plantType: 'Various',
    severity: 'Low',
    recommendations: [
      'Continue your current plant care routine',
      'Monitor regularly for any changes',
      'Maintain proper watering schedule',
      'Ensure adequate nutrition',
      'Keep garden area clean'
    ],
    additionalInfo: {
      symptoms: [
        'No visible disease symptoms',
        'Vibrant green color',
        'Normal leaf structure',
        'Good plant vigor',
        'Active growth'
      ],
      causes: [
        'Plant is healthy!',
        'Good growing conditions',
        'Proper care and maintenance'
      ],
      preventionTips: [
        'Continue regular monitoring',
        'Maintain good cultural practices',
        'Ensure proper drainage',
        'Provide balanced nutrition',
        'Keep tools sanitized'
      ]
    }
  },
  {
    disease: 'Citrus Greening (Huanglongbing)',
    plantType: 'Orange',
    severity: 'Critical',
    recommendations: [
      'Report to agricultural authorities immediately',
      'Control Asian citrus psyllid vectors',
      'Remove and destroy infected trees',
      'Apply systemic insecticides',
      'Use certified disease-free nursery stock'
    ],
    additionalInfo: {
      symptoms: [
        'Asymmetric blotchy mottling on leaves',
        'Yellow shoots (yellow dragon)',
        'Small, lopsided, bitter fruit',
        'Green color remains at stem end',
        'Tree decline and death'
      ],
      causes: [
        'Bacteria Candidatus Liberibacter',
        'Spread by Asian citrus psyllid',
        'Also spread by grafting',
        'No cure once infected'
      ],
      preventionTips: [
        'Control psyllid vectors',
        'Use disease-free nursery stock',
        'Regular scouting',
        'Remove symptomatic trees',
        'Coordinate with neighbors'
      ]
    }
  },
  {
    disease: 'Peach Bacterial Spot',
    plantType: 'Peach',
    severity: 'Medium',
    recommendations: [
      'Apply copper sprays during dormancy',
      'Use oxytetracycline during growing season',
      'Prune out infected twigs',
      'Avoid overhead irrigation',
      'Plant resistant varieties'
    ],
    additionalInfo: {
      symptoms: [
        'Angular purple-brown spots on leaves',
        'Shot-hole effect as spots fall out',
        'Sunken lesions on fruit',
        'Cracking on fruit surface',
        'Twig cankers'
      ],
      causes: [
        'Bacteria Xanthomonas arboricola',
        'Wind-driven rain',
        'Warm, wet spring weather',
        'Overwintering in cankers'
      ],
      preventionTips: [
        'Select resistant varieties',
        'Proper orchard site selection',
        'Good air drainage',
        'Avoid mechanical injuries',
        'Sanitation practices'
      ]
    }
  }
];

// Generate confidence with realistic variation
const generateConfidence = () => {
  const base = 85 + Math.random() * 12; // 85-97%
  return Math.round(base * 10) / 10;
};

// Mock prediction function - simulates ML model
export const predictDisease = async (imageUri) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Randomly select a disease (weighted towards common diseases)
  const weights = [1, 1.5, 1, 1, 1, 0.8, 0.8, 2, 0.5, 0.8]; // Healthy has higher weight
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  let selectedDisease;
  for (let i = 0; i < DISEASE_DATABASE.length; i++) {
    random -= weights[i] || 1;
    if (random <= 0) {
      selectedDisease = DISEASE_DATABASE[i];
      break;
    }
  }
  
  if (!selectedDisease) {
    selectedDisease = DISEASE_DATABASE[DISEASE_DATABASE.length - 1];
  }
  
  return {
    ...selectedDisease,
    confidence: generateConfidence(),
    timestamp: new Date().toISOString(),
  };
};

// Get all available diseases (for reference)
export const getAllDiseases = () => {
  return DISEASE_DATABASE.map(d => ({
    disease: d.disease,
    plantType: d.plantType,
  }));
};

// Get disease by name
export const getDiseaseByName = (name) => {
  return DISEASE_DATABASE.find(
    d => d.disease.toLowerCase() === name.toLowerCase()
  );
};

// Get diseases by plant type
export const getDiseasesByPlant = (plantType) => {
  return DISEASE_DATABASE.filter(
    d => d.plantType.toLowerCase().includes(plantType.toLowerCase())
  );
};

export default {
  predictDisease,
  getAllDiseases,
  getDiseaseByName,
  getDiseasesByPlant,
  DISEASE_DATABASE,
};
