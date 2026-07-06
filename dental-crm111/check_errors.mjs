import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", error => console.error(`[Browser Error] ${error.message}`));

  await page.route("**/api/auth/user/me", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "mock-user", email: "doctor@clinic.com", role: "doctor" })
    });
  });

  await page.route("**/api/dashboard", (route) => {
    const mockDashboard = {
      clinicName: "Mock Clinic",
      todayIso: new Date().toISOString(),
      clinicSettings: { timezone: "UTC", workingHours: { start: "09:00", end: "18:00" }, activeFeatures: [] },
      shiftIntelligence: { tasks: [], alerts: [] },
      patients: [], patientInsights: [], recommendedActions: [], appointments: [], appointmentReadiness: [], scheduleSuggestions: [],
      activeVisit: null, visitCloseChecklist: { requirements: [], isReady: true },
      documents: [], imagingStudies: [], protocolTemplates: [], serviceCatalog: [], treatmentPlanItems: [], treatmentPlanScenarios: [],
      clinicalRules: [], clinicalRuleEvaluations: [], clinicalRuleSummary: { safe: true, warnings: [] },
      payments: [], billingSummary: { total: 0, paid: 0, pending: 0 },
      communicationTemplates: [], communicationTasks: [], communicationEvents: [], communicationSummary: { unread: 0 },
      importBatches: [], speechProviders: [], auditEvents: []
    };
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockDashboard) });
  });

  await page.route("**/api/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));

  await page.goto("http://localhost:5173", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(5000); // Give it time to render and log errors

  await browser.close();
})();
