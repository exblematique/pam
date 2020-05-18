"""
Python MQTT Subscription client - No Username/Password
Thomas Varnish (https://github.com/tvarnish), (https://www.instructables.com/member/Tango172)
Written for my Instructable - "How to use MQTT with the Raspberry Pi and ESP8266"
"""
import paho.mqtt.client as mqtt
from time import sleep
from random import random

# Don't forget to change the variables for the MQTT broker!
mqtt_topic_receive = "sensors"
mqtt_topic_send = "sensors"
mqtt_broker_ip = "localhost"

client = mqtt.Client()
delay = 0.5        #Waitng for delay seconds between each send

#Function will return a value to send in message 
def value():
    return random()

# Once everything has been set up, we can (finally) connect to the broker
# 1883 is the listener port that the MQTT broker is using
client.connect(mqtt_broker_ip, 1883)

# Once we have told the client to connect, let the client object run itself
client.loop_start()

while True:
    client.publish(mqtt_topic_send, value())
    sleep(delay)

client.disconnect()
