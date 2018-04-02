#!/bin/bash
#gprs regular_2g good_2g dsl good_2g regular_3g good_3g regular_4g dsl good_3g  
 
name=(regular_2g good_2g regular_3g good_3g regular_4g good_4g wifi)
for((c=0;c<7;c++))
do 	
	date
	echo ${name[c]}
	bash ./${name[c]}.sh
	# wait for the flag from xu3 
	while [ ! -f /home/mobile/Documents/odroid/network/code/set_radio/flag.txt ]
	do
		sleep 10			
	done
	rm /home/mobile/Documents/odroid/network/code/set_radio/flag.txt
#	scp -r root@192.168.0.101:/home/odroid/Documents/data/dvfs/${name[c]}/ /home/mobile/Documents/odroid/network/data/4/dvfs/
done

scp -r root@192.168.0.103:/home/odroid/Documents/data/dvfs/ /home/mobile/Documents/odroid/network/data/dvfs/
