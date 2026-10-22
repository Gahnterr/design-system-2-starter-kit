import LightningDatatable from 'lightning/datatable';
import statusBadge from './statusBadge.html';

/** lightning-datatable plus a `statusBadge` column type (a themed lightning-badge). */
export default class HistoryTable extends LightningDatatable {
    static customTypes = {
        statusBadge: {
            template: statusBadge,
            standardCellLayout: true,
            // Exposed to the template as {typeAttributes.theme}: the badge's theme class.
            typeAttributes: ['theme']
        }
    };
}
