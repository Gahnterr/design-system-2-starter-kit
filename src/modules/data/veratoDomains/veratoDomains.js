import { getAll } from 'data/db';

/** All Verato domains. `hasSchema` says whether a reference schema is loaded for the domain; the schema itself isn't returned. */
export async function getAllVeratoDomains() {
    return getAll('veratoDomains').map(({ schema, ...domain }) => ({ ...domain, hasSchema: Boolean(schema) }));
}
