import { getAll } from 'data/db';

// Events are stored as "seconds ago"; resolving them against one moment per page session keeps
// their dates and link ids steady while the page is open.
const SESSION_START = Date.now();

const DATE = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
const TIME = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** "Oct 14, 2026 at 09:57:25 AM" */
const formatPosted = (date) => `${DATE.format(date)} at ${TIME.format(date)}`;

/** Link ids start with the post time (seconds since epoch, as 4 bytes of hex), like a Mongo ObjectId. */
const linkIdFor = (date, suffix) => `${Math.floor(date.getTime() / 1000).toString(16).padStart(8, '0')}${suffix}`;

/** `name:count` pairs, alphabetical. */
const toList = (names) => [...names].sort().join(', ');

/**
 * Records Salesforce sent to (or skipped for) Verato MDM Cloud, newest first.
 * Each event is shaped for display; `clusterIds` (the changed clusters) is kept for filtering.
 */
export async function getSyncEvents() {
    const clusterNames = new Map(getAll('clusters').map((cluster) => [cluster.id, cluster.name]));
    return getAll('syncEvents')
        .map((event) => {
            const postedAt = new Date(SESSION_START - event.secondsAgo * 1000);
            return {
                id: event.id,
                recordName: event.recordName,
                sourceName: event.sourceName,
                status: event.status,
                clusterIds: event.changedClusterIds,
                changedClusters: toList(event.changedClusterIds.map((id) => clusterNames.get(id))),
                lastPayload: toList(event.payload.map(({ clusterId, count }) => `${clusterNames.get(clusterId)}:${count}`)),
                postsSkipped: `${event.posts} / ${event.skipped}`,
                lastPosted: postedAt.toISOString(),
                lastPostedText: formatPosted(postedAt),
                linkId: linkIdFor(postedAt, event.linkSuffix)
            };
        })
        .sort((a, b) => b.lastPosted.localeCompare(a.lastPosted));
}
