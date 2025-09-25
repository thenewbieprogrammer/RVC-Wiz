#!/usr/bin/env python3
"""
Script to manually add a Rick Sanchez voice model to the database
"""

import sys
import os
import requests
import json

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.getcwd(), 'app'))

def add_rick_sanchez_model():
    """Add a Rick Sanchez model to the database"""
    print("🎯 Adding Rick Sanchez voice model to database...")
    
    try:
        from app.db.database import SessionLocal
        from app.models.voice_model import VoiceModel
        
        db = SessionLocal()
        try:
            # Check if Rick Sanchez model already exists
            existing_model = db.query(VoiceModel).filter(
                VoiceModel.character.ilike('%rick%')
            ).first()
            
            if existing_model:
                print(f"✅ Rick Sanchez model already exists: {existing_model.name}")
                return existing_model.id
            
            # Create a new Rick Sanchez model entry
            rick_model = VoiceModel(
                name="Rick Sanchez (Classic)",
                character="Rick Sanchez",
                description="The brilliant but cynical scientist from Rick and Morty - Classic voice model",
                download_url="https://huggingface.co/example/rick-sanchez/resolve/main/rick_sanchez.pth",
                huggingface_url="https://huggingface.co/example/rick-sanchez",
                model_url="https://voice-models.com/model/rick-sanchez",
                size="245 MB",
                size_bytes=245 * 1024 * 1024,  # 245 MB in bytes
                epochs=500,
                model_type="RVCv2",
                tags=json.dumps(["Male", "Adult", "Scientist", "Cynical", "English", "Rick and Morty"]),
                is_downloaded=False,
                download_progress=0.0,
                download_error=None,
                local_path=None,
                index_path=None
            )
            
            db.add(rick_model)
            db.commit()
            db.refresh(rick_model)
            
            print(f"✅ Rick Sanchez model added to database with ID: {rick_model.id}")
            print(f"   Name: {rick_model.name}")
            print(f"   Character: {rick_model.character}")
            print(f"   Size: {rick_model.size}")
            print(f"   Epochs: {rick_model.epochs}")
            
            return rick_model.id
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error adding Rick Sanchez model: {e}")
        import traceback
        traceback.print_exc()
        return None

def download_rick_model_via_api(model_id):
    """Download the Rick Sanchez model via API"""
    print(f"📥 Starting download for Rick Sanchez model (ID: {model_id})...")
    
    try:
        # Start download
        response = requests.post(f"http://localhost:8000/api/voice-models/download/{model_id}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Download request sent: {data.get('message', '')}")
            return True
        else:
            print(f"❌ Failed to start download: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error starting download: {e}")
        return False

def main():
    print("🚀 Rick Sanchez Voice Model Setup")
    print("=" * 50)
    
    # Add Rick Sanchez model to database
    model_id = add_rick_sanchez_model()
    
    if model_id:
        print(f"\n🎯 Rick Sanchez model is now available in the database!")
        print("   You can now:")
        print("   1. Go to the Voice Library page in the web app")
        print("   2. Find 'Rick Sanchez (Classic)' in the model list")
        print("   3. Click the download button to download it")
        print("   4. Once downloaded, use it in the Voice Clone tool")
        
        # Optionally start download
        print(f"\n📥 Would you like to start downloading the model now? (This will take some time)")
        print("   The model will be available for voice cloning once download completes.")
        
        # For now, just show the model is available
        print(f"\n✅ Rick Sanchez model (ID: {model_id}) is ready for download!")
    else:
        print("❌ Failed to add Rick Sanchez model to database")

if __name__ == "__main__":
    main()
