import json
from extract.aggregate_data import aggregate_data
from transform.add_additional_info import add_additional_info
from load.save_to_mongo import save_to_mongo


data = json.loads(aggregate_data())
data['apps'] = add_additional_info(data['apps'])
data['dashboards'] = add_additional_info(data['dashboards'])
data['saved_searches'] = add_additional_info(data['saved_searches'])
data['fields'] = add_additional_info(data['fields'])


save_to_mongo('apps', data['apps'])
save_to_mongo('dashboards', data['dashboards'])
save_to_mongo('saved_searches', data['saved_searches'])
save_to_mongo('fields', data['fields'])
