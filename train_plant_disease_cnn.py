"""
Plant Disease Classification using CNN (PyTorch)
Corrected & Clean Version for PlantVillage Dataset
"""

import os
import json
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Subset, random_split
from torchvision import datasets, transforms, models

from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# -------------------- SEED & DEVICE --------------------
SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# -------------------- CONFIG --------------------
DATASET_PATH = "plantvillage dataset/color"
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20
LR = 1e-3
VAL_SPLIT = 0.2

MODEL_PATH = "plant_disease_model.pth"
CLASS_NAMES_PATH = "class_names.json"

# -------------------- DATA LOADERS --------------------
def create_dataloaders():
    train_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    val_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    base_dataset = datasets.ImageFolder(DATASET_PATH)
    class_names = base_dataset.classes
    num_classes = len(class_names)

    val_size = int(len(base_dataset) * VAL_SPLIT)
    train_size = len(base_dataset) - val_size

    train_indices, val_indices = random_split(
        range(len(base_dataset)),
        [train_size, val_size],
        generator=torch.Generator().manual_seed(SEED)
    )

    train_dataset = Subset(
        datasets.ImageFolder(DATASET_PATH, transform=train_transform),
        train_indices.indices
    )

    val_dataset = Subset(
        datasets.ImageFolder(DATASET_PATH, transform=val_transform),
        val_indices.indices
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=2,
        pin_memory=True
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=2,
        pin_memory=True
    )

    print(f"Classes ({num_classes}): {class_names}")
    print(f"Train samples: {train_size}")
    print(f"Val samples: {val_size}")

    return train_loader, val_loader, class_names, num_classes

# -------------------- MODEL --------------------
def build_model(num_classes):
    model = models.mobilenet_v2(pretrained=True)

    for param in model.features.parameters():
        param.requires_grad = False  # transfer learning

    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.last_channel, num_classes)
    )

    return model.to(device)

# -------------------- TRAIN / VALIDATE --------------------
def train_one_epoch(model, loader, criterion, optimizer):
    model.train()
    total_loss, correct, total = 0, 0, 0

    for images, labels in tqdm(loader, desc="Training", leave=False):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        _, preds = outputs.max(1)
        correct += preds.eq(labels).sum().item()
        total += labels.size(0)

    return total_loss / len(loader), correct / total

def validate(model, loader, criterion):
    model.eval()
    total_loss, correct, total = 0, 0, 0

    with torch.no_grad():
        for images, labels in tqdm(loader, desc="Validating", leave=False):
            images, labels = images.to(device), labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            _, preds = outputs.max(1)
            correct += preds.eq(labels).sum().item()
            total += labels.size(0)

    return total_loss / len(loader), correct / total

# -------------------- MAIN TRAINING --------------------
def train():
    train_loader, val_loader, class_names, num_classes = create_dataloaders()

    with open(CLASS_NAMES_PATH, "w") as f:
        json.dump(class_names, f)

    model = build_model(num_classes)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    best_acc = 0

    for epoch in range(EPOCHS):
        print(f"\nEpoch {epoch+1}/{EPOCHS}")

        train_loss, train_acc = train_one_epoch(
            model, train_loader, criterion, optimizer
        )

        val_loss, val_acc = validate(
            model, val_loader, criterion
        )

        print(f"Train Loss: {train_loss:.4f} | Acc: {train_acc*100:.2f}%")
        print(f"Val   Loss: {val_loss:.4f} | Acc: {val_acc*100:.2f}%")

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": class_names
            }, MODEL_PATH)
            print("✔ Best model saved")

    print("\nTraining complete")
    print(f"Best Validation Accuracy: {best_acc*100:.2f}%")

    return model, val_loader, class_names

# -------------------- EVALUATION --------------------
def evaluate(model, loader, class_names):
    model.eval()
    y_true, y_pred = [], []

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = outputs.max(1)

            y_true.extend(labels.numpy())
            y_pred.extend(preds.cpu().numpy())

    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=class_names))

# -------------------- RUN --------------------
if __name__ == "__main__":
    model, val_loader, class_names = train()
    evaluate(model, val_loader, class_names)
