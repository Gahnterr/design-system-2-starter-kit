import { LightningElement } from 'lwc';
import { getAllClusters, getClusterAttributes } from 'data/clusters';
import { getAllVeratoDomains } from 'data/veratoDomains';

// Placeholder until the support article exists.
const LEARN_MORE_URL = 'https://www.google.com';

/** "Cluster Mapping" tab: pick a cluster in the tree, see its mapping config beside it. */
export default class ClusterMappingTab extends LightningElement {
    learnMoreUrl = LEARN_MORE_URL;
    domains = [];
    clusters = [];
    lastRefreshed = Date.now();

    selectedId = '';
    selectedAttributes = [];

    connectedCallback() {
        this.refresh();
    }

    async refresh() {
        [this.domains, this.clusters] = await Promise.all([getAllVeratoDomains(), getAllClusters()]);
        this.lastRefreshed = Date.now();
    }

    get selectedCluster() {
        return this.clusters.find((cluster) => cluster.id === this.selectedId) ?? null;
    }

    async handleClusterSelect(event) {
        const { id } = event.detail;
        this.selectedId = id;
        const { domainId, path } = this.selectedCluster;
        const attributes = await getClusterAttributes(domainId, path);
        // Ignore the result if the user picked another cluster while this loaded.
        if (this.selectedId === id) {
            this.selectedAttributes = attributes;
        }
    }
}
