import sys
sys.modules['paho.mqtt.client'] = unittest.mock.MagicMock()
