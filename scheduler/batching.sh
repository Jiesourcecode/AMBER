#!/bin/bash

# enable the sensors
echo 1 > /sys/bus/i2c/drivers/INA231/3-0045/enable
echo 1 > /sys/bus/i2c/drivers/INA231/3-0040/enable
echo 1 > /sys/bus/i2c/drivers/INA231/3-0041/enable
echo 1 > /sys/bus/i2c/drivers/INA231/3-0044/enable

echo 1 > /sys/bus/i2c/drivers/INA231/3-0045/enable
echo 1 > /sys/bus/i2c/drivers/INA231/3-0040/enable
echo 1 > /sys/bus/i2c/drivers/INA231/3-0041/enable
echo 1 > /sys/bus/i2c/drivers/INA231/3-0044/enable
# settle 5 seconds to the sensors get fully enabled and have the first reading


sleep 5

m=900

flagbb=0
flagbl=0
flaglb=0
flagll=0

bb_b=0
bb_l=0

bl_b=0
bl_l=0

lb_b=0
lb_l=0

ll_b=0
ll_l=0

if [ $2 = "regular_2g" ]||[ $2 = "good_2g" ];then
	flagll=1
	ll_b=(4 8)
	ll_l=(4 8 11)

	flagbb=1
	bb_b=(12 16 20)
	bb_l=(8 11 14)

	flagbl=1
	bl_b=(16 20)
	bl_l=(8 11 14)
else 
	if [ $2 = "regular_3g" ];then

		flagll=1
		ll_b=(4)
		ll_l=(4 8)

		flaglb=1
		lb_b=(4 8)
		lb_l=(4 8)
	fi
	
	if [ $2 = "wifi" ];then
		flaglb=1
		lb_b=(4 8 12)
		lb_l=(4 8)

		flagbb=1
		bb_b=(4 8)
		bb_l=(4)
	fi
fi

rootdir=/home/odroid/Documents/data/all/

if [ $flagbb -eq 1 ];then
############################################################################3
########brow and render on the big
#Setting the chromium process affinity
rm pid
#get all of chromium process pid,and store them in pid file 
ps -ef|grep "chromium"|awk '{print $2}'>./pid

#read the file,and taskset the pid
cat pid|while read line 
do
	taskset -p -a f0 $line
done
sleep 5
#########################################################
# record dir
dir=$2
RECORD=$rootdir$2/$1'bb'.txt

#table information
echo "Time,A15,A7,MEM,GPU">>"$RECORD"

#each freq comb time to stay

#big little 

