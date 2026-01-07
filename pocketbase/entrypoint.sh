#!/bin/sh

# Check if PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD are set
if [ -n "$PB_ADMIN_EMAIL" ] && [ -n "$PB_ADMIN_PASSWORD" ]; then
    echo "Running migrations..."
    /pb/pocketbase migrate up
    
    echo "Attempting to create admin account: $PB_ADMIN_EMAIL"
    # Create the admin account. We silence stderr to avoid confusing logs if it already exists.
    # The command will fail if it exists, but that's fine.
    /pb/pocketbase admin create "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD" 2>/dev/null || echo "Admin account already exists or creation skipped."
fi

# Start PocketBase
exec /pb/pocketbase serve --http=0.0.0.0:8080
