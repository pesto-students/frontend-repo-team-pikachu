import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Home',
    href: paths.app.root,
    icon: <Iconify icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'User settings',
    href: paths.app.settings.userSettings,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
  {
    label: 'Organization settings',
    href: paths.app.settings.organizationSettings,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
];
