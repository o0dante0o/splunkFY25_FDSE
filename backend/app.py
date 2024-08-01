from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
app = Flask(__name__)

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
# Configuración de MongoDB


client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

@app.route('/overview', methods=['GET'])
def overview():
    collections = db.list_collection_names()
    return jsonify({"collections": collections})

@app.route('/list', methods=['GET'])
def list_all():
    type_param = request.args.get('type')
    if type_param == 'all':
        data = {
            "saved_searches": list(db.saved_searches.find({}, {'_id': 0})),
            "apps": list(db.apps.find({}, {'_id': 0})),
            "dashboards": list(db.dashboards.find({}, {'_id': 0})),
            "fields": list(db.fields.find({}, {'_id': 0}))
        }
        return jsonify(data)
    return jsonify({"error": "Invalid type parameter"}), 400

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    results = {
        "saved_searches": list(db.saved_searches.find({"title": {"$regex": query, "$options": "i"}}, {'_id': 0})),
        "apps": list(db.apps.find({"title": {"$regex": query, "$options": "i"}}, {'_id': 0})),
        "dashboards": list(db.dashboards.find({"title": {"$regex": query, "$options": "i"}}, {'_id': 0})),
        "fields": list(db.fields.find({"field": {"$regex": query, "$options": "i"}}, {'_id': 0}))
    }
    return jsonify(results)

@app.route('/add', methods=['POST'])
def add():
    type_param = request.args.get('type')
    data = request.json
    if type_param == 'meta-tag':
        result = db.fields.insert_one(data)
    elif type_param == 'classification':
        result = db.saved_searches.insert_one(data)
    else:
        return jsonify({"error": "Invalid type parameter"}), 400
    return jsonify({"inserted_id": str(result.inserted_id)})


if __name__ == '__main__':
    app.run(debug=True)