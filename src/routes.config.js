/**
 * Single source of truth for app routes.
 * Consumed by router.js (matching, titles) and app (nav maps, nav items).
 *
 * Fields:
 *   path       - URL pattern (use :param for dynamic segments). Logical, no app prefix.
 *   component  - LWC component name (must be registered in app.js ROUTE_COMPONENTS)
 *   title      - Document title (string or (params) => string)
 *   navPage    - Id for nav active state and navigate({ page }) (omit to hide from nav)
 *   navLabel   - Label shown in nav bar and in the Console object switcher
 *   navPath    - Optional; for dynamic routes, path used in nav links (e.g. /users/42)
 *   navHighlight - Optional; nav page id to highlight when this route is active (for child routes that don't create a tab)
 */

export const routes = [
  {
    path: '/',
    component: 'page-verato-domains',
    title: 'Verato Domains',
    navPage: 'veratoDomains',
    navLabel: 'Verato Domains',
  },
  {
    path: '/verato-domains/:id',
    component: 'page-cluster-mapping-config',
    title: 'Cluster Mapping',
    navHighlight: 'veratoDomains',
  },
  {
    path: '/',
    component: 'page-builder',
    title: 'Builder',
    app: 'builder',
  },
];
