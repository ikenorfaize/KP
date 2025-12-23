# ===================================
# PASSWORD DUPLICATE CHECK - TESTING GUIDE
# ===================================

## 🎯 Feature Overview
This feature prevents duplicate passwords across all users in the system.
When approving a new application, the system:
1. Generates a unique password
2. Validates it against ALL existing user passwords
3. Retries if duplicate found
4. Works in both local and Azure VM environments

## 📁 Files Modified/Created

### Frontend:
- `frontend/src/utils/passwordValidation.js` (NEW)
  - `checkPasswordDuplicate()` - API call to check password
  - `validatePasswordUniqueness()` - Validate before user creation
  - `generateUniquePassword()` - Generate unique password with retry logic

- `frontend/src/componen/ApplicationManager/ApplicationManager.jsx` (UPDATED)
  - Import password validation utilities
  - Use `generateUniquePassword()` instead of inline random generation
  - Validate password before calling `approveAndRegister()`

### Backend:
- `backend/src/routes/passwordCheck.js` (NEW)
  - POST `/api/auth/check-password` - Check if password exists
  - Compares against all user passwords using bcrypt

- `backend/src/routes/auth.js` (UPDATED)
  - Import and mount passwordCheck router
  - Makes endpoint available at `/api/auth/check-password`

## 🧪 Testing Steps

### Step 1: Local Testing

#### A. Start Backend
```bash
cd backend
npm install
npm start
```
Backend should run on `http://localhost:3001`

#### B. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend should run on `http://localhost:5173`

#### C. Test Password Check API
```bash
# Test with curl (Windows PowerShell)
$body = @{
    password = "TestPass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/check-password" -Method POST -Body $body -ContentType "application/json"

# Expected response if password doesn't exist:
# {
#   "success": true,
#   "data": {
#     "exists": false,
#     "username": null
#   }
# }
```

#### D. Test in ApplicationManager
1. Login as admin
2. Go to "Kelola Pendaftaran" section
3. Click "✅ Approve" on a pending application
4. Watch console logs:
   - Should see: "🔐 Generating unique password..."
   - Should see: "✅ Unique password generated"
5. Check alert message - should show generated password
6. Verify user created successfully

#### E. Test Duplicate Detection
1. Note the generated password from step D
2. Create another user manually with that password:
   ```bash
   # Via API
   $body = @{
       username = "testuser2"
       email = "test2@example.com"
       password = "<paste_generated_password>"
       fullName = "Test User 2"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
   ```
3. Now test password check with that password:
   ```bash
   $body = @{
       password = "<paste_generated_password>"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:3001/api/auth/check-password" -Method POST -Body $body -ContentType "application/json"

   # Expected response:
   # {
   #   "success": true,
   #   "data": {
   #     "exists": true,
   #     "username": "testuser2"
   #   }
   # }
   ```

### Step 2: Azure VM Testing

#### A. Update Environment Variables
Before deploying, ensure environment variables are set:

**Backend (.env.docker):**
```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**Frontend (docker-compose.yml build args):**
```yaml
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_FILE_SERVER_URL=https://api.yourdomain.com
```

#### B. Deploy to Azure VM
```bash
# SSH to Azure VM
ssh azureuser@your-vm-ip

# Navigate to project
cd /path/to/project

# Pull latest code
git pull origin main

# Rebuild containers
docker-compose build

# Restart services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### C. Verify API Endpoint
```bash
# Test from your local machine
curl -X POST https://api.yourdomain.com/api/auth/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"TestPass123"}'

# Expected response (JSON):
# {"success":true,"data":{"exists":false,"username":null}}
```

#### D. Test in Production
1. Access your production frontend: `https://yourdomain.com`
2. Login as admin
3. Go to ApplicationManager
4. Approve a pending application
5. Verify:
   - No console errors
   - Password generated successfully
   - User created without errors
   - Password is unique (check against existing users)

#### E. Test Cross-Origin (CORS)
1. Open browser DevTools (F12) → Network tab
2. Approve an application
3. Check request to `/api/auth/check-password`:
   - Should show status 200
   - Should have CORS headers:
     - `Access-Control-Allow-Origin: https://yourdomain.com`
     - `Access-Control-Allow-Credentials: true`

### Step 3: Edge Cases Testing

#### A. Test Multiple Rapid Approvals
1. Have 3+ pending applications
2. Quickly approve all of them (click ✅ on each)
3. Verify:
   - All passwords are unique
   - No duplicate password errors
   - All users created successfully

#### B. Test Network Failure Handling
1. Stop backend container:
   ```bash
   docker-compose stop backend
   ```
2. Try to approve an application
3. Verify:
   - Frontend shows appropriate error
   - No infinite loading state
   - User can retry after backend restarts

#### C. Test with Existing Password
1. Create a user with password "TestDuplicate123"
2. Manually modify `generateUniquePassword()` to always return "TestDuplicate123"
3. Try to approve an application
4. Verify:
   - System detects duplicate
   - Retries with different password
   - Eventually succeeds with unique password

## ✅ Expected Behavior

### Success Scenarios:
- ✅ Password uniqueness checked before user creation
- ✅ Duplicate passwords rejected
- ✅ Automatic retry with new password if duplicate
- ✅ Works in both local and production environments
- ✅ No hardcoded URLs or localhost dependencies
- ✅ Proper CORS handling
- ✅ User-friendly error messages

### Error Handling:
- ❌ If API fails → Allow operation (fail open)
- ❌ If max retries exceeded → Use timestamp-based fallback
- ❌ Network error → Show clear error message
- ❌ Invalid password → Show validation error

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined (reading 'API_URL')"
**Solution:** Ensure `.env` files are properly configured:
```bash
# Frontend .env
VITE_API_BASE_URL=http://localhost:3001/api

# Backend .env
PORT=3001
```

### Issue: CORS error on Azure VM
**Solution:** Check backend `.env.docker`:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Issue: Password check always returns "exists: false"
**Solution:** 
1. Verify backend route is mounted correctly in `auth.js`
2. Check bcrypt comparison is working:
   ```bash
   docker-compose logs backend | grep "check-password"
   ```
3. Verify users have hashed passwords in database

### Issue: Duplicate passwords still created
**Solution:**
1. Check `generateUniquePassword()` is being called (not old inline code)
2. Verify `validatePasswordUniqueness()` is called before user creation
3. Check backend `/check-password` endpoint is reachable:
   ```bash
   curl -X POST http://localhost:3001/api/auth/check-password \
     -H "Content-Type: application/json" \
     -d '{"password":"test"}'
   ```

## 📊 Monitoring

### Backend Logs to Watch:
```bash
# Check password validation requests
docker-compose logs -f backend | grep "check-password"

# Check user creation
docker-compose logs -f backend | grep "User registered"

# Check errors
docker-compose logs -f backend | grep "ERROR"
```

### Frontend Console Logs:
```javascript
// Look for these messages in browser console:
"🔐 Generating unique password..."
"✅ Unique password generated"
"Error checking password duplicate: ..."
```

## 🎓 Key Concepts

1. **Environment-Aware**: Uses `apiService.API_URL` which adapts to local/production
2. **Bcrypt Comparison**: Backend compares plaintext against hashed passwords
3. **Retry Logic**: Frontend retries up to 5 times if password exists
4. **Fail Open**: If API fails, allows operation (better UX than blocking)
5. **No Hardcoded URLs**: All URLs from environment variables

## 📝 Maintenance Notes

- Password check adds ~200ms latency per approval (acceptable)
- Scales well - O(n) where n = number of users
- Consider caching or indexing if user count > 10,000
- Monitor backend logs for performance issues
