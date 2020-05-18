#!/bin/bash

#### Started all programs in Python
#HeartRate
python SimulateSensor.py 1 40 300 0.1 &
#Body temperature
python SimulateSensor.py 2 20 45 1 &
#Arterial pressure
python SimulateSensor.py 3 0 250 2 &



#Wait to user decide to stop program and then kill all python instance for this user
read -p 'Enter to stop the program' stop

for i in $(ps | grep python | cut -d" " -f2); do
	 kill $i
	 echo $i
done
