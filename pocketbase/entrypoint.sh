#!/bin/sh

# Check if PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD are set
if [ -n "$PB_ADMIN_EMAIL" ] && [ -n "$PB_ADMIN_PASSWORD" ]; then
    echo "Running migrations..."
    /pb/pocketbase migrate up
    
    echo "Attempting to create admin account: $PB_ADMIN_EMAIL"
    # Create the admin account. We silence both stdout and stderr to avoid noise.
    /pb/pocketbase admin create "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD" >/dev/null 2>&1 || echo "Admin account already exists or creation skipped."
fi

# Start PocketBase
exec /pb/pocketbase serve --http=0.0.0.0:8080
