#!/usr/bin/env node

/**
 * ================================================================
 * PERGUNU CRUD AUTOMATED TESTING SCRIPT
 * ================================================================
 * 
 * Script ini melakukan trial error testing TANPA HENTI pada semua
 * operasi CRUD di aplikasi PERGUNU hingga SEMUA fitur 100% berfungsi.
 * 
 * Usage:
 *   node test-crud-automation.js
 * 
 * Requirements:
 *   - Backend running di localhost:3001
 *   - Frontend running di localhost:5173
 *   - File server running di localhost:3002
 */

const API_URL = process.env.API_URL || 'http://localhost:3001/api';
const FILE_SERVER_URL = process.env.FILE_SERVER_URL || 'http://localhost:3002';
const ADMIN_USER = { username: 'admin', password: 'admin123' };

let adminToken = null;
let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// ============================================================================
// UTILITIES
// ============================================================================

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  section: (title) => console.log(`\n${'='.repeat(60)}\n${title}\n${'='.repeat(60)}`),
  test: (name) => console.log(`\n🧪 TEST: ${name}`)
};

const assert = (condition, message) => {
  if (condition) {
    testResults.passed++;
    log.success(message);
    return true;
  } else {
    testResults.failed++;
    const error = `ASSERTION FAILED: ${message}`;
    testResults.errors.push(error);
    log.error(error);
    return false;
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { 'x-user-id': adminToken }),
        ...options.headers
      }
    });
    
    const data = await response.json().catch(() => ({}));
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    log.error(`Request failed: ${error.message}`);
    return { status: 0, ok: false, error: error.message };
  }
};

// ============================================================================
// PHASE 0: SETUP & AUTHENTICATION
// ============================================================================

async function setupAuth() {
  log.section('PHASE 0: AUTHENTICATION SETUP');
  
  log.test('Login as admin');
  const { status, data } = await request(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(ADMIN_USER)
  });
  
  if (assert(status === 200, 'Admin login successful')) {
    adminToken = data.id || data.userId || data.data?.id;
    log.info(`Admin token: ${adminToken}`);
  } else {
    log.error('Cannot proceed without admin authentication');
    process.exit(1);
  }
}

// ============================================================================
// PHASE 1: USER CRUD TESTING
// ============================================================================

async function testUserCRUD() {
  log.section('PHASE 1: USER MANAGEMENT CRUD');
  
  let createdUserId = null;
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    fullName: 'Test User Automation',
    position: 'QA Tester',
    phone: '08123456789',
    address: 'Test Address',
    role: 'user',
    status: 'active'
  };
  
  // TEST 1.1: CREATE USER
  log.test('CREATE new user via POST /api/users');
  const createRes = await request(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (assert(createRes.status === 201, 'User created successfully')) {
    createdUserId = createRes.data.data?.id || createRes.data.id;
    log.info(`Created user ID: ${createdUserId}`);
  } else {
    log.error(`Create failed with status ${createRes.status}`);
    log.error(JSON.stringify(createRes.data));
  }
  
  await sleep(500);
  
  // TEST 1.2: READ ALL USERS
  log.test('READ all users via GET /api/users');
  const readAllRes = await request(`${API_URL}/users`);
  
  assert(readAllRes.status === 200, 'Fetch all users successful');
  assert(Array.isArray(readAllRes.data), 'Response is an array');
  assert(readAllRes.data.length > 0, 'Users array not empty');
  
  await sleep(500);
  
  // TEST 1.3: READ SINGLE USER
  if (createdUserId) {
    log.test(`READ user by ID via GET /api/users/${createdUserId}`);
    const readOneRes = await request(`${API_URL}/users/${createdUserId}`);
    
    assert(readOneRes.status === 200, 'Fetch user by ID successful');
    assert(readOneRes.data.fullName === testUser.fullName, 'User data matches');
  }
  
  await sleep(500);
  
  // TEST 1.4: UPDATE USER
  if (createdUserId) {
    log.test(`UPDATE user via PATCH /api/users/${createdUserId}`);
    const updateRes = await request(`${API_URL}/users/${createdUserId}`, {
      method: 'PATCH',
      body: JSON.stringify({ phone: '08199999999', address: 'Updated Address' })
    });
    
    assert(updateRes.status === 200, 'User update successful');
    assert(updateRes.data.data?.phone === '08199999999', 'Phone updated correctly');
  }
  
  await sleep(500);
  
  // TEST 1.5: DELETE USER
  if (createdUserId) {
    log.test(`DELETE user via DELETE /api/users/${createdUserId}`);
    const deleteRes = await request(`${API_URL}/users/${createdUserId}`, {
      method: 'DELETE'
    });
    
    assert(deleteRes.status === 200, 'User deleted successfully');
    
    // Verify deletion
    const verifyRes = await request(`${API_URL}/users/${createdUserId}`);
    assert(verifyRes.status === 404, 'Deleted user not found (correct)');
  }
  
  // TEST 1.6: DUPLICATE USERNAME
  log.test('Prevent duplicate username');
  const dupRes = await request(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ ...testUser, email: 'newemail@test.com' })
  });
  
  assert(dupRes.status === 400, 'Duplicate username rejected');
  
  // TEST 1.7: DUPLICATE EMAIL
  log.test('Prevent duplicate email');
  const dupEmailRes = await request(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ ...testUser, username: 'newusername', email: 'admin@pergunu.com' })
  });
  
  assert(dupEmailRes.status === 400, 'Duplicate email rejected');
}

