# splunkFY25_FDSE_back_end

Design and build a customized Splunk solution to address real-world problems using Splunk tools. Develop a comprehensive architecture with data fetching, storage, custom REST API endpoints, and advanced search functionality. Showcase Splunk's capabilities through creative problem-solving, emphasizing user experience and efficient data handling

# ETL Feature Usage

## Overview

This ETL (Extract, Transform, Load) feature is designed to extract data from a Splunk Enterprise instance, transform the data by adding additional information, and load the processed data into a MongoDB Atlas database. The feature is divided into three main stages: extract, transform, and load, each implemented in separate modules.

## File Structure

The ETL functionality is organized as follows:

etl/
│
├── extract/
│ ├── init.py
│ └── aggregate_data.py
│
├── load/
│ ├── init.py
│ └── save_to_mongo.py
│
├── transform/
│ ├── init.py
│ └── add_additional_info.py
│
└── main.py

## Prerequisites

Ensure you have the following installed and configured:

- Python 3.x
- Splunk SDK for Python
- MongoDB Atlas
- A `.env` file with the necessary environment variables

## Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

SPLUNK_HOST=<your_splunk_host>
SPLUNK_PORT=<your_splunk_port>
SPLUNK_USERNAME=<your_splunk_username>
SPLUNK_PASSWORD=<your_splunk_password>
SPLUNK_SCHEME=https
MONGO_URI=<your_mongo_uri>
MONGO_DB_NAME=<your_mongo_db_name>

## Running ETL

To run the ETL process, execute the `main.py` script:

python etl/main.py
