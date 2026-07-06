const puppeteer = require('puppeteer');
const fs = require('fs');

const ERRORS = [];
const WARNINGS = [];
const BASE_URL = 'http://localhost:5173';

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') { ERRORS.push(text); if (!text.includes('404')) console.log('[ERROR]', text.substring(0, 200)); }
    if (type === 'warning' && !text.includes('DevTools') && !text.includes('React')) WARNINGS.push(text);
  });
  page.on('pageerror', err => {
    const msg = err.message.substring(0, 300);
    ERRORS.push(`PAGEERROR: ${msg}`);
    console.log('[PAGEERROR]', msg.substring(0, 150));
  });

  // ─── STEP 1: Navigate to establish origin, write LS tokens ───────────────────
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });

  await page.evaluate(() => {
    localStorage.setItem('dente_clinic_token', 'audit_clinic_token_v3');
    localStorage.setItem('dente_staff_token', 'audit_staff_token_v3');
    localStorage.setItem('dente_onboarding_dismissed', 'true');
    localStorage.setItem('dente_clinic_mode', 'solo_doctor');
    console.log('[AUDIT] LS tokens written:', localStorage.getItem('dente_clinic_token'));
  });

  // ─── STEP 2: Inject fetch mock for the NEXT navigation ───────────────────────
  // evaluateOnNewDocument runs before page scripts on next navigation
  await page.evaluateOnNewDocument(() => {
    // Patients - all required Zod fields
    const PATIENTS = [
      {
        id: '10000000-0000-0000-0000-000000000001',
        organizationId: '20000000-0000-0000-0000-000000000001',
        fullName: 'Анна Иванова',
        phone: '+7 999 111-2233',
        email: 'anna@example.com',
        birthDate: '1985-03-15',
        gender: 'female',
        status: 'active',
        notes: '',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-07-01T00:00:00Z'
      },
      {
        id: '10000000-0000-0000-0000-000000000002',
        organizationId: '20000000-0000-0000-0000-000000000001',
        fullName: 'Сергей Петров',
        phone: '+7 999 444-5566',
        email: 'sergey@example.com',
        birthDate: '1970-07-22',
        gender: 'male',
        status: 'active',
        notes: '',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-07-01T00:00:00Z'
      }
    ];

    const DASHBOARD = {
      clinicName: 'DENTE Clinic',
      todayIso: '2026-07-06T00:00:00Z',
      clinicSettings: {
        profile: {
          id: '20000000-0000-0000-0000-000000000002',
          clinicName: 'DENTE Clinic',
          organizationId: '20000000-0000-0000-0000-000000000001',
          mode: 'solo_doctor',
          initialized: true,
          legalName: 'DENTE Clinic LLC',
          inn: '1234567890',
          address: 'г. Москва, ул. Арбат, 1',
          phone: '+7 495 555-1234',
          timezone: 'Europe/Moscow',
          defaultVisitMinutes: 30,
          scheduleDefaults: { workdayStart: '09:00', workdayEnd: '18:00', workingDays: [1,2,3,4,5], appointmentBufferMinutes: 5 },
          networkEnabled: false, egiszEnabled: false,
          updatedAt: '2026-07-06T00:00:00Z'
        },
        integrationPresets: [], modeHints: [], staff: [], chairs: [],
        workspaceProfiles: [], roleAccessPolicies: [],
        timezone: 'Europe/Moscow'
      },
      shiftIntelligence: {
        roleQueues: [], doctorLoads: [], assistantLoads: [], chairLoads: [], scheduleWarnings: [],
        modeFit: { mode: 'solo_doctor', title: 'Solo Doctor', fitScore: 100, blockers: [], upgrades: [], lowFrictionNextStep: 'None' }
      },
      patients: PATIENTS,
      patientInsights: [],
      recommendedActions: [],
      appointments: [],
      appointmentReadiness: [],
      scheduleSuggestions: [],
      activeVisit: {
        id: '30000000-0000-0000-0000-000000000001',
        appointmentId: '30000000-0000-0000-0000-000000000002',
        status: 'draft',
        patientId: '10000000-0000-0000-0000-000000000001',
        checkInIso: '2026-07-06T10:00:00Z',
        organizationId: '20000000-0000-0000-0000-000000000001',
        complaint: 'Боль в зубе 36', anamnesis: '', objectiveStatus: '',
        diagnosis: '', treatmentPlan: '', doctorSummary: '',
        createdAt: '2026-07-06T00:00:00Z', updatedAt: '2026-07-06T00:00:00Z'
      },
      visitCloseChecklist: {
        visitId: '30000000-0000-0000-0000-000000000001',
        blockers: [], warnings: [], canClose: true, readyToSign: false,
        score: 0, nextAction: '', blockingItems: 0, items: []
      },
      documents: [], imagingStudies: [], protocolTemplates: [], serviceCatalog: [],
      treatmentPlanItems: [], treatmentPlanScenarios: [],
      clinicalRules: [], clinicalRuleEvaluations: [],
      clinicalRuleSummary: { score: 100, criticalCount: 0, activeRules: 0, evaluatedRules: 0, unresolved: 0, blockers: 0, warnings: 0, requiredServices: 0, coveredRules: 0 },
      payments: [],
      billingSummary: { totalPaid: 0, totalPending: 0, totalPlannedRub: 0, totalDiscountRub: 0, totalPaidRub: 0, totalDueRub: 0, taxDeductionEligibleRub: 0, draftDocumentAmountRub: 0, openTreatmentItems: 0, unpaidDocuments: 0 },
      communicationTemplates: [], communicationTasks: [], communicationEvents: [],
      communicationSummary: { unread: 0, openTasks: 0, urgentTasks: 0, dueToday: 0, overdue: 0, completedToday: 0, appointmentConfirmations: 0, paymentReminders: 0, postVisitInstructions: 0 },
      importBatches: [], speechProviders: [], auditEvents: [], complianceWarnings: []
    };

    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : String(args[0]));

      if (url.includes('/api/auth/user/me')) {
        return new Response(JSON.stringify({
          user: {
            id: '40000000-0000-0000-0000-000000000001',
            email: 'doctor@clinic.com',
            fullName: 'Dr. Ivan Petrov',
            globalRole: 'user',
            organizations: [{ id: '20000000-0000-0000-0000-000000000001', name: 'DENTE Clinic', role: 'admin' }]
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/auth/workspaces')) {
        return new Response(JSON.stringify([{
          id: '50000000-0000-0000-0000-000000000001',
          organizationId: '20000000-0000-0000-0000-000000000001',
          name: 'DENTE Clinic', role: 'admin', modules: [], joinedAt: '2026-01-01T00:00:00Z'
        }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/dashboard')) {
        return new Response(JSON.stringify(DASHBOARD), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/speech/providers/runtime')) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/speech/recordings/recovery')) return new Response(JSON.stringify({ recordings: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/speech/providers/health') || url.includes('/api/speech/gateway-health')) return new Response(JSON.stringify({ status: 'ok', activeProviderId: null, providers: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/speech/status')) return new Response(JSON.stringify({ status: 'idle', providerId: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/speech/recording-strategy')) return new Response(JSON.stringify({ strategy: 'browser', chunkSeconds: 30 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/system/persistence/verify')) return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/visits/') && url.includes('/draft/autosave')) return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/imaging/dicom/workbench-bundles')) return new Response(JSON.stringify({ bundles: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (url.includes('/api/patients')) return new Response(JSON.stringify({ patients: PATIENTS, total: PATIENTS.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });

      // Generic fallback - return empty arrays for everything
      return new Response(JSON.stringify({ data: [], bundles: [], plans: [], series: [], providers: [], recordings: [], ok: true, items: [], total: 0 }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    };
  });

  // ─── STEP 3: Reload so React reads the now-persisted LS tokens ───────────────
  await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
  console.log('Reloaded. Waiting 6s for app init...');
  await new Promise(r => setTimeout(r, 6000));

  // ─── STEP 4: Check if we got past auth gate ────────────────────────────────
  const bodyText = await page.$eval('body', el => el.innerText.substring(0, 200));
  console.log('Body preview:', bodyText.replace(/\n/g, ' ').substring(0, 120));

  const isOnLogin = bodyText.includes('ВХОД ДЛЯ СОТРУДНИКОВ') || bodyText.includes('Войти в профиль');
  if (isOnLogin) {
    console.error('[AUDIT] STILL ON LOGIN SCREEN - auth bypass failed');
    await page.screenshot({ path: 'audit_FAIL_login.png' });
    await browser.close();
    process.exit(1);
  }

  console.log('[AUDIT] Auth bypass SUCCESS - rendering app views');

  // ─── STEP 5: Capture all views ────────────────────────────────────────────
  const views = [
    { name: 'dashboard',      hash: 'dashboard' },
    { name: 'schedule',       hash: 'schedule' },
    { name: 'patients',       hash: 'patients' },
    { name: 'imaging',        hash: 'imaging' },
    { name: 'treatment',      hash: 'treatment' },
    { name: 'finance',        hash: 'finance' },
    { name: 'documents',      hash: 'documents' },
    { name: 'communications', hash: 'communications' },
    { name: 'settings',       hash: 'settings' },
  ];

  for (const view of views) {
    console.log('→ Capturing:', view.name);
    await page.evaluate((hash) => { window.location.hash = '#' + hash; }, view.hash);
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'audit_' + view.name + '.png' });
    console.log('  ✓ audit_' + view.name + '.png');
  }

  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => { window.location.hash = '#dashboard'; });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'audit_dashboard_mobile.png' });
  console.log('  ✓ audit_dashboard_mobile.png');

  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => { window.location.hash = '#patients'; });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'audit_patients_mobile.png' });
  console.log('  ✓ audit_patients_mobile.png');

  // ─── STEP 6: Error report ─────────────────────────────────────────────────
  const realErrors = ERRORS.filter(e => !e.includes('404') && !e.includes('favicon'));
  console.log('\n=== ERRORS (' + realErrors.length + ') ===');
  realErrors.forEach(e => console.log('ERR:', e.substring(0, 200)));

  fs.writeFileSync('audit_errors.json', JSON.stringify({ errors: ERRORS, warnings: WARNINGS, realErrors }, null, 2));
  console.log('\n✅ Audit complete!');

  await browser.close();
}

runAudit().catch(err => { console.error('AUDIT FAILED:', err.message); process.exit(1); });
