"""
RVC-Wiz Backend Application Entry Point

This is the main entry point for the RVC-Wiz backend application.
It imports and runs the FastAPI application from the app package.
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )