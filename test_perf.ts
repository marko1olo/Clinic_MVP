import fs from 'fs';

// Mock state and function logic to test performance
const activeTreatmentPlanItems = Array.from({ length: 1000 }, (_, i) => ({
  status: "active",
  visitId: 1,
  serviceId: `service-${i % 100}`,
  quantity: 2,
  unitPriceRub: 1000,
  discountRub: 100,
  toothCode: null
}));

const dashboard = {
  activeVisit: { id: 1 },
  serviceCatalog: Array.from({ length: 100 }, (_, i) => ({
    id: `service-${i}`,
    title: `Service Title ${i}`
  }))
};

function originalApproach() {
  return activeTreatmentPlanItems
    .filter((item) => item.status !== "cancelled")
    .filter((item) => !dashboard?.activeVisit.id || item.visitId === dashboard.activeVisit.id)
    .map((item) => {
      const service = dashboard?.serviceCatalog.find((catalogItem) => catalogItem.id === item.serviceId);
      const totalRub = Math.max(0, item.unitPriceRub * item.quantity - item.discountRub);
      return {
        serviceName: service?.title ?? item.serviceId,
        toothOrArea: item.toothCode ? `зуб ${item.toothCode}` : null,
        quantity: item.quantity,
        unitPriceRub: item.unitPriceRub,
        discountRub: item.discountRub,
        totalRub
      };
    });
}

function optimizedApproach() {
  // Convert to Map
  const catalogMap = new Map(dashboard?.serviceCatalog?.map(item => [item.id, item]));

  return activeTreatmentPlanItems
    .filter((item) => item.status !== "cancelled")
    .filter((item) => !dashboard?.activeVisit.id || item.visitId === dashboard.activeVisit.id)
    .map((item) => {
      const service = catalogMap.get(item.serviceId);
      const totalRub = Math.max(0, item.unitPriceRub * item.quantity - item.discountRub);
      return {
        serviceName: service?.title ?? item.serviceId,
        toothOrArea: item.toothCode ? `зуб ${item.toothCode}` : null,
        quantity: item.quantity,
        unitPriceRub: item.unitPriceRub,
        discountRub: item.discountRub,
        totalRub
      };
    });
}

// Warmup
for (let i = 0; i < 1000; i++) {
  originalApproach();
  optimizedApproach();
}

console.log("Starting benchmark...");

const startOriginal = performance.now();
for (let i = 0; i < 10000; i++) {
  originalApproach();
}
const endOriginal = performance.now();
const timeOriginal = endOriginal - startOriginal;

const startOptimized = performance.now();
for (let i = 0; i < 10000; i++) {
  optimizedApproach();
}
const endOptimized = performance.now();
const timeOptimized = endOptimized - startOptimized;

console.log(`Original approach time: ${timeOriginal.toFixed(2)} ms`);
console.log(`Optimized approach time: ${timeOptimized.toFixed(2)} ms`);
console.log(`Improvement: ${((timeOriginal - timeOptimized) / timeOriginal * 100).toFixed(2)}%`);
