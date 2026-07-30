import { eq, sql } from "drizzle-orm";
import { db } from "./client.js";
import { treatmentPlanPrintOdontograms } from "./schema.js";

async function ensureTreatmentPlanPrintOdontogramsTable() {
	try {
		await db.execute(sql`
			CREATE TABLE IF NOT EXISTS "treatment_plan_print_odontograms" (
				"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
				"organization_id" uuid NOT NULL,
				"patient_name" text NOT NULL,
				"plan_title" text NOT NULL,
				"odontogram_included" boolean DEFAULT true NOT NULL,
				"tooth_formula_snippet" text NOT NULL,
				"print_layout_ready" boolean DEFAULT true NOT NULL,
				"created_at" timestamp with time zone DEFAULT now() NOT NULL
			);
		`);
	} catch (err) {
		console.warn("[ensureTreatmentPlanPrintOdontogramsTable warning]:", err);
	}
}


export async function getTreatmentPlanPrintOdontogramsFromDb(orgId: string) {
	try {
		await ensureTreatmentPlanPrintOdontogramsTable();
		const rows = await db
			.select()
			.from(treatmentPlanPrintOdontograms)
			.where(eq(treatmentPlanPrintOdontograms.organizationId, orgId));

		if (rows && rows.length > 0) return rows;
	} catch (err) {
		console.warn("[TreatmentPlanPrintOdontograms DB Fallback]:", err);
	}

	return [];
}
