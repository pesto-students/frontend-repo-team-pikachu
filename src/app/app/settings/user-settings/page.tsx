import { CONFIG } from 'src/config-global';

import { UserSettingsView } from 'src/sections/user-settings/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User settings - ${CONFIG.site.name}` };

export default function Page() {
  return <UserSettingsView />;
}
