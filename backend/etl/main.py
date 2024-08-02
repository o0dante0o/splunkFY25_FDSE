import json
from extract.aggregate_data import aggregate_data
from transform.add_additional_info import add_additional_info
from load.save_to_mongo import save_to_mongo
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

collections = {"apps" : "| rest /servicesNS/-/-/apps/local | fields title, description, eai:acl.owner | rename eai:acl.owner as owner, title as name",
"dashboards" : "| rest /servicesNS/-/-/data/ui/views | fields title, description, eai:acl.owner, | rename eai:acl.owner as owner, title as name", 
"reports" : "| rest /servicesNS/-/-/saved/searches | fields title, description, eai:acl.owner, | rename eai:acl.owner as owner, title as name",
"alerts" : "| rest /servicesNS/-/-/alerts | fields title, description, eai:acl.owner, | rename eai:acl.owner as owner, title as name",

"lookups" : "| rest /servicesNS/-/-/data/lookup-table-files | fields title, description, eai:acl.owner, | rename eai:acl.owner as owner, title as name",
"fields" :  "search index=_internal | fieldsummary | fields field, count, values | rename field as title, values as description, count as owner",
"index" : "| rest /servicesNS/-/-/data/indexes | fields title, description, eai:acl.owner, | rename eai:acl.owner as owner, title as name",
"sources" : "| rest /servicesNS/-/-/data/inputs/monitor | fields title, description, eai:acl.owner, | rename eai:acl.owner as owner, title as name"
}

data = json.loads(aggregate_data(collections))

enriched_data = add_additional_info(data)

for collection in enriched_data:
    save_to_mongo(collection, enriched_data[collection])

print('ETL process completed successfully')
