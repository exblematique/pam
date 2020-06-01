This project created communication between sensors on common network. It's using MQTT protocol. Channel are the following :
- sensors
  - name of company
    - name of sensor

For example, for a thermometer created by Philips, the sensor need to publish in :
```sensors/philips/thermometer ```

All python script are running with Python 2 and Python 3.

## Installation
### Python
First you need to install Python 2 or 3 with all dependencies needed for program. This tutorial using Python 3.
```bash
sudo apt-get update && sudo apt-get install -y python3 python3-pip
pip3 install paho-mqtt firebase_admin 
```

### Mosquitto server
To using MQTT protocol, you need a broker. It can be installed with the following command :
```bash
sudo apt-get install mosquitto
```
To start service you have many choices : 
```bash
# To start directly
mosquitto

# Or to start a service
sudo systemctl start mosquitto.service
# To start automatically when computer started
sudo systemctl enable mosquitto.service
```

Also you can use mosquitto_pub and mosquitto_sub to test mosquitto service.
To install this, using
```bash
sudo apt-get install mosquitto-clients
```

## SimulateSensor.py
This python program simulate a sersor on mosquitto server. Program works with Python 2 and 3 and required the library paho.mqtt.
The syntax is:
```bash
python3 SimulateSensor.py [[mqttTopic] [min] [max] [delay]]
```
All arguments are optional :
- mqttTopic is the sub-topic of "sensors" to publish the value, dafult value is "1"
- min and max are the limits to generate random number, default values are 0 and 1
- delay is the minimum time to wait before to send a nem value again, default value is 0.5

## generateManySensor.sh
This is a script to generate 3 sensors at the same time. Just press enter to stop all program.

/!\ Warning, the script kills all python program currently running.

To start, using: ```./generateManySensor.py```

## readSerial.py
This program python retrieved information from serial port to publish in MQTT broker. The library paho.mqtt are needed.

The syntax for the serial port is : ```company_name;sensor_name;value\n```

Maybe you need to change port in the program. To start, using: ```python3 readSerial.py```

You can create a fake serial on Linux with the following command: [(check this link for more information)](https://stackoverflow.com/questions/52187/virtual-serial-port-for-linux)
```bash
socat -d -d pty,raw,echo=0 pty,raw,echo=0

### For example /dev/pts/2 and /dev/pts/3 are opened
# To read from serial using
cat < /dev/pts/2

# To send information using 
echo "philips;thermometer;24\n > /dev/pts/3
```

## mqttToFirebase.py
This script takes any information from topic "sensors" in MQTT broker and upload this to Firebase. Libraries paho.mqtt and firebase_admin are needed.

You probably need to change uid with your patient ID and download "serviceAccountKet.json" from Firebase.

To start, using: ```python3 mqttToFirebase.py```

## iptables.sh
This script is just to restrict access in this computer from Internet.
