import { CONFIG } from 'src/config-global';

import TourEditClient from 'src/components/tour/tour-edit-client';

// ----------------------------------------------------------------------

export const metadata = { title: `Edit Tour - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <TourEditClient id={params.id} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    // You may need to adjust this part based on your requirements for static generation
    // For example, you might want to fetch a list of tour IDs from an API
    return [];
  }
  return [];
}
