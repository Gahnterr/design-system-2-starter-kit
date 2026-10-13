import { LightningElement, api } from 'lwc';

const SHAPE_OPTIONS = [{ label: 'Child object (capacity all)', value: 'child' }];
const DIRECTION_OPTIONS = [{ label: 'Both', value: 'both' }];
const SALESFORCE_FIELD_OPTIONS = [{ label: '— none —', value: 'none' }];

/**
 * Placeholder for the cluster mapping form. Nothing here is wired up yet;
 * only the attribute rows come from data (the cluster's schema attributes).
 */
export default class ClusterMappingForm extends LightningElement {
    @api clusterName = '';

    _attributes = [];

    @api
    get attributes() {
        return this._attributes;
    }
    set attributes(value) {
        this._attributes = Array.isArray(value) ? value : [];
    }

    shapeOptions = SHAPE_OPTIONS;
    directionOptions = DIRECTION_OPTIONS;
    fieldOptions = SALESFORCE_FIELD_OPTIONS;

    get rows() {
        return this._attributes.map((attribute) => ({
            key: attribute.name,
            label: `${attribute.name} · ${attribute.type}`
        }));
    }
}
