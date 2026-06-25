import fs from 'fs';

let code = fs.readFileSync('apps/web/src/store/documentStore.ts', 'utf8');

// Add imports at the top
const extraImports = `
import { TreatmentPlanAcceptanceVariant, PostVisitCareTopic, PhotoVideoConsentMaterial, XrayCbctReferralStudyType, XrayCbctReferralPregnancyStatus, XrayCbctReferralPriority } from "@dental/shared";
import { dateInputValuePlusDays } from "../helpers";
import { defaultClinicalToothRowsText } from "../AppHelpers";
import { postVisitCarePresets } from "../postVisitCareData";
import { loadUiPreferences } from "./uiStore";

const initialUiPreferences = loadUiPreferences();
`;

code = code.replace(/import { GeneratedDocument } from "@dental\/shared";/, 'import { GeneratedDocument } from "@dental/shared";' + extraImports);

code = code.replace(
    'newDocumentDraft: emptyDocumentDraft,',
    'newDocumentDraft: emptyDocumentDraft(),'
);

code = code.replace(
    'newDocumentSeriesDraft: emptyDocumentSeriesDraft,',
    'newDocumentSeriesDraft: emptyDocumentSeriesDraft(),'
);

// Fix TS issues with arrays where type was incorrectly inferred
// e.g.   personalDataPurposes: any; -> personalDataPurposes: string[];
code = code.replace(/personalDataPurposes: any;/g, 'personalDataPurposes: string[];');
code = code.replace(/personalDataCategories: any;/g, 'personalDataCategories: string[];');
code = code.replace(/personalDataActions: any;/g, 'personalDataActions: string[];');

code = code.replace(/documentViewActiveDocumentSources: any\[\],/g, 'documentViewActiveDocumentSources: [] as any[],');
code = code.replace(/documentViewActiveRecordSources: any\[\],/g, 'documentViewActiveRecordSources: [] as any[],');
code = code.replace(/documentViewActivePaymentSources: any\[\],/g, 'documentViewActivePaymentSources: [] as any[],');

fs.writeFileSync('apps/web/src/store/documentStore.ts', code);
console.log("Fixed documentStore.ts");