b=${#bb_b[@]}
l=${#bb_l[@]}

for((i=0;i<b;i++))
do
	let bigfreq=bb_b[i]*100000
	for((k=0;k<l;k++))
	do
		let littlefreq=bb_l[k]*100000
		taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
        taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
	
		#get log time to initialize file name
		littlecore=`cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq`
		bigcore=`cat /sys/devices/system/cpu/cpu4/cpufreq/scaling_max_freq`
		let big=$bigcore\/100000
		let little=$littlecore\/100000		
		echo "b$big-l$little">>"$RECORD"
###################
# make sure all the processes on the big core
		rm pid
		#get all of chromium process pid,and store them in pid file 
		ps -ef|grep "chromium"|awk '{print $2}'>./pid
		
		#read the file,and taskset the pid
		cat pid|while read line 
		do
			taskset -p -a f0 $line
		done
##################
		# Main infinite loop
		for((j=0;j<m;j++))  
		do  
		
		A7_W=`cat /sys/bus/i2c/drivers/INA231/3-0045/sensor_W`
		A15_W=`cat /sys/bus/i2c/drivers/INA231/3-0040/sensor_W`
		MEM_W=`cat /sys/bus/i2c/drivers/INA231/3-0041/sensor_W`
		GPU_W=`cat /sys/bus/i2c/drivers/INA231/3-0044/sensor_W`
		LOG_TIME=$(date +"%H.%M.%S.%N"|cut --b 1-10)
		echo "$LOG_TIME,$A15_W,$A7_W,$MEM_W,$GPU_W">>"$RECORD"
	
		sleep 0.02
		done
	#after 2 seconds sleep, change the cpu freq
	sleep 1
	done
done
fi


if [ $flagbl -eq 1 ];then
########################################################################
#brow on the big -render on the little
rm pid
#get all of chromium process pid,and store them in pid file 
ps -ef|grep "chromium"|awk '{print $2}'>./pid

#read the file,and taskset the chromium pid
cat pid|while read line 
do
	taskset -p -a f0 $line
done	

rm rendererPid
#get all of chromium process pid,and store them in pid file 
ps -ef|grep chromium|grep renderer|grep -v extension|awk '{print $2}'>./rendererPid
#read the file,and taskset the render pid

line=`head -1 rendererPid`
taskset  -a -p 0f $line

sleep 5
##########################

#Start Recording
RECORD=$rootdir$2/$1'bl'.txt

#table information
echo "Time,A15,A7,MEM,GPU">>"$RECORD"

b=${#bl_b[@]}
l=${#bl_l[@]}
###
for((i=0;i<b;i++))
do
	let bigfreq=bl_b[i]*100000
###
	for((k=0;k<l;k++))
	do
		let littlefreq=bl_l[k]*100000
		taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
       	taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
	
		#get log time to initialize file name
		littlecore=`cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq`
		bigcore=`cat /sys/devices/system/cpu/cpu4/cpufreq/scaling_max_freq`
		let big=$bigcore\/100000
		let little=$littlecore\/100000		
		echo "b$big-l$little">>"$RECORD"
#################
		#Ensure the render on the little core
		rm pid
		#get all of chromium process pid,and store them in pid file 
		ps -ef|grep "chromium"|awk '{print $2}'>./pid
		
		#read the file,and taskset the chromium pid
		cat pid|while read line 
		do
			taskset -p -a f0 $line
		done	

		rm rendererPid
		#get all of chromium process pid,and store them in pid file 
		ps -ef|grep chromium|grep renderer|grep -v extension|awk '{print $2}'>./rendererPid
		#read the file,and taskset the render pid
		line=`head -1 rendererPid`
		taskset  -a -p 0f $line
###	################
		# Main infinite loop
		for((j=0;j<m;j++))  
		do  

		A7_W=`cat /sys/bus/i2c/drivers/INA231/3-0045/sensor_W`
		A15_W=`cat /sys/bus/i2c/drivers/INA231/3-0040/sensor_W`
		MEM_W=`cat /sys/bus/i2c/drivers/INA231/3-0041/sensor_W`
		GPU_W=`cat /sys/bus/i2c/drivers/INA231/3-0044/sensor_W`
		LOG_TIME=$(date +"%H.%M.%S.%N"|cut --b 1-10)
		echo "$LOG_TIME,$A15_W,$A7_W,$MEM_W,$GPU_W">>"$RECORD"
	
		sleep 0.02
		done

	#after 2 seconds sleep, change the cpu freq
	sleep 1
	done
done
fi


if [ $flaglb -eq 1 ];then
#########################################################################
#brow on the little     render on the big 
rm pid
#get all of chromium process pid,and store them in pid file 
ps -ef|grep "chromium"|awk '{print $2}'>./pid

#read the file,and taskset the chromium pid
cat pid|while read line 
do
	taskset -p -a 0f $line
done

rm rendererPid
#get all of chromium process pid,and store them in pid file 
ps -ef|grep chromium|grep renderer|grep -v extension|awk '{print $2}'>./rendererPid

#read the file,and taskset the render pid
line=`head -1 rendererPid`
taskset  -a -p f0 $line

sleep 5
##################################
#Start Recording
RECORD=$rootdir$2/$1'lb'.txt

#table information
echo "Time,A15,A7,MEM,GPU">>"$RECORD"
 
b=${#lb_b[@]}
l=${#lb_l[@]}
###
for((i=0;i<b;i++))
do
	let bigfreq=lb_b[i]*100000
###
	for((k=0;k<l;k++))
	do
		let littlefreq=lb_l[k]*100000
		taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
       		taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1

		#get log time to initialize file name
		littlecore=`cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq`
		bigcore=`cat /sys/devices/system/cpu/cpu4/cpufreq/scaling_max_freq`
		let big=$bigcore\/100000
		let little=$littlecore\/100000		
		echo "b$big-l$little">>"$RECORD"
########################################	
		rm pid
		#get all of chromium process pid,and store them in pid file 
		ps -ef|grep "chromium"|awk '{print $2}'>./pid

		#read the file,and taskset the chromium pid
		cat pid|while read line 
		do
			taskset -p -a 0f $line
		done

		rm rendererPid
		#get all of chromium process pid,and store them in pid file 
		ps -ef|grep chromium|grep renderer|grep -v extension|awk '{print $2}'>./rendererPid

		#read the file,and taskset the render pid
		line=`head -1 rendererPid`
		taskset  -a -p f0 $line
###	################################
		# Main infinite loop
		for((j=0;j<m;j++))   
		do

		A7_W=`cat /sys/bus/i2c/drivers/INA231/3-0045/sensor_W`
		A15_W=`cat /sys/bus/i2c/drivers/INA231/3-0040/sensor_W`
		MEM_W=`cat /sys/bus/i2c/drivers/INA231/3-0041/sensor_W`
		GPU_W=`cat /sys/bus/i2c/drivers/INA231/3-0044/sensor_W`

		LOG_TIME=$(date +"%H.%M.%S.%N"|cut --b 1-10)
		echo "$LOG_TIME,$A15_W,$A7_W,$MEM_W,$GPU_W">>"$RECORD"
	
		sleep 0.02
		done

	#after 1 seconds sleep, change the cpu freq
	sleep 1
	done
done
fi


if [ $flagll -eq 1 ];then
##########################################################################
#both little
rm pid
#get all of chromium process pid,and store them in pid file 
ps -ef|grep "chromium"|awk '{print $2}'>./pid

#read the file,and taskset the pid
cat pid|while read line 
do
	taskset -p -a 0f $line
done
sleep 5
##################################################
#Start Recording
RECORD=$rootdir$2/$1'll'.txt

#table information
echo "Time,A15,A7,MEM,GPU">>"$RECORD"

b=${#ll_b[@]}
l=${#ll_l[@]} 
###
for((i=0;i<b;i++))
do
	let bigfreq=ll_b[i]*100000
###
	for((k=0;k<l;k++))
	do
		let littlefreq=ll_l[k]*100000
		taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
   		taskset -c 1 ./set_cpu_freq.sh $bigfreq $littlefreq > /dev/null 2>1
	
		#get log time to initialize file name
		littlecore=`cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq`
		bigcore=`cat /sys/devices/system/cpu/cpu4/cpufreq/scaling_max_freq`
		let big=$bigcore\/100000
		let little=$littlecore\/100000		
		echo "b$big-l$little">>"$RECORD"
##################################
		rm pid
		#get all of chromium process pid,and store them in pid file 
		ps -ef|grep "chromium"|awk '{print $2}'>./pid

		#read the file,and taskset the pid
		cat pid|while read line 
		do
			taskset -p -a 0f $line
		done
		sleep 5
############################
		# Main infinite loop
		for((j=0;j<m;j++))   
		do
		A7_W=`cat /sys/bus/i2c/drivers/INA231/3-0045/sensor_W`
		A15_W=`cat /sys/bus/i2c/drivers/INA231/3-0040/sensor_W`
		MEM_W=`cat /sys/bus/i2c/drivers/INA231/3-0041/sensor_W`
		GPU_W=`cat /sys/bus/i2c/drivers/INA231/3-0044/sensor_W`
		
		LOG_TIME=$(date +"%H.%M.%S.%N"|cut --b 1-10)
		echo "$LOG_TIME,$A15_W,$A7_W,$MEM_W,$GPU_W">>"$RECORD"
	
		sleep 0.02
		done
	#after 1 seconds sleep, change the cpu freq
	sleep 1
	done
done
fi

