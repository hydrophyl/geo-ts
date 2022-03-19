import pymssql
import mysql.connector as mysql
import pandas as pd

# Connect with databases
grs_online = pymssql.connect(
    '10.90.6.22', 'grs_database_reader', '%$jlk27NM_1', 'GRS_Online_AP8')
radioshark = mysql.connect(
    host="grsmysql01.mysql.database.azure.com",
    database="db_radioshark",
    user="mysqladmin",
    password="RTouhz8t4827et",
)

grs_cursor = grs_online.cursor()
radio_cursor = radioshark.cursor()

# Fetch the ae_postcode, ae_city and ae_timediff from grs_online and save to df
select_query = "SELECT  company_data_1.postcode AS ae_postcode ,company_data_1.city AS ae_city ,CAST(GETDATE() - proceed_data.start_date AS int) AS ae_timediff ,company_data.name_1 AS ae_company ,proceed_number AS ae_contract_number FROM proceed_position RIGHT OUTER JOIN proceed_data INNER JOIN company_data ON proceed_data.transporter_id = company_data.id LEFT OUTER JOIN regionkey_data INNER JOIN region_routing ON regionkey_data.id = region_routing.region_id RIGHT OUTER JOIN company_data AS company_data_1 ON regionkey_data.postcode = company_data_1.postcode ON proceed_data.owner_id = company_data_1.id ON proceed_position.proceed_id = proceed_data.id GROUP BY  proceed_data.owner_id ,proceed_data.transporter_id ,proceed_data.state_id ,proceed_data.contract_number ,proceed_data.type ,proceed_data.start_date ,company_data_1.city ,company_data_1.postcode ,company_data.name_1 ,company_data.city ,company_data.number ,region_routing.RegionId ,proceed_data.proceed_number ,CAST(GETDATE() - proceed_data.start_date AS int) HAVING (proceed_data.state_id = 1101) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (company_data_1.postcode = N'66482') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) OR (proceed_data.state_id = 1102) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) OR (proceed_data.state_id = 1104) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) OR (proceed_data.state_id = 1105) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) ORDER BY proceed_data.start_date DESC"

grs_cursor.execute(select_query)
columns = ['ae_postcode', 'ae_city', 'ae_timediff',
           'ae_company', 'ae_contract_number']
df = pd.DataFrame(grs_cursor.fetchall(), columns=columns)

# tbl_mapapi should be empty to ready for new datas
truncate_mapapi = "TRUNCATE TABLE tbl_mapapi"
radio_cursor.execute(truncate_mapapi)

valuesHolder = ''
for _ in range(len(columns)):
  valuesHolder += "%s,"

valuesHolder =valuesHolder[:-1]
# loop through df to insert datas
insert_query = "INSERT INTO tbl_mapapi("+ ",".join(columns)  +") VALUES ("+valuesHolder+")"
for index, row in df.iterrows():
  insert_data = (row[0], row[1], row[2], row[3], row[4])
  radio_cursor.execute(insert_query, insert_data)

grs_cursor.close()
radio_cursor.close()
radioshark.commit()

""" CREATE TABLE `tbl_mapapi` (
  `api_index` int(11) NOT NULL AUTO_INCREMENT,
  `ae_postcode` int(11) NOT NULL,
  `ae_city` varchar(30) NOT NULL,
  `ae_timediff` int(11) NOT NULL,
  `ae_contractnumber` varchar(12) NOT NULL,
  `ae_company` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`api_index`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=latin1; """
