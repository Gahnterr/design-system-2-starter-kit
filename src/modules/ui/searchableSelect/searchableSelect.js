import { LightningElement, api } from 'lwc';
import { fuzzyMatch } from 'data/fuzzyMatch';

/**
 * Single-select with a search box, for option lists too long for lightning-combobox
 * (which can't be searched). Options are flat ({ value, label }) or grouped
 * ({ label, options }). Always has a value; the clear button resets it to `defaultValue`.
 */
export default class SearchableSelect extends LightningElement {
    @api label = '';
    @api value = '';
    @api defaultValue = '';

    _options = [];
    isOpen = false;
    searchTerm = '';

    @api
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = Array.isArray(value) ? value : [];
    }

    get allOptions() {
        return this._options.flatMap((entry) => entry.options ?? [entry]);
    }

    get selectedLabel() {
        return this.allOptions.find((option) => option.value === this.value)?.label ?? '';
    }

    get canClear() {
        return this.value !== this.defaultValue;
    }

    /** Options matching the search, kept in their groups; empty groups are dropped. */
    get groups() {
        const matches = (option) => !this.searchTerm || fuzzyMatch(this.searchTerm, option.label);
        const toView = (option) => ({
            ...option,
            isSelected: option.value === this.value,
            className: `slds-media slds-listbox__option slds-listbox__option_plain${option.value === this.value ? ' slds-is-selected' : ''}`
        });
        return this._options
            .map((entry, index) => ({
                key: `${index}`,
                label: entry.options ? entry.label : '',
                options: (entry.options ?? [entry]).filter(matches).map(toView)
            }))
            .filter((group) => group.options.length > 0);
    }

    get hasNoResults() {
        return this.groups.length === 0;
    }

    handleToggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.searchTerm = '';
        // Clicks anywhere else close the list; clicks inside this component don't.
        this.closeOnOutsideClick = (event) => {
            if (!event.composedPath().includes(this.template.host)) this.close();
        };
        window.addEventListener('click', this.closeOnOutsideClick);
    }

    close() {
        this.isOpen = false;
        window.removeEventListener('click', this.closeOnOutsideClick);
    }

    renderedCallback() {
        if (this.isOpen && !this.focusedSearch) {
            this.focusedSearch = true;
            this.refs.search?.focus();
        }
        if (!this.isOpen) this.focusedSearch = false;
    }

    disconnectedCallback() {
        window.removeEventListener('click', this.closeOnOutsideClick);
    }

    handleSearch(event) {
        this.searchTerm = event.target.value.trim();
    }

    handleSelect(event) {
        this.select(event.currentTarget.dataset.value);
        this.close();
    }

    handleClear() {
        this.select(this.defaultValue);
    }

    select(value) {
        this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
    }
}
