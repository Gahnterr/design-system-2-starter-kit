/**
 * Seed data for the dummy database. Edit this file to change what the
 * prototype shows, then call resetDb() (or clear localStorage) to reload it.
 *
 * Tables are related by id, like a real backend would be:
 *   clusters.domainId -> veratoDomains.id
 *   clusters.parentId -> clusters.id (nested clusters)
 *   syncEvents.changedClusterIds / payload.clusterId -> clusters.id
 */

import { CORE_PERSON_SCHEMA } from './corePersonSchema';

const isNestedCluster = (value) => typeof value === 'object' && value !== null;

/** One cluster record per schema object, nested objects becoming child clusters. */
function buildClustersFromSchema(domainId, schema, parent = null) {
    return Object.entries(schema)
        .filter(([, value]) => isNestedCluster(value))
        .flatMap(([name, value]) => {
            const path = parent ? `${parent.path}.${name}` : name;
            const cluster = { id: `${domainId}:${path}`, domainId, parentId: parent ? parent.id : null, name, path };
            return [cluster, ...buildClustersFromSchema(domainId, value, cluster)];
        });
}

/** Placeholder flat clusters for domains that have no schema yet. */
function buildClusters(domainId, total) {
    return Array.from({ length: total }, (_, i) => ({
        id: `${domainId}:cluster-${i + 1}`,
        domainId,
        parentId: null,
        name: `Cluster ${i + 1}`,
        path: `cluster-${i + 1}`
    }));
}

const N = 'core-person:names';
const P = 'core-person:phoneNumbers';
const B = 'core-person:datesOfBirth';
const C = 'core-person:citizenships';
const A = 'core-person:addresses';
const E = 'core-person:emails';

/**
 * Link ids look like Mongo ObjectIds: 4 bytes of post time (added when read, so it always matches
 * "Last posted"), then 5 random bytes shared by a batch and a 3-byte counter. Rows from one batch
 * count down by one, like the real thing. Each suffix below is that 8-byte random + counter tail.
 */
const BATCH_1 = '7441dbee541abd';
const BATCH_2 = '9db364e752e937';
const BATCH_3 = '28cec061ee9ed7';
const BATCH_4 = 'e6ef666bb07ece';
const BATCH_5 = '51d0aa3c8f02b1';
const BATCH_6 = 'b27c9e40d1a6f3';
const BATCH_7 = '3f8a15c7e92d40';
const suffix = (batch, counter) => `${batch}${counter.toString(16).padStart(2, '0')}`;

/**
 * One row per record sent to (or skipped by) Verato MDM Cloud, newest first.
 * [record, source, status, changed clusters, payload [[cluster, count]...], posts, skipped, secondsAgo, linkSuffix]
 * "Changed clusters" and "payload" are separate on purpose: a cluster can change without being in the
 * last payload. Times are stored as seconds ago and resolved when read, so "Last 7 days" always has data.
 */
