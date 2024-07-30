import splunklib.client as client
import splunklib.results as results
import os
from dotenv import load_dotenv
import ssl
import json

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
        pass
    results_list = []
    for result in results.ResultsReader(job.results()):
        results_list.append(result)
    return results_list

def aggregate_data():
    """
    Aggregates data from various Splunk queries.

    Returns:
        json: A dictionary containing the aggregated data from the Splunk queries.
    """
    dashboards = execute_spl_query('''| rest /servicesNS/-/-/data/ui/views splunk_server=local 
                                    | table label, title, description, "eai:acl.owner", "eai:acl.app" 
                                    | rename "eai:acl.owner" as owner, "eai:acl.app" as app 
                                    ''')
    
    saved_searches = execute_spl_query('''| rest/servicesNS/-/-/saved/searches splunk_server=local 
                                        | table label, title, description, "eai:acl.owner", "eai:acl.app" 
                                        | rename "eai:acl.owner" as owner, "eai:acl.app" as app 
                                        | streamstats count as report_id''')
    
    fields = execute_spl_query("search index=_internal | fieldsummary | fields field")

    apps = execute_spl_query("| rest /services/apps/local | search disabled=0 | table label title version description")

    aggregated_data = {
        "dashboards": dashboards,
        "saved_searches": saved_searches,
        "fields": fields,
        "apps": apps
    }

    return json.dumps(aggregated_data, indent=4)
