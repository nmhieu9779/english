/**
 *
 * Asynchronously loads the component for Upload
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Upload = lazyLoad(
  () => import('./index'),
  module => module.Upload,
);
