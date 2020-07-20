/**
 *
 * Asynchronously loads the component for LeftMenu
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LeftMenu = lazyLoad(
  () => import('./index'),
  module => module.LeftMenu,
);
