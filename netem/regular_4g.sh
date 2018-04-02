TC=/sbin/tc
IF=enp6s0            # Interface
DNLD=2Mbps          # DOWNLOAD Limit
UPLD=1Mbps          # UPLOAD Limit server end speed 50kb
IP=192.168.0.102     # Host IP

#stop reset 
$TC qdisc del dev $IF root	

U32="$TC filter add dev $IF protocol ip parent 1:0 prio 1 u32"
$TC qdisc add dev $IF root handle 1: htb default 11
$TC class add dev $IF parent 1: classid 1:1 htb rate $DNLD
$TC class add dev $IF parent 1:1 classid 1:11 htb rate $UPLD
$TC qdisc add dev $IF parent 1:11 handle 10: netem delay 40ms
$U32 match ip dst $IP/32 flowid 1:1
$U32 match ip src $IP/32 flowid 1:11
