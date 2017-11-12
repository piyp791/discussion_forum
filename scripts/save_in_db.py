import xml.dom.minidom as minidom
import mysql.connector
from mysql.connector import errorcode
import sys
import re
from unidecode import unidecode


def remove_non_ascii(text):
    return unidecode(unicode(text, encoding = "utf-8"))

class NumpyMySQLConverter(mysql.connector.conversion.MySQLConverter):
    """ A mysql.connector Converter that handles Numpy types """

    def _float32_to_mysql(self, value):
        return float(value)

    def _float64_to_mysql(self, value):
        return float(value)

    def _int32_to_mysql(self, value):
        return int(value)

    def _int64_to_mysql(self, value):
		return int(value)


def getConn():
     try:
        cnx = mysql.connector.connect(user='root', password='piyush0791',
                                      host='127.0.0.1',
                                      database='forum_db')
        print cnx
        cnx.set_converter_class(NumpyMySQLConverter)
        
        print 'connected!!'
        return cnx
     except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Invalid user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)

        return None
	


def insertIntoPosts(keyStr, value_arr, cnx):

	formatStr = '';
	for i in range(len(value_arr.split(','))):
		formatStr+='%s,';
	formatStr = formatStr[:-1];

	print 'key str-->', keyStr;
	print 'format str-->', formatStr;
	print 'value array -->', value_arr;



	add_user = ("INSERT INTO Tags (" + keyStr + ") VALUES (" + value_arr  + ")");

	#values_arr = 'some text';
	#add_user = ("INSERT INTO Posts ( Body ) VALUES ('" +values_arr + "' )");
	print 'query -->', add_user
	cursor = cnx.cursor()
	try:
	    cursor.execute(add_user)
	    cnx.commit()
	    cursor.close()
	    print "Lastrowid: ", cursor.lastrowid
	    print ("Data inserted successfully")
	    return cursor.lastrowid
	    #sys.exit();
	except Exception as e:

	    print ("Data insertion failed!!!");
	    print(e)
	    sys.exit();


def main():

	cnx = getConn()
	print cnx
	print 'Hello World'
	xmldoc = minidom.parse('../data/apple.meta.stackexchange.com/Tags.xml')
	#doc = ET.parse("apple.meta.stackexchange.com/Posts.xml");
	itemlist = xmldoc.getElementsByTagName('row')

	print len(itemlist)

	for item in itemlist:

		keys = '';
		values = '';
		for atr in item.attributes.values():
			#print atr.name, ' -', atr.value;

			#insert into database

			val = atr.value.replace("'", "");
			val = val.replace("\\", "")
			val = re.sub(r'[^\x00-\x7F]+',' ', val)
			keys = keys + "" + atr.name.replace("'", "") + ",";
			values = values + "'" + val + "',";

		keys = keys[:-1];
		values = values[:-1];
		insertIntoPosts(keys, values, cnx)
		
if __name__ == "__main__":
	main();