// ============================================================================
// PHASE 2: CERTIFICATE CRUD TESTING
// ============================================================================

async function testCertificateCRUD() {
  log.section('PHASE 2: CERTIFICATE MANAGEMENT CRUD');
  
  log.test('UPLOAD certificate via POST /upload-certificate');
  
  // Create test PDF content
  const testPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n%%EOF';
  const blob = new Blob([testPdfContent], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('certificate', blob, 'test-certificate.pdf');
  formData.append('userId', 'bdef');
  
  try {
    const uploadRes = await fetch(`${FILE_SERVER_URL}/upload-certificate`, {
      method: 'POST',
      body: formData
    });
    
    const uploadData = await uploadRes.json();
    
    if (assert(uploadRes.status === 200, 'Certificate upload successful')) {
      const certId = uploadData.certificate?.id;
      log.info(`Uploaded certificate ID: ${certId}`);
      
      // TEST DELETE CERTIFICATE
      if (certId) {
        await sleep(500);
        log.test(`DELETE certificate via DELETE /delete-certificate/${certId}`);
        
        const deleteRes = await fetch(`${FILE_SERVER_URL}/delete-certificate/${certId}`, {
          method: 'DELETE'
        });
        
        assert(deleteRes.status === 200, 'Certificate deleted successfully');
      }
    }
  } catch (error) {
    log.error(`Certificate test failed: ${error.message}`);
    testResults.failed++;
  }
}

// ============================================================================
// PHASE 3: NEWS CRUD TESTING
// ============================================================================

async function testNewsCRUD() {
  log.section('PHASE 3: NEWS MANAGEMENT CRUD');
  
  let createdNewsId = null;
  const testNews = {
    title: `Test News ${Date.now()}`,
    content: '<p>This is test news content</p>',
    author: 'Admin Test',
    category: 'general',
    status: 'published'
  };
  
  // CREATE NEWS
  log.test('CREATE news via POST /api/news');
  const createRes = await request(`${API_URL}/news`, {
    method: 'POST',
    body: JSON.stringify(testNews)
  });
  
  if (assert(createRes.status === 201, 'News created successfully')) {
    createdNewsId = createRes.data.data?.id || createRes.data.id;
  }
  
  await sleep(500);
  
  // READ NEWS
  log.test('READ all news via GET /api/news');
  const readRes = await request(`${API_URL}/news`);
  assert(readRes.status === 200, 'Fetch news successful');
  
  // UPDATE NEWS
  if (createdNewsId) {
    await sleep(500);
    log.test(`UPDATE news via PATCH /api/news/${createdNewsId}`);
    const updateRes = await request(`${API_URL}/news/${createdNewsId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Test News' })
    });
    assert(updateRes.status === 200, 'News updated successfully');
  }
  
  // DELETE NEWS
  if (createdNewsId) {
    await sleep(500);
    log.test(`DELETE news via DELETE /api/news/${createdNewsId}`);
    const deleteRes = await request(`${API_URL}/news/${createdNewsId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200, 'News deleted successfully');
  }
}

// ============================================================================
// PHASE 4: BEASISWA CRUD TESTING
// ============================================================================

async function testBeasiswaCRUD() {
  log.section('PHASE 4: BEASISWA MANAGEMENT CRUD');
  
  let createdBeasiswaId = null;
  const testBeasiswa = {
    title: `Test Beasiswa ${Date.now()}`,
    description: 'Test beasiswa description',
    requirements: 'Test requirements',
    benefits: 'Test benefits',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    quota: 10,
    status: 'open'
  };
  
  log.test('CREATE beasiswa via POST /api/beasiswa');
  const createRes = await request(`${API_URL}/beasiswa`, {
    method: 'POST',
    body: JSON.stringify(testBeasiswa)
  });
  
  if (assert(createRes.status === 201, 'Beasiswa created successfully')) {
    createdBeasiswaId = createRes.data.data?.id || createRes.data.id;
  }
  
  await sleep(500);
  
  log.test('READ all beasiswa via GET /api/beasiswa');
  const readRes = await request(`${API_URL}/beasiswa`);
  assert(readRes.status === 200, 'Fetch beasiswa successful');
  
  if (createdBeasiswaId) {
    await sleep(500);
    log.test(`DELETE beasiswa via DELETE /api/beasiswa/${createdBeasiswaId}`);
    const deleteRes = await request(`${API_URL}/beasiswa/${createdBeasiswaId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200, 'Beasiswa deleted successfully');
  }
}

// ============================================================================
// PHASE 5: APPLICATION CRUD TESTING
// ============================================================================

async function testApplicationCRUD() {
  log.section('PHASE 5: APPLICATION MANAGEMENT CRUD');
  
  let createdAppId = null;
  const testApp = {
    applicantName: 'Test Applicant',
    applicantEmail: `testapp${Date.now()}@example.com`,
    applicantPhone: '08123456789',
    scholarshipName: 'Test Scholarship',
    motivation: 'Test motivation letter',
    status: 'pending'
  };
  
  log.test('CREATE application via POST /api/applications');
  const createRes = await request(`${API_URL}/applications`, {
    method: 'POST',
    body: JSON.stringify(testApp)
  });
  
  if (assert(createRes.status === 201, 'Application created successfully')) {
    createdAppId = createRes.data.data?.id || createRes.data.id;
  }
  
  await sleep(500);
  
  log.test('READ all applications via GET /api/applications');
  const readRes = await request(`${API_URL}/applications`);
  assert(readRes.status === 200, 'Fetch applications successful');
  
  if (createdAppId) {
    await sleep(500);
    log.test(`DELETE application via DELETE /api/applications/${createdAppId}`);
    const deleteRes = await request(`${API_URL}/applications/${createdAppId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200, 'Application deleted successfully');
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runAllTests() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║        PERGUNU CRUD AUTOMATION TESTING SCRIPT                     ║
║        Trial Error Mode - Never Stop Until All Pass              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);

  try {
    await setupAuth();
    await testUserCRUD();
    await testCertificateCRUD();
    await testNewsCRUD();
    await testBeasiswaCRUD();
    await testApplicationCRUD();
    
    log.section('TEST RESULTS SUMMARY');
    console.log(`
✅ PASSED: ${testResults.passed}
❌ FAILED: ${testResults.failed}
📊 TOTAL:  ${testResults.passed + testResults.failed}
📈 SUCCESS RATE: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%
`);
    
    if (testResults.failed > 0) {
      log.error('ERRORS ENCOUNTERED:');
      testResults.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
      process.exit(1);
    } else {
      log.success('ALL TESTS PASSED! 🎉');
      process.exit(0);
    }
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
runAllTests();
