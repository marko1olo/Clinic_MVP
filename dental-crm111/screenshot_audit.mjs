import { chromium } from "playwright";
import path from "path";
import fs from "fs";

(async () => {
  const browser = await chromium.launch({ headless: true });

  const runAuditForViewport = async (width, height, prefix) => {
    console.log(`Starting audit for viewport: ${width}x${height} (${prefix})`);
    const context = await browser.newContext({
      viewport: { width, height }
    });

    const page = await context.newPage();

    page.on("console", msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
    page.on("pageerror", error => console.error(`[Browser Error] ${error.message}`));

    await page.route("**/api/**", (route, request) => {
      const url = request.url();
      if (url.includes("/api/auth/user/me")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: "mock-user", email: "doctor@clinic.com", role: "doctor" })
        });
      }

      if (url.includes("/api/dashboard")) {
        const mockDashboard = {
          clinicName: "Mock Clinic",
          todayIso: new Date().toISOString(),
          clinicSettings: { 
            timezone: "UTC", 
            workingHours: { start: "09:00", end: "18:00" },
            activeFeatures: [],
            staff: [],
            chairs: [],
            workspaceProfiles: [],
            roleAccessPolicies: [],
            integrationPresets: [],
            modeHints: [],
            profile: {
              organizationId: "123e4567-e89b-12d3-a456-426614174000",
              clinicName: "Mock Clinic",
              legalName: null,
              inn: null,
              address: null,
              phone: null,
              medicalLicenseNumber: null,
              medicalLicenseIssuedAt: null,
              medicalLicenseIssuer: null,
              timezone: "UTC",
              mode: "solo_doctor",
              defaultVisitMinutes: 30,
              scheduleDefaults: {
                workdayStart: "09:00",
                workdayEnd: "18:00",
                workingDays: [1, 2, 3, 4, 5],
                appointmentBufferMinutes: 0
              },
              networkEnabled: false,
              egiszEnabled: false,
              updatedAt: "2025-01-01T00:00:00.000Z"
            }
          },
          shiftIntelligence: { doctorLoads: [], assistantLoads: [], chairLoads: [], roleQueues: [], scheduleWarnings: [], modeFit: {
            mode: "solo_doctor",
            title: "Solo Doctor",
            fitScore: 100,
            blockers: [],
            upgrades: [],
            lowFrictionNextStep: "none"
          } },
          patients: [], // Empty state for patients!
          patientInsights: [],
          recommendedActions: [],
          appointments: [], // Empty state for schedule!
          appointmentReadiness: [],
          scheduleSuggestions: [],
          activeVisit: { id: "123e4567-e89b-12d3-a456-426614174000", organizationId: "123e4567-e89b-12d3-a456-426614174000", patientId: "123e4567-e89b-12d3-a456-426614174000", appointmentId: null, status: "draft", revision: 1, complaint: null, anamnesis: null, objectiveStatus: null, diagnosis: null, treatmentPlan: null, doctorSummary: null, createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2025-01-01T00:00:00.000Z" },
          visitCloseChecklist: { items: [], visitId: "123e4567-e89b-12d3-a456-426614174000", readyToSign: false, score: 0, nextAction: "none", blockingItems: 0 },
          documents: [],
          imagingStudies: [],
          protocolTemplates: [],
          serviceCatalog: [],
          treatmentPlanItems: [],
          treatmentPlanScenarios: [],
          clinicalRules: [],
          clinicalRuleEvaluations: [],
          clinicalRuleSummary: { safe: true, warnings: 0, activeRules: 0, evaluatedRules: 0, unresolved: 0, blockers: 0, requiredServices: 0, coveredRules: 0 },
          payments: [],
          billingSummary: { total: 0, paid: 0, pending: 0, totalPlannedRub: 0, totalDiscountRub: 0, totalPaidRub: 0, totalDueRub: 0, taxDeductionEligibleRub: 0, draftDocumentAmountRub: 0, openTreatmentItems: 0, unpaidDocuments: 0 },
          communicationTemplates: [],
          communicationTasks: [],
          communicationEvents: [],
          communicationSummary: { unread: 0, openTasks: 0, urgentTasks: 0, dueToday: 0, overdue: 0, completedToday: 0, appointmentConfirmations: 0, paymentReminders: 0, postVisitInstructions: 0 },
          importBatches: [],
          speechProviders: [],
          auditEvents: [],
          complianceWarnings: []
        };
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockDashboard)
        });
      }

      if (url.includes("/api/speech/gateway-health")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "healthy",
            activeProviderId: "mock",
            providers: []
          })
        });
      }

      if (url.includes("/api/speech/providers/runtime")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([])
        });
      }

      // Default fallback for any other API
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({})
      });
    });

    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    try {
      await page.goto("http://localhost:5173", { waitUntil: "networkidle", timeout: 30000 });
    } catch (err) {
      console.error("Failed to navigate. Is 'npm run dev' running?", err);
      process.exit(1);
    }

    const outDir = path.resolve("audit_screenshots");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    await page.waitForTimeout(3000); // Give dashboard time to render
    
    const tabs = [
      { name: "01_dashboard", selector: "text=Расписание" },
      { name: "02_patients", selector: "text=Пациенты" },
      { name: "03_imaging", selector: "text=Снимки" },
      { name: "04_documents", selector: "text=Документы" },
      { name: "05_finance", selector: "text=Финансы" },
      { name: "06_settings", selector: "text=Настройки" },
    ];

    for (const tab of tabs) {
      console.log(`[${prefix}] Clicking ${tab.name}...`);
      try {
        await page.click(tab.selector, { timeout: 2000 });
        await page.waitForTimeout(1000); // Animation wait
        await page.screenshot({ path: path.join(outDir, `${prefix}_${tab.name}.png`), fullPage: true });
      } catch (e) {
        console.log(`[${prefix}] Tab ${tab.name} not found or error:`, e.message);
      }
    }

    await context.close();
  };

  await runAuditForViewport(1920, 1080, "fullscreen");
  await runAuditForViewport(1024, 768, "adaptive");

  await browser.close();
  console.log("Screenshots saved to audit_screenshots/");
})();
