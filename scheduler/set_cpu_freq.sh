#!/bin/bash

#initial value set onecore would change the cluster
bigcore=4
bigfreq=$1
littlecore=0
littlefreq=$2


# set cpu frequency
echo $bigfreq> /sys/devices/system/cpu/cpu$bigcore/cpufreq/scaling_max_freq
echo $bigfreq> /sys/devices/system/cpu/cpu$bigcore/cpufreq/scaling_min_freq

echo $littlefreq> /sys/devices/system/cpu/cpu$littlecore/cpufreq/scaling_max_freq
echo $littlefreq> /sys/devices/system/cpu/cpu$littlecore/cpufreq/scaling_min_freq