const EVENT_ROWS = [
    // Same shapes as the Figma reference table.
    ['Pat Demo8761', 'Patient Portal', 'sent', [C, B, N, P], [[C, 2], [B, 1], [N, 1], [P, 2]], 2, 1, 600, suffix(BATCH_1, 0xdd)],
    ['Pat Demo4297', 'Patient Portal', 'sent', [C, B, N, P], [[C, 2], [B, 1], [N, 1], [P, 2]], 3, 2, 645, suffix(BATCH_1, 0xdc)],
    ['Pat Demo3174', 'Patient Portal', 'sent', [C, B, N, P], [[C, 2], [B, 1], [N, 1], [P, 2]], 1, 0, 767, suffix(BATCH_1, 0xdb)],
    ['REBECCA SMITH', 'Salesforce Contacts', 'sent', [B, N, P], [[B, 1], [N, 1]], 1, 0, 941, suffix(BATCH_1, 0xd9)],
    ['Pat Demo2210', 'Patient Portal', 'skipped', [C], [[C, 2], [B, 1], [N, 1], [P, 2]], 1, 1, 90000, suffix(BATCH_5, 0x21)],
    ['REBECCA SMITH', 'Salesforce Contacts', 'sent', [B, N, P], [[B, 1], [N, 1]], 1, 0, 155066, suffix(BATCH_2, 0x6a)],
    ['Jordan Lee', 'Salesforce Contacts', 'sent', [N, E], [[N, 1], [E, 1]], 1, 0, 214000, suffix(BATCH_6, 0x3c)],
    ['003QL00001zdQ2nYAA', 'Salesforce Contacts', 'skipped', [N], [[N, 1], [B, 1]], 1, 1, 340000, suffix(BATCH_7, 0x14)],
    ['Pat Demo0914', 'Patient Portal', 'sent', [P, A], [[P, 2], [A, 1]], 2, 0, 428000, suffix(BATCH_5, 0x20)],
    ['003QL00001zdBBFYA2', 'Salesforce Contacts', 'sent', [B, N, P], [[B, 1], [N, 1]], 1, 0, 504732, suffix(BATCH_3, 0x6c)],
    ['REBECCA SMITH', 'Salesforce Contacts', 'sent', [B, N, P], [[B, 1], [N, 1]], 1, 0, 505502, suffix(BATCH_3, 0x6b)],
    ['003QL00001zd1wgYAA', 'Salesforce Contacts', 'sent', [B, N, P], [[B, 1], [N, 1]], 1, 0, 506104, suffix(BATCH_3, 0x6a)],
    ['Rebecca Smith', 'Salesforce Contacts', 'sent', [B, N, P], [[B, 1], [N, 1]], 1, 0, 506106, suffix(BATCH_3, 0x69)],
    ['Maria Gomez', 'Marketing Cloud', 'sent', [E, N], [[E, 1], [N, 1]], 1, 0, 640000, suffix(BATCH_6, 0x3b)],
    ['Pat Demo5547', 'Patient Portal', 'skipped', [C], [[C, 2], [B, 1], [N, 1], [P, 2]], 1, 1, 1107002, suffix(BATCH_4, 0x29)],
    ['Wei Chen', 'Salesforce Contacts', 'sent', [A, N], [[A, 2], [N, 1]], 2, 0, 1380000, suffix(BATCH_7, 0x13)],
    ['Amara Okafor', 'Marketing Cloud', 'sent', [E, N], [[E, 1], [N, 1]], 1, 0, 1900000, suffix(BATCH_6, 0x3a)],
    ['Pat Demo1022', 'Patient Portal', 'sent', [P, A], [[P, 1], [A, 1]], 2, 0, 2500000, suffix(BATCH_5, 0x1f)],
    ['003QL00001zdQ9aYAA', 'Salesforce Contacts', 'skipped', [B], [[B, 1], [N, 1]], 1, 1, 3300000, suffix(BATCH_7, 0x12)],
    ['Priya Nair', 'Salesforce Contacts', 'sent', [B, P, N], [[B, 1], [P, 1], [N, 1]], 1, 0, 4400000, suffix(BATCH_7, 0x11)],
    ['Tom Becker', 'Salesforce Contacts', 'sent', [N, E], [[N, 1], [E, 1]], 1, 0, 5600000, suffix(BATCH_6, 0x39)],
    ['Pat Demo7781', 'Patient Portal', 'sent', [C, B], [[C, 1], [B, 1]], 1, 0, 7000000, suffix(BATCH_5, 0x1e)],
    ['Sofia Rossi', 'Marketing Cloud', 'skipped', [E], [[E, 2]], 2, 1, 9000000, suffix(BATCH_6, 0x38)],
    ['Noah Williams', 'Salesforce Contacts', 'sent', [N, P], [[N, 1], [P, 1]], 1, 0, 12000000, suffix(BATCH_7, 0x10)],
    ['Aisha Khan', 'Salesforce Contacts', 'sent', [A, N], [[A, 1], [N, 1]], 1, 0, 15500000, suffix(BATCH_7, 0x0f)]
];

const SYNC_EVENTS = EVENT_ROWS.map(
    ([recordName, sourceName, status, changed, payload, posts, skipped, secondsAgo, linkSuffix], i) => ({
        id: `event-${i + 1}`,
        recordName,
        sourceName,
        status,
        changedClusterIds: changed,
        payload: payload.map(([clusterId, count]) => ({ clusterId, count })),
        posts,
        skipped,
        secondsAgo,
        linkSuffix
    })
);

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
        ...buildClustersFromSchema('core-person', CORE_PERSON_SCHEMA),
        ...buildClusters('patient', 12),
        ...buildClusters('member', 4)
    ],
    syncEvents: SYNC_EVENTS
};
