"""
    Programme pour la recuperation des donnees depuis le port serie du Raspberry Pi.
    La syntaxe du port serie est :
        entreprise;capteur;valeur\n
"""

##Bibliotheque
#Communication avec les ports series
import serial
from signal import signal, SIGINT
import paho.mqtt.client as mqtt

## Variables
#Configuration
port = '/dev/pts/3'
mqtt_topic = "sensors/"
mqtt_broker_ip = "localhost"

#Etat du fonctionnement du programme
continuer = True
client = mqtt.Client()



## Fonctions
#To exit porperly the program
def handler(sig, frame):
    global continuer
    continuer = False
    

def validate(line):
    ''' Fonction qui verifie que la ligne est correcte '''
    if (len(line) != 3):
        return False
    try:
        float(line[2])
    except:
        return False
    return True

## Programme
def main():
    global continuer
    print("Start program...")
    
    while (continuer):
        if (ser.in_waiting != 0):
            raw = str(ser.read_until())
            print("Receive: " + raw)
            line = raw.split(';')
            if (validate(line)):
                client.publish(mqtt_topic + line[0] + "/" + line[1], line[2])


## Initialisation
signal(SIGINT, handler)
ser = serial.Serial(port, 9600)
client.connect(mqtt_broker_ip, 1883)
client.loop_start()
main()
client.disconnect()
