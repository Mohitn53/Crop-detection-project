#!/usr/bin/env python
"""
Plant Disease Detection Model CLI
Load the model and predict disease for a given image path.
"""

import sys
import json
import argparse
from pathlib import Path
from transformers import pipeline
from PIL import Image

from disease_utils import format_disease_output, get_solution

def analyze_plant_disease(image_path, json_output=False):
    try:
        # Load model
        pipe = pipeline("image-classification", model="Diginsa/Plant-Disease-Detection-Project")
        
        # Analyze image
        image = Image.open(image_path)
        predictions = pipe(image)
        
        # Get top prediction
        top = predictions[0]
        result = format_disease_output(top['label'], top['score'])
        
        # Get detailed solution
        solution = get_solution(top['label'])
        result.update(solution)
        
        if json_output:
            print(json.dumps(result))
        else:
            print("=" * 80)
            print(f"📷 Analyzing: {Path(image_path).name}")
            print("=" * 80)
            print(f"\n🌱 Crop:       {result['crop']}")
            print(f"🦠 Disease:    {result['disease']}")
            print(f"📊 Confidence: {result['confidence']:.2f}% ({result['confidence_level']})")
            
            print("\n" + "=" * 80)
            print("💊 TREATMENT & PREVENTION")
            print("=" * 80)
            
            if 'message' in result:
                print(f"\n📢 {result['message']}")
            
            print(f"\n⚠️  Severity: {result.get('severity', 'N/A')}")
            
            if 'maintenance' in result:
                print(f"\n✅ Maintenance Tips:")
                for tip in result['maintenance']:
                    print(f"   • {tip}")
            
            if 'organic' in result:
                print(f"\n🌿 Organic/Natural Treatment:")
                for treatment in result['organic']:
                    print(f"   • {treatment}")
            
            if 'chemical' in result:
                print(f"\n💊 Chemical Treatment:")
                for treatment in result['chemical']:
                    print(f"   • {treatment}")
            
            if 'prevention' in result:
                print(f"\n🛡️  Prevention Measures:")
                for prevention in result['prevention']:
                    print(f"   • {prevention}")
            
            if 'recommendation' in result:
                print(f"\n💡 {result['recommendation']}")
            
            print("=" * 80)
            
        return result

    except Exception as e:
        error_msg = {"error": str(e)}
        if json_output:
            print(json.dumps(error_msg))
        else:
            print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Plant Disease Detection CLI")
    parser.add_argument("image_path", help="Path to the image file")
    parser.add_argument("--json", action="store_true", help="Output result as JSON")
    
    args = parser.parse_args()
    
    if not Path(args.image_path).exists():
        if args.json:
            print(json.dumps({"error": f"Image not found: {args.image_path}"}))
        else:
            print(f"Error: Image not found: {args.image_path}")
        sys.exit(1)
        
    analyze_plant_disease(args.image_path, args.json)
