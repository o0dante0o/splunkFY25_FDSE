from pymongo import MongoClient

client = MongoClient('mongodb+srv://dev:ZDhej6XB2sdn5Lst@cluster0.kd6lycd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['splunk_host']

# Crear índices de texto en las colecciones
db.apps.create_index([("name", "text"), ("description", "text")])
db.dashboards.create_index([("name", "text"), ("description", "text")])
db.reports.create_index([("name", "text"), ("description", "text")])
db.alerts.create_index([("name", "text"), ("description", "text")])
db.lookups.create_index([("name", "text"), ("description", "text")])
db.fields.create_index([("title", "text"), ("description", "text")])
db.index.create_index([("name", "text"), ("description", "text")])
db.sources.create_index([("name", "text"), ("description", "text")])