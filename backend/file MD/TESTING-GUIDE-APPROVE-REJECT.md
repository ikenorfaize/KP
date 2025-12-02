# 🧪 TESTING GUIDE: APPROVE & REJECT FIX

## 🎯 Quick Test Steps

### ✅ TEST 1: Approve Application (Existing User)

**Scenario:** User `fairuz4@gmail.com` sudah terdaftar di database

**Steps:**
1. Open browser → `http://localhost:5173/admin`
2. Login sebagai admin
3. Go to "Application Manager" tab
4. Find application dengan email: `fairuz4@gmail.com`
5. Click button **"Approve"** (✅ icon)
6. Modal muncul, isi:
   - Username: `fairuz4` (atau apapun)
   - Password: `test1234`
7. Click "Confirm Approve"

**Expected Console Output:**
```javascript
✅ User already exists, using existing account: fairuz4
🔄 Approving application with existing user account
```

**Expected Result:**
- ✅ NO ERROR di console
- ✅ Application status → "Approved"
- ✅ Application hilang dari pending list
- ✅ Muncul di "Approved" filter
- ✅ Tidak ada duplicate user di database

**How to Verify:**
1. Go to "User Manager" tab
2. Search email: `fairuz4@gmail.com`
3. Should only see **1 user** (not duplicated)

---

### ✅ TEST 2: Check Status After Approve

**Steps:**
1. Open homepage: `http://localhost:5173/`
2. Scroll to "Cek Status Pendaftaran" section
3. Enter email: `fairuz4@gmail.com`
4. Click "Cek Status"

**Expected Result:**
```
Status: ✅ Disetujui (Approved)
Nama: Fairuz (atau sesuai data)
Email: fairuz4@gmail.com
Posisi: (position)
Status: Disetujui
Diproses: (tanggal approve)

Action Button: "Login Sekarang" → redirect to /login
```

---

### ✅ TEST 3: Reject Application

**Scenario:** Reject application dengan PATCH method

**Steps:**
1. Go to Admin Dashboard → Application Manager
2. Find any pending application
3. Click button **"Reject"** (❌ icon)
4. Modal muncul, isi notes:
   ```
   Dokumen tidak lengkap
   ```
5. Click "Confirm Reject"

**Expected Console Output:**
```javascript
// NO CORS ERROR!
// NO "PATCH is not allowed" error!
```

**Expected Result:**
- ✅ NO CORS error
- ✅ Application status → "Rejected"
- ✅ Notes saved: "Dokumen tidak lengkap"
- ✅ Application hilang dari pending list
- ✅ Muncul di "Rejected" filter

**Check Backend Log:**
```
✅ Application 1754615058252 updated: rejected
```

---

### ✅ TEST 4: Check Status After Reject

**Steps:**
1. Homepage → "Cek Status Pendaftaran"
2. Enter email dari application yang di-reject
3. Click "Cek Status"

**Expected Result:**
```
Status: ❌ Ditolak (Rejected)
Nama: (applicant name)
Email: (email)
Catatan: "Dokumen tidak lengkap"
Status: Ditolak

Action Button: "Daftar Ulang" → redirect to /register
```

---

### ✅ TEST 5: Approve New User (First Time)

**Scenario:** User belum pernah terdaftar

**Steps:**
1. Create new application:
   - Name: `Test User New`
   - Email: `testnew@example.com`
   - Position: `guru`
2. Go to Application Manager
3. Approve the application:
   - Username: `testnew`
   - Password: `password123`

**Expected Console Output:**
```javascript
📝 Registration attempt: {fullName: "Test User New", email: "testnew@example.com", ...}
// NO "User already exists" error
```

**Expected Result:**
- ✅ New user created in database
- ✅ Application approved
- ✅ Can login with `testnew` / `password123`

**Verify:**
1. Go to User Manager
2. Search: `testnew@example.com`
3. Should see new user ✅

---

## 🐛 Debugging Tips

### If Approve Still Fails:

**Check Console:**
```javascript
// Look for:
ApplicationService.js:217 POST http://localhost:3001/api/auth/register 400/409

// If 400 → Backend still returning wrong status code
// If 409 → Good! Check if existingUser logic works
```

**Check Network Tab:**
1. Open DevTools → Network
2. Filter: `XHR`
3. Click Approve
4. Find request: `POST .../auth/register`
5. Check Response:
   ```json
   {
     "error": "User already exists",
     "existingUser": {
       "id": "...",
       "email": "fairuz4@gmail.com",
       "username": "fairuz4"
     }
   }
   ```
6. Status should be **409** (not 400!)

---

### If Reject Still Fails:

**Check Console:**
```javascript
// Look for CORS error:
Access to fetch at 'http://localhost:3001/api/applications/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
Method PATCH is not allowed

// If you see this → Backend not restarted!
```

**Solution:**
```bash
# Kill all node processes
Stop-Process -Name node -Force

# Restart backend
cd api
node index.js

# Verify in browser console:
# Should NOT see CORS error anymore
```

---

### Check Backend CORS Config:

**File:** `api/index.js` line ~87

**Should be:**
```javascript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//                                  ^^^^^ Must have PATCH!
```

**If missing PATCH:**
1. Add it manually
2. Save file
3. Restart backend
4. Test again

---

## 📊 Success Indicators

### ✅ Approve Success:
- Console: `✅ User already exists, using existing account`
- Network: Status 409 or 201
- UI: Application moves to "Approved"
- Database: No duplicate users

### ✅ Reject Success:
- Console: NO CORS error
- Network: Status 200, method PATCH
- UI: Application moves to "Rejected"
- Status Tracker: Shows "Ditolak" with notes

---

## 🔍 Backend Logs to Watch

**Terminal running `node index.js`:**

```bash
# When approve existing user:
📝 Registration attempt: { email: 'fairuz4@gmail.com', ... }
# No new user created (good!)

# When approve new user:
📝 Registration attempt: { email: 'testnew@example.com', ... }
# User created successfully

# When reject:
✅ Application 1754615058252 updated: rejected
```

---

## 🎯 Final Checklist

After all tests:

- [ ] Approve existing user → Works without error
- [ ] Approve new user → Creates account successfully
- [ ] Reject application → No CORS error
- [ ] Status tracker shows "Approved" after approve
- [ ] Status tracker shows "Rejected" after reject
- [ ] No duplicate users created
- [ ] Email notifications sent (check console)
- [ ] SSE updates broadcast (real-time)

---

**If all checked ✅ → System fully working! 🎉**

---

## 🚨 Common Issues

### Issue: "User already exists" error saat approve

**Cause:** Backend returning 400 instead of 409

**Fix:**
1. Check `api/index.js` line 447
2. Should return status **409**
3. Restart backend

---

### Issue: CORS error saat reject

**Cause:** PATCH not in CORS methods

**Fix:**
1. Check `api/index.js` line 87
2. Add `'PATCH'` to methods array
3. Restart backend

---

### Issue: Application tetap pending

**Cause:** 
- Register failed (400 error)
- PATCH blocked (CORS)
- Backend not running

**Fix:**
1. Check console for errors
2. Verify backend running on port 3001
3. Check Network tab for failed requests
4. Restart both frontend & backend

---

**Ready to test! 🧪✨**

Open browser and follow TEST 1 first!
