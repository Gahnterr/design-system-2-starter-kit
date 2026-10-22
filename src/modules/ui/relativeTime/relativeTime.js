import { LightningElement, api } from 'lwc';
import { formatRelativeTime } from 'data/relativeTime';

// How often the "x ago" text re-evaluates.
const CLOCK_TICK_MS = 30000;

/** "Last refreshed 10 mins ago": keeps itself current, with the exact date and time on hover. */
export default class RelativeTime extends LightningElement {
    @api prefix = '';
    @api iconName = '';
    /** A date, ISO string or timestamp in ms. */
    @api timestamp;

    now = Date.now();

    connectedCallback() {
        this.clock = setInterval(() => {
            this.now = Date.now();
        }, CLOCK_TICK_MS);
    }

    disconnectedCallback() {
        clearInterval(this.clock);
    }

    get text() {
        return `${this.prefix} ${formatRelativeTime(this.timestamp, this.now)}`.trim();
    }

    get exactTime() {
        return new Date(this.timestamp).toLocaleString();
    }
}
