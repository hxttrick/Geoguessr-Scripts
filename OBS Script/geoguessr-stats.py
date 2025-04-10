import obspython as obs
import urllib.request
import urllib.error
import json

user_id     = ""
interval    = 30
source_name = ""
data_path   = ""

# ------------------------------------------------------------

def get_url():
    global user_id
    return f"https://www.geoguessr.com/api/v3/users/{user_id}/stats"

def get_value_from_path(data, path):
    keys = path.split('.')
    current = data
    for key in keys:
        if isinstance(current, dict):
            if key in current:
                current = current[key]
            else:
                obs.script_log(obs.LOG_WARNING, f"Key '{key}' not found in dictionary.")
        elif isinstance(current, list):
            try:
                index = int(key)
            except ValueError:
                obs.script_log(obs.LOG_WARNING, f"Expected an integer index for a list, got: '{key}'")
            try:
                current = current[index]
            except IndexError:
                obs.script_log(obs.LOG_WARNING, f"Index {index} out of range for list.")
        else:
            obs.script_log(obs.LOG_WARNING, "Encountered a non-dict/non-list while traversing the data path.")
    return current

def update_text():
    global interval
    global source_name
    global data_path
    global user_id
    
    url = get_url()
    source = obs.obs_get_source_by_name(source_name)
    if source is not None:
        try:
            req = urllib.request.Request(get_url(), headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = response.read().decode('utf-8')
                value = get_value_from_path(json.loads(data), data_path) 
                text = str(value)

                settings = obs.obs_data_create()
                obs.obs_data_set_string(settings, "text", text)
                obs.obs_source_update(source, settings)
                obs.obs_data_release(settings)

        except urllib.error.URLError as err:
            obs.script_log(obs.LOG_WARNING, "Error opening URL '" + url + "': " + err.reason)
            obs.remove_current_callback()

        obs.obs_source_release(source)

def refresh_pressed(props, prop):
    update_text()

# ------------------------------------------------------------

def script_description():
    return "Retrieves player stats from GeoGuessr's API and updates the specified text source at a set interval.\n\nOriginal script (url-text.py) by Lain.\nModified for GeoGuessr by Hxttrick."

def script_update(settings):
    global interval
    global source_name
    global data_path
    global user_id

    user_id     = obs.obs_data_get_string(settings, "user_id")
    data_path   = obs.obs_data_get_string(settings, "data_path")
    interval    = obs.obs_data_get_int(settings, "interval")
    source_name = obs.obs_data_get_string(settings, "source")

    obs.timer_remove(update_text)

    if get_url() != "" and source_name != "":
        obs.timer_add(update_text, interval * 1000)

def script_defaults(settings):
    obs.obs_data_set_default_int(settings, "interval", 30)

def script_properties():
    props = obs.obs_properties_create()

    obs.obs_properties_add_text(props, "user_id", "User ID", obs.OBS_TEXT_DEFAULT)
    obs.obs_properties_add_text(props, "data_path", "Data Path", obs.OBS_TEXT_DEFAULT)
    obs.obs_properties_add_int(props, "interval", "Update Interval (seconds)", 5, 3600, 1)

    p = obs.obs_properties_add_list(props, "source", "Text Source", obs.OBS_COMBO_TYPE_EDITABLE, obs.OBS_COMBO_FORMAT_STRING)
    sources = obs.obs_enum_sources()
    if sources is not None:
        for source in sources:
            source_id = obs.obs_source_get_unversioned_id(source)
            if source_id == "text_gdiplus" or source_id == "text_ft2_source":
                name = obs.obs_source_get_name(source)
                obs.obs_property_list_add_string(p, name, name)

        obs.source_list_release(sources)

    obs.obs_properties_add_button(props, "button", "Refresh", refresh_pressed)
    return props
