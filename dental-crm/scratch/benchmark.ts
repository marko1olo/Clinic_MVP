const nCatalog = 10000;
const nItems = 10000;

const catalog = Array.from({ length: nCatalog }, (_, i) => ({
  id: `service_${i}`,
  taxDeductible: Math.random() > 0.5,
}));

const items = Array.from({ length: nItems }, (_, i) => ({
  serviceId: `service_${Math.floor(Math.random() * nCatalog)}`,
  unitPriceRub: 100,
  quantity: 1,
  discountRub: 0,
}));

function treatmentLineTotal(item: any) {
  return Math.max(0, item.unitPriceRub * item.quantity - item.discountRub);
}

console.time("baseline");
for (let j = 0; j < 100; j++) {
  const taxDeductionEligibleRub = items.reduce((total, item) => {
    const service = catalog.find((candidate) => candidate.id === item.serviceId);
    return total + (service?.taxDeductible ? treatmentLineTotal(item) : 0);
  }, 0);
}
console.timeEnd("baseline");

console.time("optimized");
for (let j = 0; j < 100; j++) {
  const serviceMap = new Map(catalog.map((s) => [s.id, s]));
  const taxDeductionEligibleRub = items.reduce((total, item) => {
    const service = serviceMap.get(item.serviceId);
    return total + (service?.taxDeductible ? treatmentLineTotal(item) : 0);
  }, 0);
}
console.timeEnd("optimized");
