import { getAll } from 'data/db';

/** Flat list of every cluster; nesting is expressed through parentId, ownership through domainId. */
export async function getAllClusters() {
    return getAll('clusters');
}

/**
 * Attributes (name + type) of one cluster, read from the domain's reference
 * schema. Nested clusters are not attributes, so they are left out.
 */
export async function getClusterAttributes(domainId, path) {
    const domain = getAll('veratoDomains').find((d) => d.id === domainId);
    const node = path.split('.').reduce((current, key) => current?.[key], domain?.schema);
    if (!node) {
        return [];
    }
    return Object.entries(node)
        .filter(([, type]) => typeof type === 'string')
        .map(([name, type]) => ({ name, type }));
}
