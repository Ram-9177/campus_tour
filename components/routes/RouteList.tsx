import type { MockRouteSeed } from '@/data/mockRoutes';
import RouteCard from './RouteCard';

interface RouteListProps {
  routes: MockRouteSeed[];
}

export default function RouteList({ routes }: RouteListProps) {
  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}
