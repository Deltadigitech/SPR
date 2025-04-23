import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, "instance", "app.db")

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DATABASE_PATH}"  # Corrected database URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")  # Upload folder path
    SECRET_KEY = os.urandom(24)  # Secure session key
    OPENAI_API_KEY = "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"  # Add your OpenAI API key here
