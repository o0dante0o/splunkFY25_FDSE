from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

app = Flask(__name__)

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')


client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

@app.route('/overview', methods=['GET'])
def overview():
    """
    review all the collections the the count of each one.
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
    List all documents in all collections or in a specific collection.
    """
    doc_type = request.args.get('type', 'all')
    result = {}

    collections = db.list_collection_names()
    
    if doc_type == 'all':
        for collection_name in collections:
            collection = db[collection_name]
            result[collection_name] = list(collection.find({}, {"_id": 0}))
    elif doc_type in collections:
        collection = db[doc_type]
        result[doc_type] = list(collection.find({}, {"_id": 0}))
    else:
        return jsonify({"error": "Invalid collection type"}), 400
    
    return jsonify(result), 200
@app.route('/search', methods=['GET'])
def search():
    """
    Search for a query across all collections.
    """
    query = request.args.get('q', '')
    result = {}
    
    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        search_result = list(collection.find({"$text": {"$search": query}}, {"_id": 0}))
        if search_result:
            result[collection_name] = search_result
    
    return jsonify(result), 200

@app.route('/add', methods=['POST'])
def add_metadata():
    """
    Add meta/cassification to a specific document in the specified collection.
    """
    doc_type = request.args.get('type')
    doc_id = request.args.get('id')
    data = request.json

    if not doc_type or not data or not doc_id:
        return jsonify({"error": "Invalid request"}), 400

    update_field = {}
    if doc_type == "meta-tag":
        update_field = {"meta_tag": data.get('meta_tag', '')}
    elif doc_type == "custom_clasification":
        update_field = {"custom_clasification": data.get('custom_clasification', '')}
    else:
        return jsonify({"error": "Invalid type"}), 400

    document_found = False

    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        result = collection.update_one({"_id": ObjectId(doc_id)}, {"$set": update_field})

        if result.matched_count > 0:
            document_found = True
            break

    if not document_found:
        return jsonify({"error": f"Document with id {doc_id} not found in any collection"}), 404

    return jsonify({"message": "Document updated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)