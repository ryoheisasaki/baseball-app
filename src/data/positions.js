export const position_slots = [
    { key: 'lf', label: 'LF', css_class: 'slot-lf' },
    { key: 'cf', label: 'CF', css_class: 'slot-cf' },
    { key: 'rf', label: 'RF', css_class: 'slot-rf' },
    { key: 'ss', label: 'SS', css_class: 'slot-ss' },
    { key: 'second', label: '2B', css_class: 'slot-second' },
    { key: 'third', label: '3B', css_class: 'slot-third' },
    { key: 'pitcher', label: 'P', css_class: 'slot-pitcher' },
    { key: 'first', label: '1B', css_class: 'slot-first' },
    { key: 'catcher', label: 'C', css_class: 'slot-catcher' },
    { key: 'dh', label: 'DH', css_class: 'slot-dh' },
]

export function createEmptyAssignments() {
    return {
        lf: null,
        cf: null,
        rf: null,
        ss: null,
        second: null,
        third: null,
        pitcher: null,
        first: null,
        catcher: null,
        dh: null,
    }
}