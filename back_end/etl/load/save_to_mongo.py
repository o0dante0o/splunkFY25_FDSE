from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv('MONGO_URI')
mongo_db_name = os.getenv('MONGO_DB_NAME')

def save_to_mongo(collection_name, data_list):
    """
    Saves a list of dictionaries to a specified MongoDB collection.

    Args:
        collection_name (str): The name of the MongoDB collection where the data will be saved.
        data_list (list): A list of dictionaries to be inserted into the collection.

    Returns:
        None
    """
    
    client = MongoClient(mongo_uri, tls=True, tlsAllowInvalidCertificates=True)
    db = client[mongo_db_name]
    collection = db[collection_name]
    collection.insert_many(data_list)