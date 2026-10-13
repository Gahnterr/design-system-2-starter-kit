import { getAll } from 'data/db';

/**
 * Verato domains, with mapped-cluster counts derived from the related
 * clusters table (clusters are separate records, not part of the domain).
 */
export async function getAllVeratoDomains() {
    const clusters = getAll('clusters');
    return getAll('veratoDomains').map(({ schema, ...domain }) => {
        const domainClusters = clusters.filter((c) => c.domainId === domain.id);
        const mappedClusterCount = domainClusters.filter((c) => c.mapped).length;
        return {
            ...domain,
            mappedClusterCount,
            mappedClusters: `${mappedClusterCount}/${domainClusters.length}`
        };
    });
}

/** One domain by id, including its reference schema; null when it doesn't exist. */
export async function getVeratoDomainById(id) {
    return getAll('veratoDomains').find((domain) => domain.id === id) ?? null;
}
