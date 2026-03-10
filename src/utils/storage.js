import { createEmptyAssignments } from '../data/positions'

export function createDefaultPlayers() {
    return [
        {
            id: crypto.randomUUID(),
            name: '大谷',
            age: 30,
            throw_hand: 'right',
            bat_hand: 'left',
            main_position: 'pitcher',
            sub_positions: ['rf', 'lf'],
        },
        {
            id: crypto.randomUUID(),
            name: '中田翔',
            age: 35,
            throw_hand: 'right',
            bat_hand: 'right',
            main_position: 'first',
            sub_positions: ['lf'],
        },
        {
            id: crypto.randomUUID(),
            name: '西川',
            age: 33,
            throw_hand: 'right',
            bat_hand: 'left',
            main_position: 'rf',
            sub_positions: ['cf', 'lf'],
        },
        {
            id: crypto.randomUUID(),
            name: 'ダルビッシュ',
            age: 38,
            throw_hand: 'right',
            bat_hand: 'right',
            main_position: 'pitcher',
            sub_positions: [],
        },
    ]
}

export function loadPlayers() {
    const saved = localStorage.getItem('baseball-order-players')
    if (saved) {
        return JSON.parse(saved)
    }
    return createDefaultPlayers()
}

export function loadAssignments() {
    const saved = localStorage.getItem('baseball-order-assignments')
    if (saved) {
        return { ...createEmptyAssignments(), ...JSON.parse(saved) }
    }
    return createEmptyAssignments()
}

export function savePlayers(players) {
    localStorage.setItem('baseball-order-players', JSON.stringify(players))
}

export function saveAssignments(assignments) {
    localStorage.setItem('baseball-order-assignments', JSON.stringify(assignments))
}

export const BATTING_ORDER_STORAGE_KEY = 'baseball-order-batting-order'

export function loadBattingOrder() {
    const defaultOrder = {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
    }

    const saved = localStorage.getItem('baseball-order-batting-order')

    if (saved) {
        return { ...defaultOrder, ...JSON.parse(saved) }
    }

    return defaultOrder
}

export function saveBattingOrder(order) {
    localStorage.setItem(BATTING_ORDER_STORAGE_KEY, JSON.stringify(order))
}