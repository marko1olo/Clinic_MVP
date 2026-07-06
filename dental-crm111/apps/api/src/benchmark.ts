import { buildDenteTelegramOutbox } from "./sampleData.js";
import { patients, payments } from "./sampleData.js";

// Populate more patients and payments
for (let i = 0; i < 10000; i++) {
  patients.push({
    id: `patient-bench-${i}`,
    organizationId: "4a3420d1-6ffb-4459-bd8f-7f7087f5e191",
    status: "active",
    fullName: `Bench Patient ${i}`,
    birthDate: "1980-01-01",
    phone: null,
    email: null,
    notes: null,
    administrativeProfile: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

for (let i = 0; i < 2000; i++) {
  payments.push({
    id: `payment-bench-${i}`,
    organizationId: "4a3420d1-6ffb-4459-bd8f-7f7087f5e191",
    patientId: `patient-bench-${i}`,
    visitId: null,
    documentId: null,
    amountRub: 1000,
    method: "card",
    status: "paid",
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    fiscalReceiptNumber: null,
    fiscalReceiptIssuedAt: null,
    fiscalReceiptUrl: null,
    fiscalReceipt: null,
    payerFullName: null,
    payerInn: null,
    payerBirthDate: null,
    payerIdentityDocument: null,
    payerRelationship: null,
    taxDeductionCode: null,
    note: null
  });
}

const start = performance.now();
buildDenteTelegramOutbox();
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
