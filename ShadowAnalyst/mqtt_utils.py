import paho.mqtt.client as mqtt

def create_mqtt_client(user=None, password=None):
    """
    Creates and returns a configured MQTT client using VERSION2 of the Callback API.
    Optionally sets username and password if provided.
    """
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    if user:
        client.username_pw_set(user, password)
    return client
