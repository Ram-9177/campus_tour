import { describe, expect, test } from 'vitest';
import type { RouteSegment } from './campusPathfinding';
import { buildRouteInstructions } from './routeInstructionEngine';

function buildSteps(routeSegments: RouteSegment[], isConnectedRoadRoute: boolean, offroadConfidence: 'high' | 'medium' | 'low' | null) {
  return buildRouteInstructions({
    routeSegments,
    destinationName: 'Library',
    isConnectedRoadRoute,
    offroadConfidence,
  });
}

describe('routeInstructionEngine', () => {
  test('connected road route emits turn-aware road instructions without road-end marker', () => {
    const routeSegments: RouteSegment[] = [
      {
        kind: 'road',
        points: [
          [17.331, 78.727],
          [17.331, 78.728],
          [17.33, 78.728],
        ],
        distanceMeters: 220,
      },
    ];

    const steps = buildSteps(routeSegments, true, null);

    expect(steps.some((step) => step.text.includes('Turn right'))).toBe(true);
    expect(steps.some((step) => step.text.includes('Road ends here'))).toBe(false);
    expect(steps.at(-1)?.text).toBe('Arrive at Library.');
  });

  test('partial route emits connector, road-end marker, and confidence-labeled final approach', () => {
    const routeSegments: RouteSegment[] = [
      {
        kind: 'start_connector',
        points: [
          [17.3319, 78.7275],
          [17.3318, 78.7276],
        ],
        distanceMeters: 18,
      },
      {
        kind: 'road',
        points: [
          [17.3318, 78.7276],
          [17.3315, 78.7278],
        ],
        distanceMeters: 42,
      },
      {
        kind: 'offroad',
        points: [
          [17.3315, 78.7278],
          [17.3312, 78.72795],
          [17.3311, 78.7282],
        ],
        distanceMeters: 58,
        confidence: 'medium',
      },
    ];

    const steps = buildSteps(routeSegments, false, 'medium');

    expect(steps.some((step) => step.text === 'Walk to the nearest campus road.')).toBe(true);
    expect(steps.some((step) => step.text === 'Road ends here.')).toBe(true);

    const finalApproach = steps.find((step) => step.text.startsWith('Continue to Library.'));
    expect(finalApproach).toBeDefined();
    expect(finalApproach?.text.includes('(medium confidence)')).toBe(true);
    expect(finalApproach?.distanceMeters).toBe(58);
  });

  test('0m-road partial case still yields valid off-road instructions and distance', () => {
    const routeSegments: RouteSegment[] = [
      {
        kind: 'offroad',
        points: [
          [17.3318, 78.7276],
          [17.3314, 78.7281],
        ],
        distanceMeters: 76,
        confidence: 'low',
      },
    ];

    const steps = buildSteps(routeSegments, false, 'low');

    const offRoadStep = steps.find((step) => step.text.startsWith('Continue to Library.'));
    expect(offRoadStep).toBeDefined();
    expect(offRoadStep?.distanceMeters).toBe(76);
    expect(steps.some((step) => step.text === 'Road ends here.')).toBe(false);
    expect(steps.at(-1)?.text).toBe('Arrive at Library.');
  });

  test('aggregates contiguous continue segments into one road step when heading stays consistent', () => {
    const routeSegments: RouteSegment[] = [
      {
        kind: 'road',
        points: [
          [17.331, 78.727],
          [17.331, 78.7274],
          [17.331, 78.7278],
          [17.331, 78.7282],
        ],
        distanceMeters: 160,
      },
    ];

    const steps = buildSteps(routeSegments, true, null);
    const roadInstructionCount = steps.filter((step) => step.text.includes('campus road')).length;

    expect(roadInstructionCount).toBe(1);
    expect(steps.at(-1)?.text).toBe('Arrive at Library.');
  });
});
