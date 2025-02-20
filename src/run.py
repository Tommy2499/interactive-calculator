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

def sorted_events(gender):
    return sorted(list(get_events(gender)))

def print_sorted_events(gender):
    for event in sorted_events(gender):
        print(f"\"\" : \"{event}\",")

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

def sort_map(gender, season):
    with open("./src/EventMap.json") as f:
        data = json.load(f)[gender][season]

    track = []
    jumps = []
    throws = []
    hurdles = []
    walks = []
    roads = []
    multis = []
    other = []
    
    for key, value in data.items():
        if key.endswith("m") or key.endswith("Mile") or "Mixed" in key:
            track.append({key: value})
        elif "mH" in key or "Steeplechase" in key:
            hurdles.append({key: value})
        elif "Jump" in key or "Vault" in key:
            jumps.append({key: value})
        elif "Throw" in key or "Put" in key:
            throws.append({key: value})
        elif "Walk" in key:
            walks.append({key: value})
        elif "Road" in key:
            roads.append({key: value})
        elif "athlon" in key:
            multis.append({key: value})
        else:
            other.append({key: value})

    def sort_track(event):
        str_event = list(event.keys())[0]
        mile_key = "Mile" in str_event
        key = str_event.split(" ")[0]
        if "x" in key:
            key = "1000" + key
        bad_chars = ",mHx"
        translation_table = str.maketrans("", "", bad_chars)
        key = int(key.translate(translation_table))
        if mile_key:
            key *= 1609
        if "Mixed" in str_event:
            key += 1
        return key
    
    def sort_km(event):
        key = list(event.keys())[0].split("km")[0]
        return int(key)
    
    def sort_walk(event):
        str_event = list(event.keys())[0]
        road = 1
        if "Track" in str_event:
            road = 0
        return 1000 * sort_km(event) + road
        
    def sort_road(event):
        str_event = list(event.keys())[0]
        if "km" in str_event:
            return 1000 * sort_km(event)
        elif "Half Marathon" in str_event:
            return 21097
        elif "Marathon" in str_event:
            return 42195
        elif "Mile" in str_event:
            return 1609 * (int(str_event.split(" ")[0]))
        else:
            return sort_track(event)
        
    def sort_jumps(event):
        str_event = list(event.keys())[0]
        if "Vault" in str_event:
            return f"Vault {str_event}"
        else:
            return str_event

    track = sorted(track, key = sort_track)
    hurdles = sorted(hurdles, key = sort_track)
    jumps = sorted(jumps, key = sort_jumps)
    throws = sorted(throws, key = lambda x: list(x.keys())[0])
    walks = sorted(walks, key = sort_walk)
    roads = sorted(roads, key = sort_road)
    multis = sorted(multis, key = lambda x: list(x.keys())[0])
    other = sorted(other, key = lambda x: list(x.keys())[0])
    

    all = track + hurdles + jumps + throws + multis + roads + walks + other

    return all

def print_sorted_map(gender, season):
    sorted_events = sort_map(gender, season)
    for event in sorted_events:
        key = list(event.keys())[0]
        value = event[key]
        print(f"\"{key}\" : \"{value}\",")

# Example usage:
# compare_and_format_events("women")
# compare_and_format_events("men")


#events("men")
#events("women")
#compare_events("women")
#compare_and_format_events("women")

#print_sorted_events("men")
print_sorted_map("women", "Indoor")