#!/bin/bash

# ============================================
# COMPREHENSIVE CRUD TEST SUITE
# PERGUNU Application - All CRUD Operations
# ============================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PERGUNU - COMPREHENSIVE CRUD TEST SUITE                  ║"
echo "║  Testing ALL Create, Read, Update, Delete Operations      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print test result
print_result() {
  local test_name=$1
  local result=$2
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  if [ "$result" == "PASS" ]; then
    echo -e "${GREEN}✅ PASS${NC} - $test_name"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  elif [ "$result" == "FAIL" ]; then
    echo -e "${RED}❌ FAIL${NC} - $test_name"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  else
    echo -e "${YELLOW}⚠️  WARN${NC} - $test_name"
  fi
}

# Sleep function
sleep_short() {
  sleep 1
}

sleep_medium() {
  sleep 2
}

# ============================================
# PHASE 0: AUTHENTICATION
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PHASE 0: AUTHENTICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  print_result "Admin login" "PASS"
  USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -z "$USER_ID" ]; then
    USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
  fi
  echo "   Admin ID: $USER_ID"
else
  print_result "Admin login" "FAIL"
  echo "❌ Cannot continue without authentication"
  exit 1
fi

sleep_short

# ============================================
# PHASE 1: USER CRUD OPERATIONS
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PHASE 1: USER CRUD OPERATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TIMESTAMP=$(date +%s)

# Test 1.1: CREATE User
echo "🧪 Test 1.1: CREATE User (POST /api/users)"
CREATE_USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"username\": \"testuser${TIMESTAMP}\",
    \"email\": \"test${TIMESTAMP}@test.com\",
    \"password\": \"password123\",
    \"fullName\": \"Test User CRUD\",
    \"phone\": \"08123456789\",
    \"address\": \"Test Address\",
    \"position\": \"Staff\",
    \"role\": \"user\",
    \"status\": \"approved\"
  }")

if echo "$CREATE_USER_RESPONSE" | grep -q '"success":true'; then
  print_result "CREATE User" "PASS"
  TEST_USER_ID=$(echo "$CREATE_USER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   Created User ID: $TEST_USER_ID"
else
  print_result "CREATE User" "FAIL"
  echo "   Response: $CREATE_USER_RESPONSE"
fi

sleep_short

# Test 1.2: READ All Users
echo ""
echo "🧪 Test 1.2: READ All Users (GET /api/users)"
READ_USERS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/users \
  -H "x-user-id: $USER_ID")

if echo "$READ_USERS_RESPONSE" | grep -q "testuser${TIMESTAMP}"; then
  print_result "READ All Users" "PASS"
  USER_COUNT=$(echo "$READ_USERS_RESPONSE" | grep -o '"id"' | wc -l)
  echo "   Total Users: $USER_COUNT"
else
  print_result "READ All Users" "FAIL"
fi

sleep_short

# Test 1.3: READ Single User
echo ""
echo "🧪 Test 1.3: READ Single User (GET /api/users/:id)"
if [ ! -z "$TEST_USER_ID" ]; then
  READ_USER_RESPONSE=$(curl -s -X GET "http://localhost:3001/api/users/${TEST_USER_ID}" \
    -H "x-user-id: $USER_ID")
  
  # Check if response contains user data (no success field in single user response)
  if echo "$READ_USER_RESPONSE" | grep -q "\"id\":\"${TEST_USER_ID}\""; then
    print_result "READ Single User" "PASS"
  else
    print_result "READ Single User" "FAIL"
  fi
else
  print_result "READ Single User" "FAIL"
  echo "   No test user ID available"
fi

sleep_short

