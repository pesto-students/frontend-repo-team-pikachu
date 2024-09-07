import { CONFIG } from 'src/config-global';

import { TourCreateView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Tour - ${CONFIG.site.name}` };

export default function Page() {
  return <TourCreateView />;
}
