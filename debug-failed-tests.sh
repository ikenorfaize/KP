#!/bin/bash

echo "=== DEBUG FAILED TESTS ==="
echo ""

# Test READ Single User
echo "1. Testing READ Single User"
echo "   Creating user first..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "x-user-id: 2" \
  -d '{
    "username": "debuguser1",
    "email": "debug1@test.com",
    "password": "password123",
    "fullName": "Debug User 1"
  }')

USER_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "   User ID: $USER_ID"

if [ ! -z "$USER_ID" ]; then
  echo "   Testing GET /api/users/$USER_ID"
  READ_RESPONSE=$(curl -s -X GET "http://localhost:3001/api/users/${USER_ID}" \
    -H "x-user-id: 2")
  echo "   Response: $READ_RESPONSE"
  
  # Cleanup
  curl -s -X DELETE "http://localhost:3001/api/users/${USER_ID}" \
    -H "x-user-id: 2" > /dev/null
fi

echo ""
echo "2. Testing READ Single News"
echo "   Creating news first..."
CREATE_NEWS=$(curl -s -X POST http://localhost:3001/api/news \
  -H "Content-Type: application/json" \
  -H "x-user-id: 2" \
  -d '{
    "title": "Debug News",
    "content": "Test content",
    "category": "berita",
    "author": "Admin"
  }')

NEWS_ID=$(echo "$CREATE_NEWS" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$NEWS_ID" ]; then
  NEWS_ID=$(echo "$CREATE_NEWS" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
fi
echo "   News ID: $NEWS_ID"

if [ ! -z "$NEWS_ID" ]; then
  echo "   Testing GET /api/news/$NEWS_ID"
  READ_NEWS=$(curl -s -X GET "http://localhost:3001/api/news/${NEWS_ID}")
  echo "   Response: $READ_NEWS"
fi

echo ""
echo "3. Testing UPDATE News"
if [ ! -z "$NEWS_ID" ]; then
  echo "   Testing PATCH /api/news/$NEWS_ID"
  UPDATE_NEWS=$(curl -s -X PATCH "http://localhost:3001/api/news/${NEWS_ID}" \
    -H "Content-Type: application/json" \
    -H "x-user-id: 2" \
    -d '{
      "title": "Updated Debug News"
    }')
  echo "   Response: $UPDATE_NEWS"
  
  # Cleanup
  curl -s -X DELETE "http://localhost:3001/api/news/${NEWS_ID}" \
    -H "x-user-id: 2" > /dev/null
fi

echo ""
echo "4. Testing UPDATE Beasiswa"
echo "   Creating beasiswa first..."
CREATE_BEASISWA=$(curl -s -X POST http://localhost:3001/api/beasiswa \
  -H "Content-Type: application/json" \
  -H "x-user-id: 2" \
  -d '{
    "name": "Debug Beasiswa",
    "description": "Test",
    "amount": "5000000",
    "deadline": "2025-12-31",
    "requirements": "Test",
    "quota": 10
  }')

BEASISWA_ID=$(echo "$CREATE_BEASISWA" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$BEASISWA_ID" ]; then
  BEASISWA_ID=$(echo "$CREATE_BEASISWA" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
fi
echo "   Beasiswa ID: $BEASISWA_ID"

if [ ! -z "$BEASISWA_ID" ]; then
  echo "   Testing PATCH /api/beasiswa/$BEASISWA_ID"
  UPDATE_BEASISWA=$(curl -s -X PATCH "http://localhost:3001/api/beasiswa/${BEASISWA_ID}" \
    -H "Content-Type: application/json" \
    -H "x-user-id: 2" \
    -d '{
      "amount": "7500000"
    }')
  echo "   Response: $UPDATE_BEASISWA"
  
  # Cleanup
  curl -s -X DELETE "http://localhost:3001/api/beasiswa/${BEASISWA_ID}" \
    -H "x-user-id: 2" > /dev/null
fi

echo ""
echo "5. Testing CREATE Application (without auth)"
CREATE_APP=$(curl -s -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Applicant",
    "email": "test@test.com",
    "phone": "08123456789",
    "address": "Test Address",
    "education": "S1",
    "institution": "Test University",
    "gpa": "3.5",
    "beasiswaId": "1",
    "reason": "Test reason"
  }')
echo "   Response: $CREATE_APP"

echo ""
echo "=== END DEBUG ==="
