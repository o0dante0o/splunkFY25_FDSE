import splunklib.client as client
import splunklib.results as results
import os
import ssl
import json
import time
from dotenv import load_dotenv

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
load_dotenv()

service = client.connect(
    host=os.getenv("SPLUNK_HOST"),
    port=int(os.getenv("SPLUNK_PORT")),
    username=os.getenv("SPLUNK_USERNAME"),
    password=os.getenv("SPLUNK_PASSWORD"),
    scheme=os.getenv("SPLUNK_SCHEME"),
    sslContext=ssl_context
)

def execute_spl_query(query):
    """
    Executes a Splunk query and returns the results.

    Args:
        query (str): The SPL query to be executed.

    Returns:
        list: A list of dictionaries, each representing a result from the query.
    """
    job = service.jobs.create(query)
    while not job.is_done():
        time.sleep(1)
    results_list = []
    for result in results.ResultsReader(job.results()):
        results_list.append(result)
    return results_list

def aggregate_data(collections):
    """
    Aggregates data from various Splunk queries.

    Args:
        collections (dict): A dictionary where keys are collection names and values are SPL queries.

    Returns:
        str: A JSON-formatted string containing the aggregated data from the Splunk queries.
    """
    aggregated_data = {}
    for collection in collections:
        query = collections[collection]
        results_list = execute_spl_query(query)
        aggregated_data[collection] = results_list
    print(aggregated_data)
    return json.dumps(aggregated_data, indent=4)
