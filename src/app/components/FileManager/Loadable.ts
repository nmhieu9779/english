/**
 *
 * Asynchronously loads the component for Upload
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FileManager = lazyLoad(
  () => import('./index'),
  module => module.FileManager,
);
