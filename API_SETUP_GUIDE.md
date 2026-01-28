# Plant Disease Detection API Setup Guide

This guide helps you set up the Python Flask API for crop disease detection.

## 1. Prerequisites
- Python 3.8 or higher installed
- pip (Python package manager)

## 2. Installation

1. Open your terminal/command prompt in the project folder.
2. Install the required dependencies:
   ```bash
   pip install -r requirements_api.txt
   ```

## 3. Running the Server

Start the API server with the following command:

```bash
python api_server.py
```

You should see output like:
```
Loading model... this may take a moment
Model loaded successfully
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

## 4. Connecting from React Native

1. Find your computer's local IP address:
   - **Windows**: Run `ipconfig` in terminal, look for `IPv4 Address`.
   - **Mac/Linux**: Run `ifconfig`, look for `inet` under `en0` or `wlan0`.

2. Open `react_native_integration.js` or your app code.
3. Update the `API_URL` variable:
   ```javascript
   const API_URL = 'http://YOUR_IP_ADDRESS:5000/predict';
   ```
   (Replace `YOUR_IP_ADDRESS` with the actual IP, e.g., `192.168.1.10`)

4. Run your React Native app and test the upload!

## Troubleshooting

- **Timeout Error**: The first request might be slow as the model warms up.
- **Connection Refused**: Ensure your phone/emulator and computer are on the **Same Wi-Fi Network**.
- **Firewall**: If it still fails, check if your Windows Firewall is blocking Python. Allow access on port 5000.
