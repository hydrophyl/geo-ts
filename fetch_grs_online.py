import pymssql
import mysql.connector as mysql
import pandas as pd

#Connect with databases
grs_online = pymssql.connect('10.90.6.22','grs_database_reader','%$jlk27NM_1','GRS_Online_AP8')
radioshark = mysql.connect(
    host="192.168.1.117",
    database="radioshark",
    user="radioshark",
    password="uT6)PdqPOI23fsd)§",
)

grs_cursor = grs_online.cursor()
radio_cursor = radioshark.cursor()

#Fetch the ae_postcode, ae_city and ae_countcontracts from grs_online and save to df
select_query = "SELECT company_data_1.postcode AS ae_postcode, company_data_1.city AS ae_city, CAST(GETDATE() - proceed_data.start_date AS int) AS ae_countcontracts FROM proceed_position RIGHT OUTER JOIN proceed_data INNER JOIN company_data ON proceed_data.transporter_id = company_data.id LEFT OUTER JOIN regionkey_data INNER JOIN region_routing ON regionkey_data.id = region_routing.region_id RIGHT OUTER JOIN company_data AS company_data_1 ON regionkey_data.postcode = company_data_1.postcode ON proceed_data.owner_id = company_data_1.id ON proceed_position.proceed_id = proceed_data.id GROUP BY proceed_data.owner_id, proceed_data.transporter_id, proceed_data.state_id, proceed_data.contract_number, proceed_data.type, proceed_data.start_date, company_data_1.city, company_data_1.postcode, company_data.name_1, company_data.city, company_data.number, region_routing.RegionId, proceed_data.proceed_number, CAST(GETDATE() - proceed_data.start_date AS int) HAVING (proceed_data.state_id = 1101) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (company_data_1.postcode = N'66482') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) OR (proceed_data.state_id = 1102) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) OR (proceed_data.state_id = 1104) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) OR (proceed_data.state_id = 1105) AND (NOT (region_routing.RegionId IS NULL)) AND (proceed_data.contract_number = 'fahrradbatterien') AND (CAST(GETDATE() - proceed_data.start_date AS int) > 20) ORDER BY proceed_data.start_date DESC" 

grs_cursor.execute(select_query)
df= pd.DataFrame(grs_cursor.fetchall(), columns=['ae_postcode', 'ae_city', 'ae_countcontracts'])

#tbl_mapapi should be empty to ready for new datas
truncate_mapapi = "TRUNCATE TABLE tbl_mapapi"
radio_cursor.execute(truncate_mapapi)

#loop through df to insert datas
insert_query = "INSERT INTO tbl_mapapi(ae_postcode, ae_city, ae_countcontract) VALUES (%s,%s,%s)"
for index, row in df.iterrows():
    insert_data = (row[0], row[1], row[2])
    radio_cursor.execute(insert_query, insert_data)

grs_cursor.close()
radio_cursor.close()
radioshark.commit()