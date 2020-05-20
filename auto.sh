#!/bin/bash

#### Started all programs in Python
#HeartRate
python SimulateSensor.py forlife_8632/heartrate 40 300 0.5 &
#Body temperature
python SimulateSensor.py forlife_8632/arterial 20 45 1 &
#Arterial pressure
python SimulateSensor.py tmp32_3654/body_temperature 0 250 2 &



#Wait to user decide to stop program and then kill all python instance for this user
read -p 'Enter to stop the program' stop

for i in $(ps | grep python | cut -d" " -f1); do
    kill $i
    echo $i
done
