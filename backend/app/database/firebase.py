"""
FINCHECK AI - Firebase Admin & Storage Initialization
"""
import os
import logging
from typing import Optional

logger = logging.getLogger("fincheck.firebase")

_firebase_app = None
_firestore_client = None

def init_firebase():
    global _firebase_app, _firestore_client
    if _firebase_app is not None:
        return _firestore_client

    project_id = os.getenv("FIREBASE_PROJECT_ID")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")

    if project_id and client_email and private_key:
        try:
            import firebase_admin
            from firebase_admin import credentials, firestore
            
            # Format private key line breaks if needed
            pk = private_key.replace("\\n", "\n")
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": project_id,
                "client_email": client_email,
                "private_key": pk,
                "token_uri": "https://oauth2.googleapis.com/token",
            })
            _firebase_app = firebase_admin.initialize_app(cred)
            _firestore_client = firestore.client()
            logger.info("Firebase Admin initialized successfully with Firestore.")
            return _firestore_client
        except Exception as e:
            logger.warning(f"Could not initialize Firebase Admin SDK: {e}. Falling back to high-performance local store.")
    else:
        logger.info("Firebase credentials not configured in .env. Using unified local persistence store.")

    return None

def get_firestore_client():
    return init_firebase()
