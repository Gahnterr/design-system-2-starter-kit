import { SEED } from './seed';

/**
 * Tiny localStorage-backed "database" for the prototype.
 * Screens should not import this directly; go through a repository module
 * (e.g. 'data/veratoDomains') so swapping in a real API later touches one file.
 */

// Bump when the shape of SEED changes so stale browser copies are discarded.
const DB_VERSION = 5;
const STORAGE_KEY = `verato-mock-db-v${DB_VERSION}`;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function load() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        /* storage unavailable or corrupt; fall back to seed */
    }
    return clone(SEED);
}

function persist(db) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
        /* storage unavailable; changes last for this session only */
    }
}

let db = load();

export function getAll(table) {
    return clone(db[table] ?? []);
}

/** Insert a record, or replace the one with the same id. */
export function upsert(table, record) {
    const rows = db[table] ?? [];
    const index = rows.findIndex((row) => row.id === record.id);
    db[table] = index === -1 ? [...rows, clone(record)] : rows.map((row, i) => (i === index ? clone(record) : row));
    persist(db);
}

/** Throw away local changes and reload the seed data. */
export function resetDb() {
    db = clone(SEED);
    persist(db);
}
