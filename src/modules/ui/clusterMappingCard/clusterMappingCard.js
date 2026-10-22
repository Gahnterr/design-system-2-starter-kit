import { LightningElement, api } from 'lwc';

/** Right-hand card: the selected cluster's mapping config, or an empty message. */
export default class ClusterMappingCard extends LightningElement {
    /** Selected cluster ({ name }), or null when nothing is selected. */
    @api cluster = null;
    /** The cluster's schema attributes ({ name, type }). */
    @api attributes = [];

    get hasCluster() {
        return !!this.cluster;
    }

    get title() {
        const name = this.cluster?.name ?? '';
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}
