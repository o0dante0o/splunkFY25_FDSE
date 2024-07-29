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
    job = service.jobs.create(query)
    while not job.is_done():
        pass
    results_list = []
    for result in results.ResultsReader(job.results()):
        results_list.append(result)
    return results_list

def aggregate_data(requests:dict):
    aggregated_data = {}
    for key,values in requests.items():
        aggregated_data[key] = execute_spl_query(values)

    # dashboards = execute_spl_query("|rest/servicesNS/-/-/data/ui/views")
    # saved_searches = execute_spl_query("|rest/servicesNS/-/-/saved/searches")
    # fields = execute_spl_query("search index=_internal | fieldsummary | fields field")
    # apps = execute_spl_query("| rest /services/apps/local | search disabled=0 | table label title version description")

    return aggregate_data

