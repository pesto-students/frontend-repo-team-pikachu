import { CONFIG } from 'src/config-global';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Home - ${CONFIG.site.name}` };

export default function Page() {
  return <OverviewAppView />;
}
