# mes-data-migration-service

Service that implements data replication from the TARS source database (Oracle) to target database (Aurora MySQL), for data required by the Mobile Examiner system (primarily Journal Data).

## dms-configurator

A small node.js CLI app to generate DMS task JSON configurations from much simpler logical input.
Will be re-used within a periodic Lambda.

## table-mappings

Details of what tables/columns/rows to extract from the source database, and how to map it to the destination database. Input into the dms-configurator, which converts to AWS DMS table mapping format.
