"""
Predict Plant Disease from an Image (PyTorch)
Compatible with MobileNetV2 training code
"""

import os
import json
import argparse
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import matplotlib.pyplot as plt

# ---------------- CONFIG ----------------
MODEL_PATH = "plant_disease_model.pth"
CLASS_NAMES_PATH = "class_names.json"
IMG_SIZE = 224

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------- LOAD MODEL ----------------
def load_trained_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model file not found. Train the model first.")

    if not os.path.exists(CLASS_NAMES_PATH):
        raise FileNotFoundError("class_names.json not found.")

    with open(CLASS_NAMES_PATH, "r") as f:
        class_names = json.load(f)

    model = models.mobilenet_v2(pretrained=False)
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.last_channel, len(class_names))
    )

    checkpoint = torch.load(MODEL_PATH, map_location=device)
    model.load_state_dict(checkpoint["model_state_dict"])

    model.to(device)
    model.eval()

    return model, class_names

# ---------------- IMAGE PREPROCESS ----------------
def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0)
    return image, tensor

# ---------------- PREDICTION ----------------
def predict_disease(model, class_names, image_path, show_plot=True):
    original_img, img_tensor = preprocess_image(image_path)
    img_tensor = img_tensor.to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)[0]

    probs_np = probs.cpu().numpy()
    pred_idx = int(np.argmax(probs_np))

    predicted_class = class_names[pred_idx]
    confidence = probs_np[pred_idx]

    # Parse PlantVillage label
    parts = predicted_class.split("___")
    plant = parts[0].replace("_", " ")
    condition = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
    status = "HEALTHY" if "healthy" in condition.lower() else "DISEASED"

    # Top-5
    top5_idx = np.argsort(probs_np)[-5:][::-1]
    top5 = [(class_names[i], float(probs_np[i])) for i in top5_idx]

    # ----------- PRINT RESULTS -----------
    print("\n" + "=" * 60)
    print("PREDICTION RESULT")
    print("=" * 60)
    print(f"Image      : {image_path}")
    print(f"Plant      : {plant}")
    print(f"Condition  : {condition}")
    print(f"Status     : {status}")
    print(f"Confidence : {confidence * 100:.2f}%")

    print("\nTop-5 Predictions:")
    for i, (cls, prob) in enumerate(top5, 1):
        print(f"{i}. {cls} → {prob * 100:.2f}%")

    # ----------- VISUALIZATION -----------
    if show_plot:
        fig, ax = plt.subplots(1, 2, figsize=(14, 5))

        ax[0].imshow(original_img)
        ax[0].axis("off")
        ax[0].set_title(
            f"{plant}\n{condition}\n{confidence * 100:.1f}%",
            color="green" if status == "HEALTHY" else "red"
        )

        labels = [c.split("___")[-1][:20] for c, _ in top5]
        values = [p * 100 for _, p in top5]

        ax[1].barh(labels, values)
        ax[1].invert_yaxis()
        ax[1].set_xlabel("Probability (%)")
        ax[1].set_title("Top-5 Predictions")

        plt.tight_layout()
        plt.show()

    return predicted_class, confidence, dict(top5)

# ---------------- BATCH PREDICTION ----------------
def predict_batch(model, class_names, image_dir):
    valid_ext = {".jpg", ".jpeg", ".png"}
    images = [f for f in os.listdir(image_dir)
              if os.path.splitext(f)[1].lower() in valid_ext]

    if not images:
        print("No valid images found.")
        return

    for img in images:
        path = os.path.join(image_dir, img)
        predict_disease(model, class_names, path, show_plot=False)

# ---------------- CLI ----------------
def main():
    parser = argparse.ArgumentParser(description="Plant Disease Prediction")
    parser.add_argument("path", help="Image path or directory")
    parser.add_argument("--batch", action="store_true")
    parser.add_argument("--no-plot", action="store_true")
    args = parser.parse_args()

    model, class_names = load_trained_model()

    if args.batch:
        if not os.path.isdir(args.path):
            raise ValueError("Batch mode requires a directory")
        predict_batch(model, class_names, args.path)
    else:
        if not os.path.isfile(args.path):
            raise ValueError("Invalid image path")
        predict_disease(
            model,
            class_names,
            args.path,
            show_plot=not args.no_plot
        )

# ---------------- RUN ----------------
if __name__ == "__main__":
    main()
