import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateDrillSequence } from './drillSequenceGenerator.js';

describe('generateDrillSequence', () => {
	test('generates D1 protocol when avgHu > 1250', () => {
		// avgHu = 1500 * 0.4 + 1500 * 0.4 + 1000 * 0.2 = 600 + 600 + 200 = 1400
		const result = generateDrillSequence(1500, 1500, 1000, 'Generic', 4.0);

		assert.strictEqual(result.boneClass, 'D1');
		assert.strictEqual(result.corticalHu, 1500);
		assert.strictEqual(result.cancellousHu, 1500);
		assert.strictEqual(result.apicalHu, 1000);
		assert.strictEqual(result.protocolSteps.length, 4);
		assert.ok(result.protocolSteps[1].includes('Фрезы до 4 мм на НИЗКИХ оборотах'));
		assert.ok(result.protocolSteps[2].includes('Обязательное использование кортикальной фрезы'));
		assert.ok(result.protocolSteps[3].includes('Высокий риск остеонекроза'));
	});

	test('generates D2 protocol when avgHu is exactly 1250', () => {
		// avgHu = 1250 * 0.4 + 1250 * 0.4 + 1250 * 0.2 = 1250
		const result = generateDrillSequence(1250, 1250, 1250, 'Generic', 4.0);

		assert.strictEqual(result.boneClass, 'D2');
		assert.strictEqual(result.protocolSteps.length, 3);
		assert.ok(result.protocolSteps[1].includes('Фрезы до 4 мм (стандартный протокол)'));
		assert.ok(result.protocolSteps[2].includes('Применение профильного сверла'));
	});

	test('generates D2 protocol when avgHu > 850 and <= 1250', () => {
		// avgHu = 1000
		const result = generateDrillSequence(1000, 1000, 1000, 'Generic', 4.5);

		assert.strictEqual(result.boneClass, 'D2');
		assert.strictEqual(result.protocolSteps.length, 3);
		assert.ok(result.protocolSteps[1].includes('Фрезы до 4.5 мм (стандартный протокол)'));
	});

	test('generates D3 protocol when avgHu is exactly 850', () => {
		// avgHu = 850
		const result = generateDrillSequence(850, 850, 850, 'Generic', 4.0);

		assert.strictEqual(result.boneClass, 'D3');
		assert.strictEqual(result.protocolSteps.length, 3);
		// (implantDiameter - 0.5) = 3.5
		assert.ok(result.protocolSteps[1].includes('Финальная фреза ~3.5 мм'));
		assert.ok(result.protocolSteps[2].includes('Избегать использования метчиков'));
	});

	test('generates D3 protocol when avgHu > 350 and <= 850', () => {
		// avgHu = 500
		const result = generateDrillSequence(500, 500, 500, 'Generic', 4.5);

		assert.strictEqual(result.boneClass, 'D3');
		assert.ok(result.protocolSteps[1].includes('Финальная фреза ~4.0 мм'));
	});

	test('generates D4 protocol when avgHu is exactly 350', () => {
		// avgHu = 350
		const result = generateDrillSequence(350, 350, 350, 'Generic', 4.0);

		assert.strictEqual(result.boneClass, 'D4');
		assert.strictEqual(result.protocolSteps.length, 4);
		// (implantDiameter - 1.0) = 3.0
		assert.ok(result.protocolSteps[1].includes('Финальная фреза ~3.0 мм'));
		assert.ok(result.protocolSteps[2].includes('Использование остеотомов'));
		assert.ok(result.protocolSteps[3].includes('Риск плохой первичной стабильности'));
	});

	test('generates D4 protocol when avgHu < 350', () => {
		// avgHu = 100
		const result = generateDrillSequence(100, 100, 100, 'Generic', 4.5);

		assert.strictEqual(result.boneClass, 'D4');
		assert.ok(result.protocolSteps[1].includes('Финальная фреза ~3.5 мм'));
	});

	test('adds specific steps for Osstem brand (case-insensitive)', () => {
		// avgHu = 1000 -> D2
		const result = generateDrillSequence(1000, 1000, 1000, 'OsStEm', 4.0);

		assert.strictEqual(result.boneClass, 'D2');
		assert.strictEqual(result.protocolSteps.length, 4); // 3 from D2 + 1 from brand
		assert.ok(result.protocolSteps[3].includes('Специфика Osstem: Использовать фрезу TSIII/TSIV'));
	});

	test('adds specific steps for Straumann brand (case-insensitive)', () => {
		// avgHu = 1000 -> D2
		const result = generateDrillSequence(1000, 1000, 1000, 'straumann BLX', 4.0);

		assert.strictEqual(result.boneClass, 'D2');
		assert.strictEqual(result.protocolSteps.length, 4);
		assert.ok(result.protocolSteps[3].includes('Специфика Straumann: Учитывать форму Bone Level / Tissue Level'));
	});
});
