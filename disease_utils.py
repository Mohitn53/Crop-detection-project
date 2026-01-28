from disease_data import DISEASE_SOLUTIONS, HEALTHY_RESPONSES

def format_disease_output(label, score):
    """Format the model output into structured data"""
    crop = "Unknown"
    disease = label
    
    # Label format is usually "Crop___Disease" or "Crop Disease"
    if "___" in label:
        parts = label.split("___")
        crop = parts[0]
        disease = parts[1].replace("_", " ")
    elif " " in label:
        parts = label.split(" ", 1)
        crop = parts[0]
        disease = parts[1]
        
    confidence_level = "Low"
    if score > 0.9:
        confidence_level = "Very High"
    elif score > 0.75:
        confidence_level = "High"
    elif score > 0.6:
        confidence_level = "Medium"
        
    return {
        "crop": crop,
        "disease": disease,
        "original_label": label,
        "confidence": round(score * 100, 2),
        "confidence_level": confidence_level
    }

def get_solution(disease_label):
    """Get treatment solution for detected disease"""
    # Normalize the label - convert from model format to database format
    # Model returns: "Tomato Bacterial spot" 
    # Database needs: "Tomato___Bacterial_spot"
    
    normalized_label = disease_label.strip()
    
    # Replace spaces with underscores and then convert single crop-disease separator to triple underscore
    # First, let's try to find a match by replacing space with ___
    if " " in normalized_label:
        # For labels like "Tomato Bacterial spot" -> "Tomato___Bacterial_spot"
        parts = normalized_label.split(" ", 1)  # Split only on first space
        if len(parts) == 2:
            crop = parts[0]
            disease = parts[1].replace(" ", "_")  # Replace remaining spaces with single underscore
            normalized_label = f"{crop}___{disease}"
    
    # Check if healthy
    if "healthy" in normalized_label.lower():
        # Try to find exact match first
        for key in HEALTHY_RESPONSES.keys():
            if normalized_label == key or disease_label in key or key in normalized_label:
                return HEALTHY_RESPONSES[key]
        
        return {
            "crop": normalized_label.split("___")[0] if "___" in normalized_label else "Plant",
            "disease": "Healthy",
            "message": "Your plant appears healthy!",
            "maintenance": ["Continue good agricultural practices"]
        }
    
    # Check if solution exists with normalized label
    if normalized_label in DISEASE_SOLUTIONS:
        return DISEASE_SOLUTIONS[normalized_label]
    
    # Try original label as fallback
    if disease_label in DISEASE_SOLUTIONS:
        return DISEASE_SOLUTIONS[disease_label]
    
    # Unknown disease
    parts = disease_label.split(" ", 1) if " " in disease_label else [disease_label]
    return {
        "crop": parts[0] if len(parts) > 0 else "Unknown",
        "disease": parts[1] if len(parts) > 1 else disease_label,
        "message": f"No specific solution available for this disease.",
        "recommendation": "Please consult with a local agricultural extension officer or plant pathologist."
    }
