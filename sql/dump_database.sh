#!/bin/bash

DATABASE="m3dlab"
SQLDUMP="$DATABASE_$(date +"%y-%m-%d-%H%M").sql"

CONTAINER=`docker-compose ps | grep _db_ | cut -d' ' -f1`
if [ $CONTAINER ]
then
  echo "Creating mysqldump from database $DATABASE in docker container $CONTAINER"
  docker exec -d $CONTAINER bash -c "mysqldump -uadmin -h127.0.0.1 -p123 $DATABASE > /root/sql-import/$SQLDUMP"
  echo "Done!"
else
  echo -e "Could not find a database container.\nDid you start it?\n"
  echo "Running docker-compose ps for you..."
  docker-compose ps
fi
