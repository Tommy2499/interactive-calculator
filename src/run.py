import json

def events(gender):
    f = open("./src/Coefficients2025.json")
    data = json.load(f)
    f.close()
    keys = data[gender].keys()
    for key in keys:
        print(f"\"\" : \"{key}\",")

def get_events(gender):
    """Helper function to get event names without printing."""
    with open("./src/Coefficients2025.json") as f:
        data = json.load(f)
    return set(data[gender].keys())  # Return events as a set

def compare_events(gender):
    """Compares the events of the specified gender with the other gender."""
    if gender not in ["men", "women"]:
        print("Invalid gender. Please use 'men' or 'women'.")
        return

    other_gender = "women" if gender == "men" else "men"

    # Get events for both genders
    gender_events = get_events(gender)
    other_gender_events = get_events(other_gender)

    # Find shared and unique events
    shared_events = gender_events & other_gender_events  # Intersection
    unique_events = gender_events - other_gender_events  # Difference

    print(f"Shared events ({gender} & {other_gender}):")
    for event in sorted(shared_events):
        print(f"\"\" : \"{event}\",")

    print(f"\nUnique events ({gender} only):")
    for event in sorted(unique_events):
        print(f"\"\" : \"{event}\",")

def load_event_map(opposite_gender):
    """Load event mapping dictionary from EventMap.json for the opposite gender."""
    with open("./src/EventMap.json") as f:
        event_map = json.load(f)
    return event_map[opposite_gender]  # Extract only the opposite gender's events

def format_events(events_dict):
    """Format events dictionary into the required print format."""
    for category, events in events_dict.items():
        if events:  # Only print categories that have events
            print(f"\n{category}:")
            for event, key in sorted(events.items()):
                print(f"\"{event}\" : \"{key}\",")


def compare_and_format_events(gender):
    """Compares gender-specific events to the opposite gender's events and prints formatted output."""
    if gender not in ["men", "women"]:
        print("Invalid gender. Please use 'men' or 'women'.")
        return

    # Determine the opposite gender's dictionary
    opposite_gender = "women" if gender == "men" else "men"

    # Load event mapping for the opposite gender
    opposite_event_map = load_event_map(opposite_gender)
    
    # Flatten all event names from the opposite gender's dictionary
    opposite_events = get_events(opposite_gender)

    # Retrieve events for the selected gender
    gender_events = get_events(gender)

    # Determine shared and unique events
    shared_events = gender_events & opposite_events
    unique_events = gender_events - opposite_events

    # Create dictionaries for formatted output
    formatted_shared = {}
    formatted_unique = {"Outdoor": {}, "Indoor": {}}  # Empty keys for unique events

    # Populate shared events using existing keys from the opposite gender’s dictionary
    for category, events in opposite_event_map.items():
        shared_keys = {event: key for event, key in events.items() if event in shared_events}
        if shared_keys:
            formatted_shared[category] = shared_keys

    # Populate unique events with empty keys (only events NOT shared)
    for event in unique_events:
        if event in opposite_event_map.get("Outdoor", {}):
            formatted_unique["Outdoor"][event] = ""
        elif event in opposite_event_map.get("Indoor", {}):
            formatted_unique["Indoor"][event] = ""
        else:
            formatted_unique["Outdoor"][event] = ""  # Default to outdoor if unknown

    # Print results
    print(f"\nShared events for {gender} with keys:")
    format_events(formatted_shared)

    print(f"\nUnique events for {gender} (no assigned keys):")
    format_events(formatted_unique)

# Example usage:
# compare_and_format_events("women")
# compare_and_format_events("men")


#events("men")
#events("women")
#compare_events("women")
compare_and_format_events("women")