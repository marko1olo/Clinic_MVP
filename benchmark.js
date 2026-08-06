const fs = require("fs");

function runBenchmark() {
	const serviceCatalog = Array.from({ length: 5000 }, (_, i) => ({
		id: `service-${i}`,
		taxDeductible: i % 2 === 0,
	}));

	const activePlanItems = Array.from({ length: 1000 }, (_, i) => ({
		serviceId: `service-${Math.floor(Math.random() * 5000)}`,
		unitPriceRub: 100,
		quantity: 1,
		discountRub: 10,
		status: "active",
	}));

	const treatmentLineTotal = (item) =>
		Math.max(0, item.unitPriceRub * item.quantity - item.discountRub);

	// Unoptimized
	const startUnoptimized = process.hrtime.bigint();
	const taxDeductionEligibleRubUnoptimized = activePlanItems.reduce(
		(total, item) => {
			const service = serviceCatalog.find(
				(candidate) => candidate.id === item.serviceId,
			);
			return total + (service?.taxDeductible ? treatmentLineTotal(item) : 0);
		},
		0,
	);
	const endUnoptimized = process.hrtime.bigint();
	const timeUnoptimized = Number(endUnoptimized - startUnoptimized) / 1e6;

	// Optimized
	const startOptimized = process.hrtime.bigint();

	const serviceCatalogMap = new Map();
	for (const service of serviceCatalog) {
		serviceCatalogMap.set(service.id, service);
	}

	const taxDeductionEligibleRubOptimized = activePlanItems.reduce(
		(total, item) => {
			const service = serviceCatalogMap.get(item.serviceId);
			return total + (service?.taxDeductible ? treatmentLineTotal(item) : 0);
		},
		0,
	);

	const endOptimized = process.hrtime.bigint();
	const timeOptimized = Number(endOptimized - startOptimized) / 1e6;

	return { timeUnoptimized, timeOptimized };
}

runBenchmark();
