import { CONFIG } from 'src/config-global';

import { OrganizationSettingsView } from 'src/sections/organization-settings/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Organization settings - ${CONFIG.site.name}` };

export default function Page() {
  return <OrganizationSettingsView />;
}
