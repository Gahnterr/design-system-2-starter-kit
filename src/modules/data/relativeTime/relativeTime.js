const UNITS = [
    { label: 'year', seconds: 365 * 24 * 60 * 60 },
    { label: 'month', seconds: 30 * 24 * 60 * 60 },
    { label: 'week', seconds: 7 * 24 * 60 * 60 },
    { label: 'day', seconds: 24 * 60 * 60 },
    { label: 'hour', seconds: 60 * 60 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
];

/** "just now", "5 hours ago", "2 weeks ago", ... for a past date. */
export function formatRelativeTime(date, now = Date.now()) {
    const elapsed = Math.floor((now - new Date(date).getTime()) / 1000);
    if (elapsed < 5) {
        return 'just now';
    }
    const unit = UNITS.find((u) => elapsed >= u.seconds);
    const count = Math.floor(elapsed / unit.seconds);
    return `${count} ${unit.label}${count === 1 ? '' : 's'} ago`;
}
