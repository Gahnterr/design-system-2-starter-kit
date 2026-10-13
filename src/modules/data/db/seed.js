/**
 * Seed data for the dummy database. Edit this file to change what the
 * prototype shows, then call resetDb() (or clear localStorage) to reload it.
 *
 * Tables are related by id, like a real backend would be:
 *   clusters.domainId -> veratoDomains.id
 *   clusters.parentId -> clusters.id (nested clusters)
 * Mapped-cluster counts are NOT stored on a domain; they are derived from clusters.
 */

import { CORE_PERSON_SCHEMA } from './corePersonSchema';

const isNestedCluster = (value) => typeof value === 'object' && value !== null;

/** One cluster record per schema object, nested objects becoming child clusters. */
function buildClustersFromSchema(domainId, schema, mappedNames, parent = null) {
    return Object.entries(schema)
        .filter(([, value]) => isNestedCluster(value))
        .flatMap(([name, value]) => {
            const path = parent ? `${parent.path}.${name}` : name;
            const cluster = {
                id: `${domainId}:${path}`,
                domainId,
                parentId: parent ? parent.id : null,
                name,
                path,
                mapped: mappedNames.includes(name)
            };
            return [cluster, ...buildClustersFromSchema(domainId, value, mappedNames, cluster)];
        });
}

/** Placeholder flat clusters for domains that have no schema yet. */
function buildClusters(domainId, total, mapped) {
    return Array.from({ length: total }, (_, i) => ({
        id: `${domainId}:cluster-${i + 1}`,
        domainId,
        parentId: null,
        name: `Cluster ${i + 1}`,
        path: `cluster-${i + 1}`,
        mapped: i < mapped
    }));
}

export const SEED = {
    veratoDomains: [
        {
            id: 'core-person',
            name: 'Core Person',
            schema: CORE_PERSON_SCHEMA,
            createdDate: '2012-12-12T12:24:00',
            lastModifiedDate: '2012-12-12T12:24:00',
            lastModifiedBy: 'Eduardo Garcia'
        },
        {
            id: 'patient',
            name: 'Patient',
            createdDate: '2012-12-12T12:24:00',
            lastModifiedDate: '2012-12-12T12:24:00',
            lastModifiedBy: 'Eduardo Garcia'
        },
        {
            id: 'member',
            name: 'Member',
            createdDate: '2012-12-12T12:24:00',
            lastModifiedDate: '2012-12-12T12:24:00',
            lastModifiedBy: 'Eduardo Garcia'
        }
    ],
    clusters: [
        ...buildClustersFromSchema('core-person', CORE_PERSON_SCHEMA, ['names', 'addresses', 'emails', 'phoneNumbers']),
        ...buildClusters('patient', 12, 1),
        ...buildClusters('member', 4, 4)
    ]
};
