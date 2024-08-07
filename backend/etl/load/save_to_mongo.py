from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv('MONGO_URI')
mongo_db_name = os.getenv('MONGO_DB_NAME')

def create_indexes(db, collection_name):
    """
    Creates text indexes for specified fields in the given MongoDB collection.

    Args:
        db (Database): The MongoDB database object.
        collection_name (str): The name of the MongoDB collection.
    """
    collection = db[collection_name]
    # Crear un índice de texto en los campos especificados
    collection.create_index([
        ("name", "text"),
        ("description", "text"),
        ("owner", "text"),
        ("custom_classification", "text"),
        ("tags", "text")
    ])
    print(f'Text indexes created for {collection_name} collection')

def save_to_mongo(collection_name, data_list):
    """
    Saves a list of dictionaries to a specified MongoDB collection.

    Args:
        collection_name (str): The name of the MongoDB collection where the data will be saved.
        data_list (list): A list of dictionaries to be inserted into the collection.

    Returns:
        str: Confirmation message indicating successful execution.
    """
    client = MongoClient(mongo_uri, tls=True, tlsAllowInvalidCertificates=True)
    db = client[mongo_db_name]
    collection = db[collection_name]
    
    create_indexes(db, collection_name) 
    collection.insert_many(data_list)
    
    return f'Data saved and indexes created for {collection_name}'

def save_data_and_create_indexes(collections_data):
    """
    Saves data to multiple MongoDB collections and creates indexes for each collection.

    Args:
        collections_data (dict): A dictionary where keys are collection names and values are lists of dictionaries to be inserted.
    """
    client = MongoClient(mongo_uri, tls=True, tlsAllowInvalidCertificates=True)
    db = client[mongo_db_name]
    
    for collection_name, data_list in collections_data.items():
        save_to_mongo(collection_name, data_list)