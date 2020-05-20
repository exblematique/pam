#!/bin/bash

#Vider les tables actuelles et règles personnelles
iptables -t filter -F
iptables -t filter -X

#Interdire toutes les connexions
iptables -t filter -P INPUT DROP
iptables -t filter -P FORWARD DROP
iptables -t filter -P OUTPUT DROP

# Ne pas casser les connexions etablies
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

# Authorized loopback
iptables -t filter -A INPUT -i lo -j ACCEPT
iptables -t filter -A OUTPUT -o lo -j ACCEPT

# ICMP (Ping) "For IoT object only"
iptables -t filter -A INPUT -p icmp -s 10.0.0.0/8 -j ACCEPT
iptables -t filter -A INPUT -p icmp -s 172.16.0.0/12 -j ACCEPT
iptables -t filter -A INPUT -p icmp -s 192.168.0.0/16 -j ACCEPT
iptables -t filter -A OUTPUT -p icmp -s 10.0.0.0/8 -j ACCEPT
iptables -t filter -A OUTPUT -p icmp -s 172.16.0.0/12 -j ACCEPT
iptables -t filter -A OUTPUT -p icmp -s 192.168.0.0/16 -j ACCEPT

# DNS Connection
iptables -t filter -A INPUT -p tcp --dport 53 -j ACCEPT
iptables -t filter -A INPUT -p udp --dport 53 -j ACCEPT
iptables -t filter -A OUTPUT -p tcp --dport 53 -j ACCEPT
iptables -t filter -A OUTPUT -p udp --dport 53 -j ACCEPT

# NTP Out
iptables -t filter -A OUTPUT -p udp --dport 123 -j ACCEPT

# Access internet
iptables -t filter -A OUTPUT -p tcp --dport 80 -j ACCEPT
iptables -t filter -A OUTPUT -p tcp --dport 443 -j ACCEPT

# Access on mosquitto server from inside network only
iptables -t filter -A INPUT -p tcp --dport 1883 -s 10.0.0.0/8 -j ACCEPT
iptables -t filter -A INPUT -p tcp --dport 1883 -s 172.16.0.0/12 -j ACCEPT
iptables -t filter -A INPUT -p tcp --dport 1883 -s 192.168.0.0/16 -j ACCEPT

# Forbidden SSH Connection
# Remove after !
#iptables -t filter -A INPUT -p tcp --dport 22 -j ACCEPT
#iptables -t filter -A OUTPUT -p tcp --dport 22 -j ACCEPT
