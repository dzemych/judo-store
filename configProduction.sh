# Verify that latest git version is installed
git pull

# Check if there exists .next, if yes delete
if [ -d ".next" ]
then
  rm -r .next
  echo "Deleted .next folder"
fi

# Build client (next) in production (out code)
yarn build
echo "//////////////////////"
echo "Client build completed"

# Build admin in production
cd admin
yarn build
cd ..

echo "//////////////////////"
echo "Admin build completed"

# If there is ser
DIR="server/public/admin"
if [ -d "$DIR" ]
then
  rm -r $DIR
  echo "Deleted server/public/admin folder (admin front end"
fi

mv admin/build server/public/admin
echo "Client front moved to server public folder"

echo "Project is ready for production start !!!!!!"