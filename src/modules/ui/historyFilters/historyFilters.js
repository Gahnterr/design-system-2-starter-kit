import { LightningElement, api } from 'lwc';
import { ALL, DEFAULT_FILTERS, PERIODS, STATUSES, isFiltered } from 'data/historyFilters';

// Search applies this long after the last keystroke; everything else applies at once.
const SEARCH_DELAY_MS = 300;

/** The History tab's filter panel. Reports the full filter object on every change; keeps no state of its own. */
export default class HistoryFilters extends LightningElement {
    @api filters = DEFAULT_FILTERS;
    /** [{ value, label }], starting with the "All Sources" default. */
    @api sourceOptions = [];
    /** [{ value, label }] then [{ label: domain, options }] groups, starting with the "All Clusters" default. */
    @api clusterOptions = [];

    periodOptions = PERIODS.map(({ value, label }) => ({ value, label }));
    statusOptions = STATUSES;
    allValue = ALL;

    get isCustomPeriod() {
        return this.filters.period === 'custom';
    }

    get isFiltered() {
        return isFiltered(this.filters);
    }

    update(patch) {
        this.dispatchEvent(new CustomEvent('filterchange', { detail: { ...this.filters, ...patch } }));
    }

    handleSearch(event) {
        const { value } = event.target;
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.update({ search: value.trim() }), SEARCH_DELAY_MS);
    }

    handlePeriod(event) {
        this.update({ period: event.detail.value });
    }

    handleDate(event) {
        this.update({ [event.target.dataset.field]: event.detail.value });
    }

    handleStatuses(event) {
        this.update({ statuses: event.detail.value });
    }

    handleSource(event) {
        this.update({ source: event.detail.value });
    }

    handleCluster(event) {
        this.update({ cluster: event.detail.value });
    }

    handleClear() {
        // The search box keeps its own text, so tell it to empty too.
        this.refs.search.value = '';
        this.dispatchEvent(new CustomEvent('filterchange', { detail: { ...DEFAULT_FILTERS } }));
    }

    disconnectedCallback() {
        clearTimeout(this.searchTimer);
    }
}
