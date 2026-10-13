import { LightningElement } from 'lwc';
import { getCurrentRoute, linkHref, navigate } from '../../../router';
import { getVeratoDomainById } from 'data/veratoDomains';
import { getClustersByDomainId, getClusterAttributes } from 'data/clusters';
import { formatRelativeTime } from 'data/relativeTime';

export default class ClusterMappingConfig extends LightningElement {
    domain = null;
    clusters = [];
    selectedId = '';
    selectedAttributes = [];
    isLoaded = false;

    async connectedCallback() {
        const { id } = getCurrentRoute().params;
        this.domain = await getVeratoDomainById(id);
        if (this.domain) {
            this.clusters = await getClustersByDomainId(this.domain.id);
        }
        this.isLoaded = true;
    }

    get isNotFound() {
        return this.isLoaded && !this.domain;
    }

    get breadcrumbs() {
        return [{ label: 'All Verato Domains', name: '/', href: linkHref('/') }];
    }

    get metaText() {
        const count = this.clusters.length;
        const lastSaved = formatRelativeTime(this.domain.lastModifiedDate);
        return `${count} cluster${count !== 1 ? 's' : ''} • Last saved ${lastSaved}`;
    }

    get lastSavedExact() {
        return new Date(this.domain.lastModifiedDate).toLocaleString();
    }

    get selectedCluster() {
        return this.clusters.find((cluster) => cluster.id === this.selectedId) ?? null;
    }

    handleBreadcrumbClick(event) {
        navigate(event.detail.name);
    }

    async handleClusterSelect(event) {
        const { id } = event.detail;
        this.selectedId = id;
        const cluster = this.selectedCluster;
        const attributes = await getClusterAttributes(this.domain.id, cluster.path);
        // Ignore the result if the user picked another cluster while this loaded.
        if (this.selectedId === id) {
            this.selectedAttributes = attributes;
        }
    }
}
