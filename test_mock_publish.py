import sys
import unittest.mock
sys.modules['paho.mqtt.client'] = unittest.mock.MagicMock()
