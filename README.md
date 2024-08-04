
# splunkFY25_FDSE_back_end

Design and build a customized Splunk solution to address real-world problems using Splunk tools. Develop a comprehensive architecture with data fetching, storage, custom REST API endpoints, and advanced search functionality. Showcase Splunk's capabilities through creative problem-solving, emphasizing user experience and efficient data handling.

# ETL Feature Usage

## Overview

This ETL (Extract, Transform, Load) feature is designed to extract data from a Splunk Enterprise instance, transform the data by adding additional information, and load the processed data into a MongoDB Atlas database. The feature is divided into three main stages: extract, transform, and load, each implemented in separate modules.

## File Structure

The ETL functionality is organized as follows:

```
etl/
│
├── extract/
│ ├── __init__.py
│ └── aggregate_data.py
│
├── load/
│ ├── __init__.py
│ └── save_to_mongo.py
│
├── transform/
│ ├── __init__.py
│ └── add_additional_info.py
│
└── main.py
```

## Prerequisites

Ensure you have the following installed and configured:

- Python 3.x
- Splunk SDK for Python
- MongoDB Atlas
- A `.env` file with the necessary environment variables

## Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

```
SPLUNK_HOST=<your_splunk_host>
SPLUNK_PORT=<your_splunk_port>
SPLUNK_USERNAME=<your_splunk_username>
SPLUNK_PASSWORD=<your_splunk_password>
SPLUNK_SCHEME=https
MONGO_URI=<your_mongo_uri>
MONGO_DB_NAME=<your_mongo_db_name>
```

## Running ETL

To run the ETL process, execute the `main.py` script:

```
python etl/main.py
```

# Flask API Endpoints

This project includes a Flask-based REST API to interact with the MongoDB database. Below are the details of each endpoint.

### Overview Endpoint

**GET `/overview`**

Review all collections and the count of documents in each one.

**Returns:** JSON with the name of each collection and its document count.

### List Documents

**GET `/list`**

List all documents in all collections or in a specific collection.

**Parameters:**
- `type` (optional, default 'all'): Name of the collection to list. If not specified, lists all.

**Returns:** JSON with the documents from the requested collections.

### Search Documents

**GET `/search`**

Search for a query across all collections.

**Parameters:**
- `q` (required): Search string.

**Returns:** JSON with the search results by collection.

### Add Metadata

**POST `/add`**

Add metadata/classification or tags to a specific document in the specified collection.

**Parameters:**
- `type` (required): Type of metadata/classification ('custom_classification', or 'add_tag').
- `id` (required): ID of the document to update.
- JSON in the request body with the metadata/classification/tag data.

**Returns:** Success or error message.

### Remove Metadata or Document

**POST `/remove`**

Remove a tag or an entire document from the specified collection.

**Parameters:**
- `type` (required): Type of operation ('remove_tag' or 'remove_document').
- `id` (required): ID of the document to update or delete.
- JSON in the request body with the tag to remove (if applicable).

**Returns:** Success or error message.
