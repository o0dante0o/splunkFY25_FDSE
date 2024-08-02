from datetime import datetime

def add_additional_info(results):
    """
    Adds additional information to each dictionary in a list of dictionaries.

    Args:
        results (dict): A dictionary of lists of dictionaries to which additional info will be added.

    Returns:
        dict: The modified dictionary with added info in each list of dictionaries.
    """
    now = datetime.now().isoformat()  
    
    # Define the base structure with all necessary fields
    base_structure = {
        'name': None,
        'description': None,
        'owner': None,
        'custom_clasification': 'unclassified',
        'tags': [],
        'date_time': now,
        'inactive': False,
        'last_edited': now
    }

    enriched_data = {}

    for key, items in results.items():
        enriched_items = []
        for item in items:
            enriched_item = base_structure.copy()
            enriched_item.update(item)
            enriched_items.append(enriched_item)
        enriched_data[key] = enriched_items
    
    return enriched_data
