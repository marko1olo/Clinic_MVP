import assert from "node:assert";
import { afterEach, describe, mock, test } from "node:test";
import { findAvailableSlots } from "../lib/schedulingAlgorithms.js";

describe("findAvailableSlots", () => {
	const baseDateStr = "2024-01-01"; // Monday
	const baseTimestamp = new Date(`${baseDateStr}T00:00:00`).getTime();

	afterEach(() => {
		mock.timers.reset();
	});

	test("returns empty if doctor or chair not found", () => {
		const dashboard = {
			clinicSettings: {
				staff: [],
				chairs: [{ id: "chair1", name: "Chair 1" }],
			},
			appointments: [],
		} as any;

		const slots = findAvailableSlots(dashboard, {
			doctorId: "doc1",
			chairId: "chair1",
			durationMinutes: 30,
		});
		assert.deepEqual(slots, []);
	});

	test("returns empty if assistant is required but not found", () => {
		const dashboard = {
			clinicSettings: {
				staff: [
					{
						id: "doc1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "17:00" },
						],
					},
				],
				chairs: [{ id: "chair1", name: "Chair 1" }],
			},
			appointments: [],
		} as any;

		const slots = findAvailableSlots(dashboard, {
			doctorId: "doc1",
			assistantId: "ast1", // Doesn't exist
			chairId: "chair1",
			durationMinutes: 30,
		});
		assert.deepEqual(slots, []);
	});

	test("returns empty if assistant does not have working hours that match", () => {
		mock.timers.enable({ apis: ["Date"] });
		mock.timers.setTime(baseTimestamp);

		const dashboard = {
			clinicSettings: {
				staff: [
					{
						id: "doc1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "17:00" },
						],
					},
					{
						id: "ast1", // No working hours on Monday (1)
						workingHours: [
							{ enabled: true, weekday: 2, start: "09:00", end: "17:00" },
						],
					},
				],
				chairs: [
					{
						id: "chair1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "17:00" },
						],
					},
				],
			},
			appointments: [],
		} as any;

		const slots = findAvailableSlots(
			dashboard,
			{
				doctorId: "doc1",
				assistantId: "ast1",
				chairId: "chair1",
				durationMinutes: 30,
				dateStr: baseDateStr,
			},
			10,
		);

		assert.deepEqual(slots, []);
	});

	test("returns available slots avoiding collisions and skipped for canceled appointments", () => {
		mock.timers.enable({ apis: ["Date"] });
		mock.timers.setTime(baseTimestamp);

		const dashboard = {
			clinicSettings: {
				staff: [
					{
						id: "doc1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "11:00" },
						],
					},
				],
				chairs: [
					{
						id: "chair1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "11:00" },
						],
					},
				],
			},
			appointments: [
				{
					id: "app1",
					startsAt: "2024-01-01T09:30:00Z",
					endsAt: "2024-01-01T10:00:00Z",
					doctorUserId: "doc1",
					chairId: "chair1",
					status: "scheduled",
				},
				{
					id: "app2",
					startsAt: "2024-01-01T10:15:00Z",
					endsAt: "2024-01-01T10:45:00Z",
					doctorUserId: "doc1",
					chairId: "chair1",
					status: "cancelled", // Should not cause collision
				},
			],
		} as any;

		const slots = findAvailableSlots(
			dashboard,
			{
				doctorId: "doc1",
				chairId: "chair1",
				durationMinutes: 30,
				dateStr: baseDateStr,
			},
			10,
		);

		const slotTimes = slots.map((s) => [s.startsAt, s.endsAt]);

		// Should return 09:00, 10:00, 10:30 on day 1 (canceled appointment is ignored)
		assert.strictEqual(slotTimes.length > 3, true);
		assert.match(slotTimes[0][0], /09:00:00/);
		assert.match(slotTimes[0][1], /09:30:00/);

		assert.match(slotTimes[1][0], /10:00:00/);
		assert.match(slotTimes[1][1], /10:30:00/);

		assert.match(slotTimes[2][0], /10:30:00/);
		assert.match(slotTimes[2][1], /11:00:00/);
	});

	test("does not return slots in the past", () => {
		// Current time is 10:00:00, so it shouldn't return the 09:00 slot
		const currentTimestamp = new Date(`${baseDateStr}T10:00:00`).getTime();
		mock.timers.enable({ apis: ["Date"] });
		mock.timers.setTime(currentTimestamp);

		const dashboard = {
			clinicSettings: {
				staff: [
					{
						id: "doc1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "11:00" },
						],
					},
				],
				chairs: [
					{
						id: "chair1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "11:00" },
						],
					},
				],
			},
			appointments: [],
		} as any;

		const slots = findAvailableSlots(
			dashboard,
			{
				doctorId: "doc1",
				chairId: "chair1",
				durationMinutes: 30,
				dateStr: baseDateStr,
			},
			2,
		);

		const slotTimes = slots.map((s) => [s.startsAt, s.endsAt]);

		assert.strictEqual(slotTimes.length, 2);
		assert.match(slotTimes[0][0], /10:00:00/);
		assert.match(slotTimes[0][1], /10:30:00/);

		assert.match(slotTimes[1][0], /10:30:00/);
		assert.match(slotTimes[1][1], /11:00:00/);
	});

	test("respects the limit parameter", () => {
		mock.timers.enable({ apis: ["Date"] });
		mock.timers.setTime(baseTimestamp);

		const dashboard = {
			clinicSettings: {
				staff: [
					{
						id: "doc1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "17:00" },
						],
					},
				],
				chairs: [
					{
						id: "chair1",
						workingHours: [
							{ enabled: true, weekday: 1, start: "09:00", end: "17:00" },
						],
					},
				],
			},
			appointments: [],
		} as any;

		const slots = findAvailableSlots(
			dashboard,
			{
				doctorId: "doc1",
				chairId: "chair1",
				durationMinutes: 30,
				dateStr: baseDateStr,
			},
			4,
		); // Limit is 4

		assert.strictEqual(slots.length, 4);
	});
});
