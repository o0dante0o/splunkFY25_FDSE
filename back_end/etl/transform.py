import uuid
from datetime import datetime
from extract import aggregate_data
import json

def add_additional_info(data_list):
    now = datetime.now().isoformat()
    for item in data_list:
        item['date_time'] = now
        item['inactive'] = False
        item['last_edited'] = now
        item['id'] = str(uuid.uuid4())
    return data_list

data = json.loads(aggregate_data())

data['apps'] = add_additional_info(data['apps'])
data['dashboards'] = add_additional_info(data['dashboards'])
data['saved_searches'] = add_additional_info(data['saved_searches'])
data['fields'] = add_additional_info(data['fields'])

