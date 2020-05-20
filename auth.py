import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import paho.mqtt.client as mqtt
from time import ctime as date

#To exit porperly the program
from signal import signal, SIGINT

continueProg = True
def handler(sig, frame):
    global continueProg
    continueProg = False
signal(SIGINT, handler)


#Value to setup program
mqtt_topic_receive = "sensors/"
mqtt_broker_ip = "localhost"
mqtt_port = 1883
uid = "V1X9dyrXQxcgdQYxTvEQGd7fNgp1"
value = []

##########   Connection to Firebase
#Using authentification with json containt private key of server.
#TODO Needed to secure this !
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client().collection('Users').document(uid).collection("data")

##########   Connection to mqtt broker
client = mqtt.Client()

#This function is called when this program is conncted to the broker 
def on_connect(client, userdata, flag, rc):
    print("Connected!"+str(rc))
    client.subscribe(mqtt_topic_receive+"#")

#This function is called when the program receive a message from broker
def on_message(client, userdata, msg):
    topic = msg.topic.split('/')
    name = topic[1]
    for t in topic[2:]:
        name += "-" + t 
    #name = msg.topic[len(mqtt_topic_receive):]
    value = float(msg.payload)
    data = {
        u'name': name,
        u'lastValue': value,
        u'allValues': firestore.ArrayUnion([{
            u'date': unicode(date()),
            u'value': value
        }])
    }
    print("-----\nName: " + name + "\nData: " + str(msg.payload))
    db.document(name).update(data)
    #Update array of last value
    #db.document(name).update({u'allValues': firestone.ArrayUnion([
    #    float(msg.payload)])
    #})
    """
    db.document(name).update({u'allValues': firestone.ArrayUnion([{
        u'date': firestore.SERVER_TIMESTAMP,
        u'value': float(msg.payload) }])
    })
    """    
client.on_connect = on_connect
client.on_message = on_message

client.connect(mqtt_broker_ip, mqtt_port)
client.loop_start()

while continueProg:
    pass

# Use the application default credentials
#TODO Clean code
"""cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
      'projectId': 'pam-iot',
    })
""

data = {
        u'name': u'Los Angeles',
        u'state': u'CA',
        u'country': u'USA'
    }
"""
# Add a new doc in collection 'cities' with ID 'LA'
#db.collection(u'cities').document(u'LA').set(data)

client.disconnect()
print("MQTT is disconnected")