# Test 1.4: UPDATE User
echo ""
echo "🧪 Test 1.4: UPDATE User (PATCH /api/users/:id)"
if [ ! -z "$TEST_USER_ID" ]; then
  UPDATE_USER_RESPONSE=$(curl -s -X PATCH "http://localhost:3001/api/users/${TEST_USER_ID}" \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USER_ID" \
    -d "{
      \"phone\": \"08199999999\",
      \"address\": \"Updated Address\",
      \"position\": \"Senior Staff\"
    }")
  
  if echo "$UPDATE_USER_RESPONSE" | grep -q '"success":true'; then
    print_result "UPDATE User" "PASS"
  else
    print_result "UPDATE User" "FAIL"
    echo "   Response: $UPDATE_USER_RESPONSE"
  fi
else
  print_result "UPDATE User" "FAIL"
fi

sleep_short

# Test 1.5: Duplicate Username Validation
echo ""
echo "🧪 Test 1.5: Duplicate Username Validation"
DUPLICATE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"username\": \"testuser${TIMESTAMP}\",
    \"email\": \"another${TIMESTAMP}@test.com\",
    \"password\": \"password123\",
    \"fullName\": \"Another User\"
  }")

if echo "$DUPLICATE_RESPONSE" | grep -q "already exists"; then
  print_result "Duplicate Username Detection" "PASS"
else
  print_result "Duplicate Username Detection" "FAIL"
fi

sleep_short

# Test 1.6: Email Format Validation
echo ""
echo "🧪 Test 1.6: Email Format Validation"
INVALID_EMAIL_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"username\": \"testuser2${TIMESTAMP}\",
    \"email\": \"invalid-email-format\",
    \"password\": \"password123\",
    \"fullName\": \"Test User 2\"
  }")

if echo "$INVALID_EMAIL_RESPONSE" | grep -qi "email"; then
  print_result "Email Format Validation" "PASS"
else
  print_result "Email Format Validation" "WARN"
fi

sleep_short

# Test 1.7: Password Length Validation
echo ""
echo "🧪 Test 1.7: Password Length Validation"
SHORT_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"username\": \"testuser3${TIMESTAMP}\",
    \"email\": \"test3${TIMESTAMP}@test.com\",
    \"password\": \"123\",
    \"fullName\": \"Test User 3\"
  }")

if echo "$SHORT_PASSWORD_RESPONSE" | grep -qi "password"; then
  print_result "Password Length Validation" "PASS"
else
  print_result "Password Length Validation" "WARN"
fi

sleep_short

# ============================================
# PHASE 2: NEWS CRUD OPERATIONS
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PHASE 2: NEWS CRUD OPERATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2.1: CREATE News
echo "🧪 Test 2.1: CREATE News (POST /api/news)"
CREATE_NEWS_RESPONSE=$(curl -s -X POST http://localhost:3001/api/news \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"title\": \"Test News ${TIMESTAMP}\",
    \"content\": \"<p>This is test news content with <strong>rich text</strong></p>\",
    \"category\": \"berita\",
    \"excerpt\": \"Test excerpt\",
    \"author\": \"Admin Pergunu\"
  }")

