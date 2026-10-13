import { getAll } from 'data/db';

/** Flat list of a domain's clusters; nesting is expressed through parentId. */
export async function getClustersByDomainId(domainId) {
    return getAll('clusters').filter((cluster) => cluster.domainId === domainId);
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
