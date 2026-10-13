import { LightningElement } from 'lwc';
import { navigate } from '../../../router';
import { getAllVeratoDomains } from 'data/veratoDomains';

const DATE_TIME = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' };

const COLUMNS = [
    {
        label: 'Verato Domain',
        fieldName: 'name',
        type: 'button',
        sortable: true,
        typeAttributes: {
            label: { fieldName: 'name' },
            variant: 'base',
            name: 'view'
        }
    },
    { label: 'Mapped Clusters', fieldName: 'mappedClusters', sortable: true },
    { label: 'Last Modified by', fieldName: 'lastModifiedBy', sortable: true },
    { label: 'Date Last Modified', fieldName: 'lastModifiedDate', type: 'date', typeAttributes: DATE_TIME, sortable: true },
    { label: 'Date Created', fieldName: 'createdDate', type: 'date', typeAttributes: DATE_TIME, sortable: true }
];

/** Columns whose displayed text doesn't sort correctly (e.g. "4/22"); sort by this field instead. */
const SORT_FIELDS = { mappedClusters: 'mappedClusterCount' };

export default class VeratoDomains extends LightningElement {
    columns = COLUMNS;
    data = [];
    sortedBy;
    sortedDirection = 'asc';
    searchTerm = '';

    async connectedCallback() {
        this.data = await getAllVeratoDomains();
    }

    get filteredData() {
        if (!this.searchTerm) {
            return this.data;
        }
        const term = this.searchTerm.toLowerCase();
        return this.data.filter(
            (domain) =>
                domain.name.toLowerCase().includes(term) || domain.lastModifiedBy.toLowerCase().includes(term)
        );
    }

    get metaText() {
        const count = this.filteredData.length;
        return `${count} item${count !== 1 ? 's' : ''} • Updated a few seconds ago`;
    }

    handleSearch(event) {
        this.searchTerm = event.detail.value;
    }

    handleRowAction(event) {
        if (event.detail.action.name === 'view') {
            navigate(`/verato-domains/${event.detail.row.id}`);
        }
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        const sortKey = SORT_FIELDS[fieldName] ?? fieldName;
        const direction = sortDirection === 'asc' ? 1 : -1;

        this.data = [...this.data].sort((a, b) => {
            const aVal = typeof a[sortKey] === 'string' ? a[sortKey].toLowerCase() : a[sortKey];
            const bVal = typeof b[sortKey] === 'string' ? b[sortKey].toLowerCase() : b[sortKey];
            if (aVal < bVal) return -direction;
            if (aVal > bVal) return direction;
            return 0;
        });
        this.sortedBy = fieldName;
        this.sortedDirection = sortDirection;
    }
}
