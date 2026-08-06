import { dashboardSchema } from "@dental/shared";
import { buildDashboard } from "../sampleData.js";
export class ClinicOrganizationMissingError extends Error {
    organizationId;
    constructor(organizationId) {
        super("Клиника из сессии не найдена в базе данных.");
        this.name = "ClinicOrganizationMissingError";
        this.organizationId = organizationId;
    }
}
export async function getDashboardFromDb(organizationId) {
    const dashboard = buildDashboard();
    const parsed = dashboardSchema.safeParse(dashboard);
    if (!parsed.success) {
        console.error("[DashboardQuery] Сводка не соответствует контракту:");
        return dashboard;
    }
    return parsed.data;
}
