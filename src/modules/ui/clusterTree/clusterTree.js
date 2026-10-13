import { LightningElement, api } from 'lwc';

/** Subsequence match: "adr" finds "addresses". Case-insensitive. */
function fuzzyMatch(query, text) {
    const haystack = text.toLowerCase();
    let position = 0;
    for (const char of query.toLowerCase()) {
        position = haystack.indexOf(char, position);
        if (position === -1) {
            return false;
        }
        position += 1;
    }
    return true;
}

export default class ClusterTree extends LightningElement {
    @api selectedId = '';

    _clusters = [];
    searchTerm = '';

    /** Flat clusters ({ id, parentId, name }); nesting comes from parentId. */
    @api
    get clusters() {
        return this._clusters;
    }
    set clusters(value) {
        this._clusters = Array.isArray(value) ? value : [];
    }

    get items() {
        return this.buildItems(null);
    }

    get hasItems() {
        return this.items.length > 0;
    }

    /**
     * Tree items under a parent. With a search term, a cluster stays when it or
     * any descendant matches, and ancestors of matches open so results are visible.
     * Without one, everything is collapsed.
     */
    buildItems(parentId) {
        const searching = this.searchTerm.length > 0;
        return this._clusters
            .filter((cluster) => cluster.parentId === parentId)
            .map((cluster) => {
                const children = this.buildItems(cluster.id);
                const matches = !searching || fuzzyMatch(this.searchTerm, cluster.name);
                if (!matches && children.length === 0) {
                    return null;
                }
                const item = { label: cluster.name, name: cluster.id, expanded: searching && children.length > 0 };
                if (children.length > 0) {
                    item.items = children;
                }
                return item;
            })
            .filter(Boolean);
    }

    handleSearch(event) {
        this.searchTerm = event.target.value.trim();
    }

    handleSelect(event) {
        this.dispatchEvent(new CustomEvent('clusterselect', { detail: { id: event.detail.name } }));
    }
}
