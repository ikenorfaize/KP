#!/bin/bash

TIMESTAMP=$(date +%s)

echo '=== TEST 1: UPDATE Application Status ==='
echo ''

# Create beasiswa
BEASISWA=$(curl -s -X POST http://localhost:3001/api/beasiswa \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: 2' \
  -d '{
    "name": "Debug Beasiswa",
    "description": "Test",
    "amount": "5000000",
    "deadline": "2025-12-31",
    "requirements": "Test",
    "quota": 10
  }')
BEASISWA_ID=$(echo "$BEASISWA" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$BEASISWA_ID" ]; then
  BEASISWA_ID=$(echo "$BEASISWA" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
fi
echo "Beasiswa ID: $BEASISWA_ID"

# Create user for application (with timestamp for uniqueness)
USER=$(curl -s -X POST http://localhost:3001/api/users \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: 2' \
  -d "{\"username\":\"appuser${TIMESTAMP}\",\"email\":\"appuser${TIMESTAMP}@t.com\",\"password\":\"pass123456\",\"fullName\":\"App User\"}")
echo "Raw User Response: $USER"
USER_ID=$(echo "$USER" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$USER_ID" ]; then
  USER_ID=$(echo "$USER" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
fi
echo "Extracted User ID: $USER_ID"

# Create application
APP=$(curl -s -X POST http://localhost:3001/api/applications \
  -H 'Content-Type: application/json' \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"beasiswaId\": \"$BEASISWA_ID\",
    \"fullName\": \"Test Applicant\",
    \"email\": \"applicant@t.com\",
    \"phone\": \"08123456789\",
    \"address\": \"Test\",
    \"education\": \"S1\",
    \"institution\": \"Test Uni\",
    \"gpa\": \"3.5\",
    \"reason\": \"Test\",
    \"userId\": \"$USER_ID\"
  }")
APP_ID=$(echo "$APP" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$APP_ID" ]; then
  APP_ID=$(echo "$APP" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
fi
echo "Application ID: $APP_ID"
echo "Application full response:"
echo "$APP" | head -c 500
echo ""
echo ''

# Try UPDATE with string ID
echo "Trying UPDATE with string ID: $APP_ID"
UPDATE1=$(curl -s -X PUT "http://localhost:3001/api/applications/$APP_ID/status" \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: 2' \
  -d '{"status":"approved"}')
echo "Response:"
echo "$UPDATE1"
echo ''

echo '=== TEST 2: DELETE User ==='
echo ''

# Create test user
USER2=$(curl -s -X POST http://localhost:3001/api/users \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: 2' \
  -d '{"username":"deluser123","email":"deluser123@t.com","password":"pass123456","fullName":"Del User"}')
DEL_USER_ID=$(echo "$USER2" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "User to delete ID: $DEL_USER_ID"
echo "User Response:"
echo "$USER2" | head -c 500
echo ""
echo ''

# Try DELETE
echo "Trying DELETE user with ID: $DEL_USER_ID"
DELETE=$(curl -s -X DELETE "http://localhost:3001/api/users/$DEL_USER_ID" \
  -H 'x-user-id: 2')
echo "Delete Response:"
echo "$DELETE"
echo ''

# Verify deleted
echo "Verifying user deleted..."
VERIFY=$(curl -s -X GET "http://localhost:3001/api/users/$DEL_USER_ID" \
  -H 'x-user-id: 2')
echo "Verify Response:"
echo "$VERIFY"
