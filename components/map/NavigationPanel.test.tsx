import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import type { CampusLocation } from '@/types/campusLocation';
import NavigationPanel from './NavigationPanel';

function createLocation(id: string, name: string, lat: number, lon: number): CampusLocation {
  return {
    id,
    slug: id,
    name: { en: name, te: name, hi: name },
    category: 'other',
    latitude: lat,
    longitude: lon,
    radiusMeters: 5,
    description: { en: '', te: '', hi: '' },
    script: { en: '', te: '', hi: '' },
    audio: { en: '', te: '', hi: '' },
    images: [],
    videos: [],
    routeOrder: 1,
    recommendedFor: ['other'],
    active: true,
  };
}

describe('NavigationPanel keyboard flow', () => {
  const locations = [
    createLocation('main-gate', 'Main Gate', 17.332, 78.728),
    createLocation('admin-block', 'Admin Block', 17.3317, 78.7278),
    createLocation('canteen', 'Canteen', 17.3311, 78.7271),
  ];

  test('keyboard-only selection enables and triggers Get Directions', async () => {
    const user = userEvent.setup();
    const onRouteSelect = vi.fn();

    render(<NavigationPanel locations={locations} onRouteSelect={onRouteSelect} />);

    const fromInput = screen.getByRole('combobox', { name: /from/i });
    const toInput = screen.getByRole('combobox', { name: /to/i });
    const getDirectionsButton = screen.getByRole('button', { name: /get directions/i });

    expect(getDirectionsButton).toBeDisabled();

    await user.click(fromInput);
    await user.type(fromInput, 'Main');
    await user.keyboard('{Enter}');

    await user.click(toInput);
    await user.type(toInput, 'Admin');
    await user.keyboard('{Enter}');

    expect(getDirectionsButton).toBeEnabled();
    await user.click(getDirectionsButton);

    expect(onRouteSelect).toHaveBeenCalledTimes(1);
    const [startLoc, endLoc] = onRouteSelect.mock.calls[0] as [CampusLocation, CampusLocation];
    expect(startLoc.id).toBe('main-gate');
    expect(endLoc.id).toBe('admin-block');
  });

  test('Escape closes the open suggestions listbox', async () => {
    const user = userEvent.setup();

    render(<NavigationPanel locations={locations} />);

    const fromInput = screen.getByRole('combobox', { name: /from/i });

    await user.click(fromInput);
    await user.type(fromInput, 'a');

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('renders provided route instruction steps with distances', () => {
    render(
      <NavigationPanel
        locations={locations}
        selectedStart={locations[0]}
        selectedEnd={locations[1]}
        routeDistanceMeters={210}
        routeWalkMinutes={3}
        hasRoadRoute={true}
        hasConnectedRoadRoute={false}
        roadDistanceMeters={140}
        offRoadDistanceMeters={70}
        offroadConfidence="medium"
        instructionSteps={[
          { text: 'Walk to the nearest campus road.', distanceMeters: 25 },
          { text: 'Turn right and continue on the campus road.', distanceMeters: 140 },
          { text: 'Road ends here.' },
          { text: 'Continue to Admin Block. Final segment is approximate (medium confidence).', distanceMeters: 70 },
        ]}
      />
    );

    expect(screen.getByText(/distance: 210m/i)).toBeInTheDocument();
    expect(screen.getByText(/road ends here\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/final segment is approximate \(medium confidence\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/walk to the nearest campus road\./i)).toBeInTheDocument();
  });
});
