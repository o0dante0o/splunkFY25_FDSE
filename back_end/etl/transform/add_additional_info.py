from datetime import datetime

def add_additional_info(data_list):
    """
    Adds additional information to each dictionary in a list of dictionaries.

    Args:
        data_list (list): A list of dictionaries to which additional info will be added.

    Returns:
        list: The modified list of dictionaries with added info.
    """
    now = datetime.now().isoformat()  
    for item in data_list:
        item['date_time'] = now  
        item['inactive'] = False  
        item['last_edited'] = now  
    return data_list 
