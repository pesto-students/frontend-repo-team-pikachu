import { _tours } from 'src/_mock/_tour';
import { CONFIG } from 'src/config-global';

import TourDetailsClient from 'src/components/tour/tour-details-client';

// ----------------------------------------------------------------------

export const metadata = { title: `Tour Detail - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <TourDetailsClient id={params.id} />;
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
    return _tours.map((tour) => ({ id: tour.id }));
  }
  return [];
}