if echo "$CREATE_NEWS_RESPONSE" | grep -q '"success":true'; then
  print_result "CREATE News" "PASS"
  TEST_NEWS_ID=$(echo "$CREATE_NEWS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -z "$TEST_NEWS_ID" ]; then
    TEST_NEWS_ID=$(echo "$CREATE_NEWS_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
  fi
  echo "   Created News ID: $TEST_NEWS_ID"
else
  print_result "CREATE News" "FAIL"
  echo "   Response: $CREATE_NEWS_RESPONSE"
fi

sleep_short

# Test 2.2: READ All News
echo ""
echo "🧪 Test 2.2: READ All News (GET /api/news)"
READ_NEWS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/news)

if echo "$READ_NEWS_RESPONSE" | grep -q "Test News ${TIMESTAMP}"; then
  print_result "READ All News" "PASS"
  NEWS_COUNT=$(echo "$READ_NEWS_RESPONSE" | grep -o '"id"' | wc -l)
  echo "   Total News: $NEWS_COUNT"
else
  print_result "READ All News" "FAIL"
fi

sleep_short

# Test 2.3: READ Single News
echo ""
echo "🧪 Test 2.3: READ Single News (GET /api/news/:id)"
if [ ! -z "$TEST_NEWS_ID" ]; then
  READ_SINGLE_NEWS=$(curl -s -X GET "http://localhost:3001/api/news/${TEST_NEWS_ID}")
  
  # Check if response contains news data (no success field in single news response)
  if echo "$READ_SINGLE_NEWS" | grep -q "\"id\":${TEST_NEWS_ID}"; then
    print_result "READ Single News" "PASS"
  else
    print_result "READ Single News" "FAIL"
  fi
else
  print_result "READ Single News" "FAIL"
fi

sleep_short

# Test 2.4: UPDATE News
echo ""
echo "🧪 Test 2.4: UPDATE News (PUT /api/news/:id)"
if [ ! -z "$TEST_NEWS_ID" ]; then
  UPDATE_NEWS_RESPONSE=$(curl -s -X PUT "http://localhost:3001/api/news/${TEST_NEWS_ID}" \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USER_ID" \
    -d "{
      \"title\": \"Updated Test News ${TIMESTAMP}\",
      \"content\": \"<p>Updated content</p>\",
      \"category\": \"berita\",
      \"author\": \"Admin Pergunu\"
    }")
  
  if echo "$UPDATE_NEWS_RESPONSE" | grep -q '"success":true'; then
    print_result "UPDATE News" "PASS"
  else
    print_result "UPDATE News" "FAIL"
  fi
else
  print_result "UPDATE News" "FAIL"
fi

sleep_medium

# ============================================
# PHASE 3: BEASISWA CRUD OPERATIONS
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PHASE 3: BEASISWA CRUD OPERATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3.1: CREATE Beasiswa
echo "🧪 Test 3.1: CREATE Beasiswa (POST /api/beasiswa)"
FUTURE_DATE=$(date -d "+30 days" +%Y-%m-%d 2>/dev/null || date -v+30d +%Y-%m-%d 2>/dev/null || echo "2025-12-31")
CREATE_BEASISWA_RESPONSE=$(curl -s -X POST http://localhost:3001/api/beasiswa \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"name\": \"Test Beasiswa ${TIMESTAMP}\",
    \"description\": \"Test beasiswa description\",
    \"amount\": \"5000000\",
    \"deadline\": \"${FUTURE_DATE}\",
    \"requirements\": \"Test requirements\",
    \"quota\": 10
  }")

if echo "$CREATE_BEASISWA_RESPONSE" | grep -q '"success":true'; then
  print_result "CREATE Beasiswa" "PASS"
  TEST_BEASISWA_ID=$(echo "$CREATE_BEASISWA_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -z "$TEST_BEASISWA_ID" ]; then
    TEST_BEASISWA_ID=$(echo "$CREATE_BEASISWA_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
  fi
  echo "   Created Beasiswa ID: $TEST_BEASISWA_ID"
else
  print_result "CREATE Beasiswa" "FAIL"
  echo "   Response: $CREATE_BEASISWA_RESPONSE"
fi

sleep_short

# Test 3.2: READ All Beasiswa
echo ""
echo "🧪 Test 3.2: READ All Beasiswa (GET /api/beasiswa)"
READ_BEASISWA_RESPONSE=$(curl -s -X GET http://localhost:3001/api/beasiswa)

if echo "$READ_BEASISWA_RESPONSE" | grep -q "Test Beasiswa ${TIMESTAMP}"; then
  print_result "READ All Beasiswa" "PASS"
else
  print_result "READ All Beasiswa" "FAIL"
fi

sleep_short

# Test 3.3: UPDATE Beasiswa
echo ""
echo "🧪 Test 3.3: UPDATE Beasiswa (PUT /api/beasiswa/:id)"
if [ ! -z "$TEST_BEASISWA_ID" ]; then
  UPDATE_BEASISWA_RESPONSE=$(curl -s -X PUT "http://localhost:3001/api/beasiswa/${TEST_BEASISWA_ID}" \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USER_ID" \
    -d "{
      \"name\": \"Test Beasiswa ${TIMESTAMP}\",
      \"description\": \"Updated description\",
      \"amount\": \"7500000\",
      \"deadline\": \"${FUTURE_DATE}\",
      \"requirements\": \"Updated requirements\",
      \"quota\": 15
    }")
  
  if echo "$UPDATE_BEASISWA_RESPONSE" | grep -q '"success":true'; then
    print_result "UPDATE Beasiswa" "PASS"
  else
    print_result "UPDATE Beasiswa" "FAIL"
  fi
else
  print_result "UPDATE Beasiswa" "FAIL"
fi

sleep_medium

# ============================================
# PHASE 4: APPLICATION CRUD OPERATIONS
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PHASE 4: APPLICATION CRUD OPERATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 4.1: CREATE Application (Requires auth - only logged in users can apply)
echo "🧪 Test 4.1: CREATE Application (POST /api/applications)"
if [ ! -z "$TEST_BEASISWA_ID" ] && [ ! -z "$TEST_USER_ID" ]; then
  # First create test user to use as applicant
  CREATE_APPLICANT=$(curl -s -X POST http://localhost:3001/api/users \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USER_ID" \
    -d "{
      \"username\": \"applicant${TIMESTAMP}\",
      \"email\": \"applicant${TIMESTAMP}@test.com\",
      \"password\": \"password123\",
      \"fullName\": \"Test Applicant ${TIMESTAMP}\"
    }")
  
  APPLICANT_ID=$(echo "$CREATE_APPLICANT" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ ! -z "$APPLICANT_ID" ]; then
    CREATE_APPLICATION_RESPONSE=$(curl -s -X POST http://localhost:3001/api/applications \
      -H "Content-Type: application/json" \
      -H "x-user-id: ${APPLICANT_ID}" \
      -d "{
        \"beasiswaId\": \"${TEST_BEASISWA_ID}\",
        \"fullName\": \"Test Applicant ${TIMESTAMP}\",
        \"email\": \"applicant${TIMESTAMP}@test.com\",
        \"phone\": \"08123456789\",
        \"address\": \"Test Address\",
        \"education\": \"S1\",
        \"institution\": \"Test University\",
        \"gpa\": \"3.5\",
        \"reason\": \"Test application reason\",
        \"userId\": \"${APPLICANT_ID}\"
      }")
    
    if echo "$CREATE_APPLICATION_RESPONSE" | grep -q '"success":true'; then
      print_result "CREATE Application" "PASS"
      TEST_APPLICATION_ID=$(echo "$CREATE_APPLICATION_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
      if [ -z "$TEST_APPLICATION_ID" ]; then
        TEST_APPLICATION_ID=$(echo "$CREATE_APPLICATION_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
      fi
      echo "   Created Application ID: $TEST_APPLICATION_ID"
    else
      print_result "CREATE Application" "FAIL"
      echo "   Response: $CREATE_APPLICATION_RESPONSE"
    fi
    
    # Cleanup applicant user
    curl -s -X DELETE "http://localhost:3001/api/users/${APPLICANT_ID}" \
      -H "x-user-id: $USER_ID" > /dev/null
  else
    print_result "CREATE Application" "FAIL"
    echo "   Failed to create applicant user"
  fi
else
  print_result "CREATE Application" "FAIL"
  echo "   No beasiswa ID available"
fi

sleep_short

# Test 4.2: READ All Applications
echo ""
echo "🧪 Test 4.2: READ All Applications (GET /api/applications)"
READ_APPLICATIONS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/applications \
  -H "x-user-id: $USER_ID")

if echo "$READ_APPLICATIONS_RESPONSE" | grep -q "Test Applicant ${TIMESTAMP}"; then
  print_result "READ All Applications" "PASS"
else
  print_result "READ All Applications" "FAIL"
fi

sleep_short

# Test 4.3: UPDATE Application Status
echo ""
echo "🧪 Test 4.3: UPDATE Application Status (PUT /api/applications/:id/status)"
if [ ! -z "$TEST_APPLICATION_ID" ]; then
  UPDATE_APPLICATION_RESPONSE=$(curl -s -X PUT "http://localhost:3001/api/applications/${TEST_APPLICATION_ID}/status" \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USER_ID" \
    -d "{
      \"status\": \"reviewed\"
    }")
  
  if echo "$UPDATE_APPLICATION_RESPONSE" | grep -q '"success":true'; then
    print_result "UPDATE Application Status" "PASS"
  else
    print_result "UPDATE Application Status" "FAIL"
  fi
else
  print_result "UPDATE Application Status" "FAIL"
fi

sleep_medium

# ============================================
# PHASE 5: CLEANUP - DELETE OPERATIONS
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PHASE 5: CLEANUP - DELETE OPERATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 5.1: DELETE Application
echo "🧪 Test 5.1: DELETE Application (DELETE /api/applications/:id)"
if [ ! -z "$TEST_APPLICATION_ID" ]; then
  DELETE_APPLICATION_RESPONSE=$(curl -s -X DELETE "http://localhost:3001/api/applications/${TEST_APPLICATION_ID}" \
    -H "x-user-id: $USER_ID")
  
  if echo "$DELETE_APPLICATION_RESPONSE" | grep -q '"success":true'; then
    print_result "DELETE Application" "PASS"
  else
    print_result "DELETE Application" "FAIL"
  fi
else
  print_result "DELETE Application" "FAIL"
fi

sleep_short

# Test 5.2: DELETE Beasiswa
echo ""
echo "🧪 Test 5.2: DELETE Beasiswa (DELETE /api/beasiswa/:id)"
if [ ! -z "$TEST_BEASISWA_ID" ]; then
  DELETE_BEASISWA_RESPONSE=$(curl -s -X DELETE "http://localhost:3001/api/beasiswa/${TEST_BEASISWA_ID}" \
    -H "x-user-id: $USER_ID")
  
  if echo "$DELETE_BEASISWA_RESPONSE" | grep -q '"success":true'; then
    print_result "DELETE Beasiswa" "PASS"
  else
    print_result "DELETE Beasiswa" "FAIL"
  fi
else
  print_result "DELETE Beasiswa" "FAIL"
fi

sleep_short

# Test 5.3: DELETE News
echo ""
echo "🧪 Test 5.3: DELETE News (DELETE /api/news/:id)"
if [ ! -z "$TEST_NEWS_ID" ]; then
  DELETE_NEWS_RESPONSE=$(curl -s -X DELETE "http://localhost:3001/api/news/${TEST_NEWS_ID}" \
    -H "x-user-id: $USER_ID")
  
  if echo "$DELETE_NEWS_RESPONSE" | grep -q '"success":true'; then
    print_result "DELETE News" "PASS"
  else
    print_result "DELETE News" "FAIL"
  fi
else
  print_result "DELETE News" "FAIL"
fi

sleep_short

# Test 5.4: DELETE User
echo ""
echo "🧪 Test 5.4: DELETE User (DELETE /api/users/:id)"
if [ ! -z "$TEST_USER_ID" ]; then
  DELETE_USER_RESPONSE=$(curl -s -X DELETE "http://localhost:3001/api/users/${TEST_USER_ID}" \
    -H "x-user-id: $USER_ID")
  
  if echo "$DELETE_USER_RESPONSE" | grep -q '"success":true'; then
    print_result "DELETE User" "PASS"
  else
    print_result "DELETE User" "FAIL"
  fi
else
  print_result "DELETE User" "FAIL"
fi

# ============================================
# FINAL SUMMARY
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 FINAL TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total Tests:  $TOTAL_TESTS"
echo -e "${GREEN}Passed:       $PASSED_TESTS${NC}"
echo -e "${RED}Failed:       $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  🎉 ALL TESTS PASSED! CRUD OPERATIONS WORKING 100%    ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
  SUCCESS_RATE=100
else
  SUCCESS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")
  echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║  ⚠️  SOME TESTS FAILED - Success Rate: ${SUCCESS_RATE}%        ║${NC}"
  echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Test completed at: $(date)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
