from flask import Flask, request, jsonify, abort
from pymongo import MongoClient, TEXT
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
import re
from flask_cors import CORS
from aws_lambda_wsgi import response as aws_lambda_response, handler as aws_lambda_handler

app = Flask(__name__)
CORS(app)

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
print(MONGO_URI)
print(MONGO_DB_NAME)
client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def validate_object_id(oid):
    """
    Validate if the provided ObjectId is valid.
    Args:
        oid (str): The ObjectId to validate.
    Raises:
        HTTPException: If the ObjectId is not valid, aborts with a 400 status code.
    """
    if not ObjectId.is_valid(oid):
        abort(400, 'Invalid ObjectId format')

def sanitize_input(data):
    """
    Sanitize input to prevent injection attacks.
    Args:
        data: The input data to sanitize, which can be a dictionary, list, or string.
    Returns:
        The sanitized data, with special characters removed from strings.
    """

    if isinstance(data, dict):
        return {k: sanitize_input(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(i) for i in data]
    elif isinstance(data, str):
        return re.sub(r'[^\w\s]', '', data)
    else:
        return data

def convert_object_ids(data):
    """
    Convert ObjectId to string in the provided data.
    Args:
        data: The input data which can be a dictionary, list, or ObjectId.
    Returns:
        The data with ObjectId instances converted to strings.
    """

    if isinstance(data, dict):
        return {k: convert_object_ids(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_object_ids(i) for i in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

    
#=======================================================================================================#

@app.route('/overview', methods=['GET'])
def overview():
    """
    GET /overview
    Review all collections and the count of documents in each one.
    Returns: JSON with the name of each collection and its document count.
    """

    collections = db.list_collection_names()
    overview_data = {}
    for collection_name in collections:
        collection = db[collection_name]
        count = collection.count_documents({})
        overview_data[collection_name] = count
    return jsonify(overview_data), 200

@app.route('/list', methods=['GET'])
def list_all():
    """
    GET /list
    List all documents in all collections or in a specific collection.
    Parameters:
        - type (optional, default 'all'): Name of the collection to list. If not specified, lists all.
    Returns: JSON with the documents from the requested collections.
    """

    doc_type = request.args.get('type', 'all')
    result = {}

    collections = db.list_collection_names()
    
    if doc_type == 'all':
        for collection_name in collections:
            collection = db[collection_name]
            documents = list(collection.find({}))
            result[collection_name] = [convert_object_ids(doc) for doc in documents]
    elif doc_type in collections:
        collection = db[doc_type]
        documents = list(collection.find({}))
        result[doc_type] = [convert_object_ids(doc) for doc in documents]

    else:
        return jsonify({"error": "Invalid collection type"}), 400
    
    return jsonify(result), 200

@app.route('/search', methods=['GET'])
def search():
    """
    GET /search
    Search for a query across all collections.
    Parameters:
        - q (required): Search string.
    Returns: JSON with the search results by collection.
    """

    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    sanitized_query = sanitize_input(query)
    result = {}
    
    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        search_result = list(collection.find({"$text": {"$search": sanitized_query}}))
        if search_result:
            result[collection_name] = [convert_object_ids(doc) for doc in search_result]

    
    return jsonify(result), 200

@app.route('/add', methods=['POST'])
def add_metadata():
    """
    POST /add
    Add metadata/classification or tags to a specific document in the specified collection.
    Parameters:
        - type (required): Type of metadata/classification ('custom_classification', or 'add_tag').
        - id (required): ID of the document to update.
        - JSON in the request body with the metadata/classification/tag data.
    Returns: Success or error message.
    """

    doc_type = request.args.get('type')
    doc_id = request.args.get('id')
    data = request.json

    if not doc_type or not data or not doc_id:
        return jsonify({"error": "Invalid request"}), 400

    validate_object_id(doc_id)
    update_field = {}

    if doc_type == "custom_classification":
        update_field = {"custom_classification": sanitize_input(data.get('custom_classification', ''))}
    elif doc_type == "add_tag":
        tag = sanitize_input(data.get('tag', ''))
        if not tag:
            return jsonify({"error": "Tag is required"}), 400
        update_field = {"tags": tag}
    else:
        return jsonify({"error": "Invalid type"}), 400

    document_found = False

    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        if doc_type == "add_tag":
            result = collection.update_one({"_id": ObjectId(doc_id)}, {"$addToSet": update_field})
        else:
            result = collection.update_one({"_id": ObjectId(doc_id)}, {"$set": update_field})

        if result.matched_count > 0:
            document_found = True
            break

    if not document_found:
        return jsonify({"error": f"Document with id {doc_id} not found in any collection"}), 404

    return jsonify({"message": "Document updated successfully"}), 200

@app.route('/remove', methods=['POST'])
def remove():
    """
    POST /remove
    Remove a tag or an entire document from the specified collection.
    Parameters:
        - type (required): Type of operation ('remove_tag' or 'remove_document').
        - id (required): ID of the document to update or delete.
        - JSON in the request body with the tag to remove (if applicable).
    Returns: Success or error message.
    """
    
    doc_type = request.args.get('type')
    doc_id = request.args.get('id')
    data = request.json

    if not doc_type or not doc_id:
        return jsonify({"error": "Invalid request"}), 400

    validate_object_id(doc_id)
    document_found = False

    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        if doc_type == "remove_tag":
            tag = sanitize_input(data.get('tag', ''))
            if not tag:
                return jsonify({"error": "Tag is required"}), 400
            result = collection.update_one({"_id": ObjectId(doc_id)}, {"$pull": {"tags": tag}})
            if result.matched_count > 0:
                document_found = True
                break
        elif doc_type == "remove_document":
            result = collection.delete_one({"_id": ObjectId(doc_id)})
            if result.deleted_count > 0:
                document_found = True
                break
        else:
            return jsonify({"error": "Invalid type"}), 400

    if not document_found:
        return jsonify({"error": f"Document with id {doc_id} not found in any collection"}), 404

    return jsonify({"message": "Operation completed successfully"}), 200

def lambda_handler(event, context):
    return aws_lambda_handler(app, event, context)

if __name__ == '__main__':
    app.run(debug=True)