import mysql.connector as mysql
import googlemaps
import pandas as pd

API_KEY='AIzaSyAJII_Ra02NnEC_GapY-czZen0wQMANIGM'
gmaps_key = googlemaps.Client(key=API_KEY)

db = mysql.connect(
    host="grsmysql01.mysql.database.azure.com",
    database="db_radioshark",
    user="mysqladmin",
    password="RTouhz8t4827et",
)

cursor = db.cursor()

#Fetch all current records of postcodes
select_postcodes = "SELECT DISTINCT ae_postcode FROM tbl_mapapi"
cursor.execute(select_postcodes)
df = pd.DataFrame(cursor.fetchall(), columns = ['ae_postcode'])

#Fetch saved postcodes
select_saved_postcodes = "SELECT postcode FROM tbl_postcodes"
cursor.execute(select_saved_postcodes)
df1 = pd.DataFrame(cursor.fetchall(), columns = ['postcode'])

#loop through postcodes, if not exists in saved postcodes then geocode, save in table tbl_postcodes
for index, row in df.iterrows():
  ae_postcode = df.ae_postcode[index]
  address = str(df.ae_postcode[index]) + ', Germany'
  exists = False
  if ae_postcode in df1['postcode'].values:
    print(ae_postcode, df1['postcode'][index])
    print("this postcode is already in the database")
    exists= True
  else:
    print("this post code will be added: ", ae_postcode)
  if not exists:
    print("adding this postcode and its geocode to database")
    g = gmaps_key.geocode(address)
    lat = g[0]['geometry']['location']['lat']
    lng = g[0]['geometry']['location']['lng']
    insert_query = "INSERT INTO tbl_postcodes(postcode, lat, lng) VALUES( %s, %s, %s) "
    insert_data = (ae_postcode, lat, lng)
    cursor.execute(insert_query, insert_data)
    
cursor.close()
db.commit()

