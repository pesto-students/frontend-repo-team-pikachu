import { CONFIG } from 'src/config-global';

import { SignUpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up - ${CONFIG.site.name}` };

export default function Page() {
  return <SignUpView />;
}
