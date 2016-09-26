exit

PNAME="httpHelper.socket.js"
PATHNAME="/home/topublic"

. /etc/profile
cd $PATHNAME

LENGTH=`ps -ef|grep "$PNAME"|grep -v grep|cut -b 49-200|wc -c `
if test $LENGTH -eq 0
then
date >> HHS.log
echo "httpHelper.socket.js was stoped. restart..." >> HHS.log
forever start httpHelper.socket.js >> HHS.log
else
date >> HHS.log
echo "httpHelper.socket.js is running..." >> HHS.log
fi
