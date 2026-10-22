import { fuzzyMatch } from 'data/fuzzyMatch';

/** Filter state for the History tab, plus the pure logic that applies it. */

const DAY = 24 * 3600000;

/** `months` periods are counted back in calendar months; `days` periods in whole days. */
export const PERIODS = [
    { value: '7d', label: 'Last 7 days', days: 7 },
    { value: '30d', label: 'Last 30 days', days: 30 },
    { value: '60d', label: 'Last 60 days', days: 60 },
    { value: '90d', label: 'Last 90 days', days: 90 },
    { value: '6m', label: 'Last 6 months', months: 6 },
    { value: '9m', label: 'Last 9 months', months: 9 },
    { value: '1y', label: 'Last year', months: 12 },
    { value: 'custom', label: 'Custom' }
];

export const STATUSES = [
    { value: 'sent', label: 'Sent' },
    { value: 'skipped', label: 'Skipped' }
];

export const ALL = 'all';

export const DEFAULT_FILTERS = {
    search: '',
    period: '7d',
    startDate: '',
    endDate: '',
    statuses: STATUSES.map((status) => status.value),
    source: ALL,
    cluster: ALL
};

const STORAGE_KEY = 'history-filters';

/** Filters survive switching tabs within the session, but not closing it. */
export function loadFilters() {
    try {
        return { ...DEFAULT_FILTERS, ...JSON.parse(sessionStorage.getItem(STORAGE_KEY)) };
    } catch {
        return { ...DEFAULT_FILTERS };
    }
}

export function saveFilters(filters) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
        /* storage unavailable; filters last for this tab only */
    }
}

export function isFiltered(filters) {
    return JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
}

/** "last 7 days", or "selected period" for a custom range. */
export function periodLabel(filters) {
    const period = PERIODS.find((p) => p.value === filters.period);
    return period.value === 'custom' ? 'selected period' : period.label.toLowerCase();
}

function periodStart(period, now) {
    const { days, months } = PERIODS.find((p) => p.value === period);
    if (days) return now - days * DAY;
    const start = new Date(now);
    start.setMonth(start.getMonth() - months);
    return start.getTime();
}

function isInPeriod(event, filters, now) {
    const posted = new Date(event.lastPosted).getTime();
    if (filters.period !== 'custom') return posted >= periodStart(filters.period, now);
    // Custom range is whole days, both ends included; either end may be left open.
    const start = filters.startDate ? new Date(`${filters.startDate}T00:00:00`).getTime() : -Infinity;
    const end = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999`).getTime() : Infinity;
    return posted >= start && posted <= end;
}

export function applyFilters(events, filters, now = Date.now()) {
    return events.filter(
        (event) =>
            isInPeriod(event, filters, now) &&
            filters.statuses.includes(event.status) &&
            (filters.source === ALL || event.sourceName === filters.source) &&
            (filters.cluster === ALL || event.clusterIds.includes(filters.cluster)) &&
            (!filters.search ||
                [event.recordName, event.linkId, event.changedClusters].some((field) => fuzzyMatch(filters.search, field)))
    );
}
