#!/bin/bash

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install requirements inside the virtual environment
echo "Installing requirements..."
pip install -r requirements.txt

# Run the app
echo "Starting YouTube Link Extractor..."
python -m streamlit run app.py
