"""
Send many information in channel
All arguments are optionals
python SimulateSensor.py idNumber=0 minimum=0 maximum=1 delay=0.5 
"""
import paho.mqtt.client as mqtt
import sys
from time import sleep
from random import random


"""
This function return a string
Default value is return if the argument doesn't exist
"""
def testArg(argPosition, default):
    try:
        return str(sys.argv[argPosition])
    except:
        return str(default)

# Don't forget to change the variables for the MQTT broker!
mqtt_topic_send = "sensors/" + testArg(1,0)
mqtt_broker_ip = "localhost"

client = mqtt.Client()

minValue = float(testArg(2, 0))
maxValue = float(testArg(3, 1))
delay = float(testArg(4, 0.5))
    

#Function will return a value to send in message 
def value():
    return random() * (maxValue - minValue) + minValue

# Once everything has been set up, we can (finally) connect to the broker
# 1883 is the listener port that the MQTT broker is using
client.connect(mqtt_broker_ip, 1883)

# Once we have told the client to connect, let the client object run itself
client.loop_start()

while True:
    client.publish(mqtt_topic_send, value())
    sleep(delay)

client.disconnect()
