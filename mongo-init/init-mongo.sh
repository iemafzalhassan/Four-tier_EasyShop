#!/bin/bash
set -e

echo "🚀 Starting MongoDB initialization script..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
until mongosh --host localhost --eval "print(\"waited for connection\")" > /dev/null 2>&1
do
    echo "MongoDB is unavailable - sleeping"
    sleep 2
done

echo "✅ MongoDB is up and running!"

# Create root user
echo "👤 Creating root user..."
mongosh --host localhost -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin << EOF
use $MONGO_INITDB_DATABASE
db.createUser({
  user: "$MONGO_INITDB_ROOT_USERNAME",
  pwd: "$MONGO_INITDB_ROOT_PASSWORD",
  roles: [
    { role: "readWrite", db: "$MONGO_INITDB_DATABASE" },
    { role: "dbAdmin", db: "$MONGO_INITDB_DATABASE" }
  ]
})
EOF

# Restore all databases
echo "📦 Starting database restoration..."
cd /docker-entrypoint-initdb.d

for DB_DIR in */; do
    if [ -d "$DB_DIR" ]; then
        DB_NAME=${DB_DIR%/}
        echo "🔄 Restoring database: $DB_NAME"
        
        # Check if directory contains files
        if [ -n "$(ls -A $DB_DIR)" ]; then
            mongorestore \
                -u "$MONGO_INITDB_ROOT_USERNAME" \
                -p "$MONGO_INITDB_ROOT_PASSWORD" \
                --authenticationDatabase admin \
                --db "$DB_NAME" \
                "$DB_DIR" \
                --drop || {
                    echo "❌ Error restoring $DB_NAME"
                    exit 1
                }
            echo "✅ Successfully restored $DB_NAME"
        else
            echo "⚠️  Skipping empty directory: $DB_DIR"
        fi
    fi
done

echo "🎉 MongoDB initialization completed successfully!"