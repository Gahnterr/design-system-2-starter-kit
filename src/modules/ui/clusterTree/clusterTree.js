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

    _domains = [];
    _clusters = [];
    searchTerm = '';

    /** Domains ({ id, name }); each becomes a collapsible header in the tree. */
    @api
    get domains() {
        return this._domains;
    }
    set domains(value) {
        this._domains = Array.isArray(value) ? value : [];
    }

    /** Flat clusters ({ id, domainId, parentId, name }); nesting comes from parentId. */
    @api
    get clusters() {
        return this._clusters;
    }
    set clusters(value) {
        this._clusters = Array.isArray(value) ? value : [];
    }

    get items() {
        return this._domains
            .map((domain) => {
                const children = this.buildClusterItems(domain, null);
                return children.length > 0
                    ? { label: domain.name, name: domain.id, expanded: this.isSearching, items: children }
                    : null;
            })
            .filter(Boolean);
    }

    get hasItems() {
        return this.items.length > 0;
    }

    get isSearching() {
        return this.searchTerm.length > 0;
    }

    /**
     * Tree items for a domain's clusters under a parent. With a search term, a
     * cluster stays when its name or its domain's name matches, or when a
     * descendant does; matches open their ancestors. Without one, all is collapsed.
     */
    buildClusterItems(domain, parentId) {
        return this._clusters
            .filter((cluster) => cluster.domainId === domain.id && cluster.parentId === parentId)
            .map((cluster) => {
                const children = this.buildClusterItems(domain, cluster.id);
                const matches =
                    !this.isSearching ||
                    fuzzyMatch(this.searchTerm, cluster.name) ||
                    fuzzyMatch(this.searchTerm, domain.name);
                if (!matches && children.length === 0) {
                    return null;
                }
                const item = { label: cluster.name, name: cluster.id, expanded: this.isSearching && children.length > 0 };
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
        const { name } = event.detail;
        if (this._domains.some((domain) => domain.id === name)) {
            // Domain headers only expand/collapse; keep the current cluster highlighted.
            this.refs.tree.selectedItem = this.selectedId || null;
            return;
        }
        this.dispatchEvent(new CustomEvent('clusterselect', { detail: { id: name } }));
    }
}
