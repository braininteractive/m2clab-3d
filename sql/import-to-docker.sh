#!/bin/bash
#
# This script will create the database DATABASE in the docker db container
# and also import the sql dump from the file specified in the command line (SQLDUMP)
#
#

DATABASE="boilerplate_local"
SQLDUMP="boilerplate_local_dump.sql"

if [ $1 ]
then
  OPTFILE=${1##*/}

  if [ -f sql/$OPTFILE ]
  then
    SQLDUMP=$OPTFILE
  else
    echo "Could not find the SQL file $OPTFILE"
  fi
fi

CONTAINER=`docker-compose ps | grep _db_ | cut -d' ' -f1`
if [ $CONTAINER ]
then
  echo "Creating/Cleaning database $DATABASE in docker container $CONTAINER"
  docker exec -it $CONTAINER mysql -h127.0.0.1 -u"admin" -p"123" -e"DROP DATABASE IF EXISTS $DATABASE"
  docker exec -it $CONTAINER mysql -h127.0.0.1 -u"admin" -p"123" -e"CREATE DATABASE IF NOT EXISTS $DATABASE"
  echo "Importing MySQL dump from sql/$SQLDUMP"
  docker exec -it $CONTAINER mysql -h127.0.0.1 -u"admin" -p"123" -e"source /root/sql-import/$SQLDUMP" $DATABASE
else
  echo -e "Could not find a database container.\nDid you start it?\n"
  echo "Running docker-compose ps for you..."
  docker-compose ps
fi