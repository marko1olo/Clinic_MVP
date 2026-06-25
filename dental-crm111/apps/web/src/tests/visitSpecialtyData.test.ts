import { test, describe } from 'node:test';
import assert from 'node:assert';
import { inferDashboardVisitSpecialty, inferSpecialtyFromText } from '../visitSpecialtyData.js';
import type { Dashboard } from '@dental/shared';

describe('inferDashboardVisitSpecialty', () => {
  test('returns reason specialty when it matches doctor specialty', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'app-1' },
      appointments: [
        { id: 'app-1', doctorUserId: 'doc-1', chairId: 'chair-1', reason: 'кариес' }
      ],
      clinicSettings: {
        staff: [
          { id: 'doc-1', active: true, specialties: ['therapist', 'orthopedist'] }
        ],
        chairs: [
          { id: 'chair-1', active: true, specialization: 'universal' }
        ]
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'therapist');
  });

  test('falls back to doctor first non-universal specialty if reason does not match', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'app-1' },
      appointments: [
        { id: 'app-1', doctorUserId: 'doc-1', chairId: 'chair-1', reason: 'имплант' }
      ],
      clinicSettings: {
        staff: [
          { id: 'doc-1', active: true, specialties: ['orthopedist', 'universal'] }
        ],
        chairs: [
          { id: 'chair-1', active: true, specialization: 'universal' }
        ]
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'orthopedist');
  });

  test('falls back to chair specialization if doctor has no specialties', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'app-1' },
      appointments: [
        { id: 'app-1', doctorUserId: 'doc-1', chairId: 'chair-1', reason: 'unknown' }
      ],
      clinicSettings: {
        staff: [
          { id: 'doc-1', active: true, specialties: [] }
        ],
        chairs: [
          { id: 'chair-1', active: true, specialization: 'surgeon' }
        ]
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'surgeon');
  });

  test('falls back to reason specialty if neither doctor nor chair provides one', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'app-1' },
      appointments: [
        { id: 'app-1', doctorUserId: 'doc-1', chairId: 'chair-1', reason: 'чистка' }
      ],
      clinicSettings: {
        staff: [
          { id: 'doc-1', active: true, specialties: [] }
        ],
        chairs: [
          { id: 'chair-1', active: true, specialization: null }
        ]
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'hygienist');
  });

  test('returns universal when nothing else matches', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'app-1' },
      appointments: [
        { id: 'app-1', doctorUserId: 'doc-1', chairId: 'chair-1', reason: null }
      ],
      clinicSettings: {
        staff: [
          { id: 'doc-1', active: true, specialties: [] }
        ],
        chairs: [
          { id: 'chair-1', active: true, specialization: null }
        ]
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'universal');
  });

  test('handles missing appointment gracefully', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'missing-app' },
      appointments: [],
      clinicSettings: {
        staff: [],
        chairs: []
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'universal');
  });

  test('handles inactive doctor and chair gracefully', () => {
    const mockDashboard = {
      activeVisit: { appointmentId: 'app-1' },
      appointments: [
        { id: 'app-1', doctorUserId: 'doc-1', chairId: 'chair-1', reason: null }
      ],
      clinicSettings: {
        staff: [
          { id: 'doc-1', active: false, specialties: ['therapist'] }
        ],
        chairs: [
          { id: 'chair-1', active: false, specialization: 'surgeon' }
        ]
      }
    } as unknown as Dashboard;

    const result = inferDashboardVisitSpecialty(mockDashboard);
    assert.strictEqual(result, 'universal');
  });
});
