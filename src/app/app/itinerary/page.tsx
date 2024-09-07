import { CONFIG } from 'src/config-global';

import { ItineraryListView } from 'src/sections/itinerary/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Itinerary - ${CONFIG.site.name}` };

export default function Page() {
  return <ItineraryListView />;
}
