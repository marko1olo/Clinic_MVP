const puppeteer = require('puppeteer');

async function runAudit() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(msg.type().toUpperCase() + ': ' + msg.text());
    }
  });
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.toString()));

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('auth_user', JSON.stringify({ id: 'u_1', name: 'Dr. Audit', email: 'audit@clinic.com', role: 'admin' }));
    
    // MOCK FETCH TO PREVENT 401/404 CRASHES
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      console.log("Mocking fetch for", url);
      
      if (url.includes('/api/dashboard')) {
        return new Response(JSON.stringify({
          clinicName: 'DENTE Mock',
          todayIso: '2026-07-06T00:00:00Z',
          clinicSettings: { profile: { id: 'p1', name: 'Main' }, integrationPresets: [], modeHints: [], staff: [], chairs: [], workspaceProfiles: [], roleAccessPolicies: [], timezone: 'Europe/Moscow' },
          shiftIntelligence: { roleQueues: [], doctorLoads: [], assistantLoads: [], chairLoads: [], scheduleWarnings: [], modeFit: {} },
          patients: [],
          patientInsights: [],
          recommendedActions: [],
          appointments: [],
          appointmentReadiness: [],
          scheduleSuggestions: [],
          activeVisit: { id: 'v1', appointmentId: 'a1', status: 'in_progress', patientId: 'p1', checkInIso: '2026-07-06T00:00:00Z' },
          visitCloseChecklist: { blockers: [], warnings: [], canClose: true, readyToSign: false, score: 0, nextAction: '', blockingItems: 0, items: [] },
          documents: [],
          imagingStudies: [],
          protocolTemplates: [],
          serviceCatalog: [],
          treatmentPlanItems: [],
          treatmentPlanScenarios: [],
          clinicalRules: [],
          clinicalRuleEvaluations: [],
          clinicalRuleSummary: { score: 100, criticalCount: 0, activeRules: 0, evaluatedRules: 0, unresolved: 0, blockers: 0, warnings: 0, requiredServices: 0, coveredRules: 0 },
          payments: [],
          billingSummary: { totalPaid: 0, totalPending: 0, totalPlannedRub: 0, totalDiscountRub: 0, totalPaidRub: 0, totalDueRub: 0, taxDeductionEligibleRub: 0, draftDocumentAmountRub: 0, openTreatmentItems: 0, unpaidDocuments: 0 },
          communicationTemplates: [],
          communicationTasks: [],
          communicationEvents: [],
          communicationSummary: { unread: 0, openTasks: 0, urgentTasks: 0, dueToday: 0, overdue: 0, completedToday: 0, appointmentConfirmations: 0, paymentReminders: 0, postVisitInstructions: 0 },
          importBatches: [],
          speechProviders: [],
          auditEvents: [],
          complianceWarnings: []
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      
      if (url.includes('/api/speech/providers/runtime')) {
        return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      if (url.includes('/api/speech/providers/health')) {
        return new Response(JSON.stringify({ status: 'ok', activeProviderId: null, providers: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      
      return new Response(JSON.stringify({ data: [], bundles: [], plans: [], series: [], providers: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    };
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Collected Errors:', errors);
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
}
runAudit().catch(console.error);
