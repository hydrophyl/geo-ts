#!/bin/bash
#run the scripts to update backend of the geo-ts frontend google map for "überfällige Aufträge"
update ()
{
	python fetch_grs_online.py
	python update_postcodes.py
}
while true ; do
update
sleep 1h
done

