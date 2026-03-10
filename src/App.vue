<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <h1>野球オーダー管理</h1>
        <p class="sub-title">
          選手登録とフィールド配置
        </p>
      </div>

      <nav class="nav-tabs">
        <button
            class="tab-button"
            :class="{ active: currentView === 'order' }"
            @click="currentView = 'order'"
        >
          オーダー作成
        </button>

        <button
            class="tab-button"
            :class="{ active: currentView === 'players' }"
            @click="currentView = 'players'"
        >
          選手管理
        </button>
      </nav>
    </header>

    <main class="app-main">
      <OrderBoardView
          v-if="currentView === 'order'"
          :position-slots="position_slots"
          :bench-players="benchPlayers"
          :get-assigned-player="getAssignedPlayer"
          :get-batting-order-player="getBattingOrderPlayer"
          :batting-order="battingOrder"
          :get-assigned-position-label="getAssignedPositionLabel"
          @drop-to-slot="handleDropToSlot"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
          @drop-to-bench="handleDropToBench"
          @reset-field="resetField"
          @drop-to-batting-order="handleDropToBattingOrder"
          @drop-order-to-bench="handleDropOrderToBench"
          @reset-batting-order="resetBattingOrder"
      />

      <PlayerManagementView
          v-else
          :player-form="playerForm"
          :editing-player-id="editingPlayerId"
          :players="players"
          :position-slots="position_slots"
          :is-assigned="isAssigned"
          @save-player="savePlayer"
          @reset-form="resetForm"
          @edit-player="editPlayer"
          @delete-player="deletePlayer"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

import { position_slots } from './data/positions'

import OrderBoardView from './views/OrderBoardView.vue'
import PlayerManagementView from './views/PlayerManagementView.vue'

import {
  loadPlayers,
  loadAssignments,
  savePlayers,
  saveAssignments,
  loadBattingOrder,
  saveBattingOrder
} from './utils/storage'

const currentView = ref('order')

const players = ref(loadPlayers())
const assignments = reactive(loadAssignments())

const battingOrder = reactive(loadBattingOrder())

const editingPlayerId = ref(null)

const draggingPlayerId = ref(null)
const draggingFromPosition = ref(null)
const draggingFromBattingOrder = ref(null)
const draggingSourceType = ref(null)

const playerForm = reactive({
  name: '',
  age: 18,
  throw_hand: 'right',
  bat_hand: 'right',
  main_position: 'pitcher',
  sub_positions: [],
})

const benchPlayers = computed(() => {
  const assignedIds = new Set(Object.values(assignments).filter(Boolean))
  return players.value.filter((p) => !assignedIds.has(p.id))
})

const getAssignedPlayer = (position) => {
  const id = assignments[position]
  return players.value.find((p) => p.id === id) ?? null
}

const getBattingOrderPlayer = (order) => {
  const id = battingOrder[order]
  return players.value.find((p) => p.id === id) ?? null
}

const isAssigned = (playerId) => {
  return Object.values(assignments).includes(playerId)
}

const resetForm = () => {
  editingPlayerId.value = null
  playerForm.name = ''
  playerForm.age = 18
  playerForm.throw_hand = 'right'
  playerForm.bat_hand = 'right'
  playerForm.main_position = 'pitcher'
  playerForm.sub_positions = []
}

const savePlayer = () => {
  const payload = {
    name: playerForm.name,
    age: Number(playerForm.age),
    throw_hand: playerForm.throw_hand,
    bat_hand: playerForm.bat_hand,
    main_position: playerForm.main_position,
    sub_positions: playerForm.sub_positions.filter(
        (p) => p !== playerForm.main_position,
    ),
  }

  if (editingPlayerId.value) {
    players.value = players.value.map((p) => {
      if (p.id !== editingPlayerId.value) {
        return p
      }
      return { ...p, ...payload }
    })
  } else {
    players.value.push({
      id: crypto.randomUUID(),
      ...payload,
    })
  }

  resetForm()
}

const editPlayer = (player) => {
  editingPlayerId.value = player.id
  playerForm.name = player.name
  playerForm.age = player.age
  playerForm.throw_hand = player.throw_hand
  playerForm.bat_hand = player.bat_hand
  playerForm.main_position = player.main_position
  playerForm.sub_positions = [...player.sub_positions]
}

const deletePlayer = (id) => {
  players.value = players.value.filter((p) => p.id !== id)

  Object.keys(assignments).forEach((pos) => {
    if (assignments[pos] === id) {
      assignments[pos] = null
    }
  })

  Object.keys(battingOrder).forEach((order) => {
    if (battingOrder[order] === id) {
      battingOrder[order] = null
    }
  })
}

const handleDragStart = (
    player,
    options = {},
) => {
  draggingPlayerId.value = player.id
  draggingFromPosition.value = options.fromPosition ?? null
  draggingFromBattingOrder.value = options.fromBattingOrder ?? null
  draggingSourceType.value = options.sourceType ?? null
}

const handleDragEnd = () => {
  draggingPlayerId.value = null
  draggingFromPosition.value = null
  draggingFromBattingOrder.value = null
  draggingSourceType.value = null
}

const handleDropToSlot = (target) => {
  if (!draggingPlayerId.value) {
    return
  }

  const source = draggingFromPosition.value
  const dragged = draggingPlayerId.value
  const targetPlayer = assignments[target]

  if (draggingSourceType.value === 'field' && source) {
    assignments[source] = targetPlayer ?? null
    assignments[target] = dragged
  } else {
    Object.keys(assignments).forEach((pos) => {
      if (assignments[pos] === dragged) {
        assignments[pos] = null
      }
    })

    assignments[target] = dragged
  }

  handleDragEnd()
}

const handleDropToBench = () => {
  if (draggingSourceType.value !== 'field' || !draggingFromPosition.value) {
    handleDragEnd()
    return
  }

  assignments[draggingFromPosition.value] = null
  handleDragEnd()
}

const resetField = () => {
  Object.keys(assignments).forEach((p) => {
    assignments[p] = null
  })
}

const clearExistingBattingOrder = (playerId) => {
  Object.keys(battingOrder).forEach((order) => {
    if (battingOrder[order] === playerId) {
      battingOrder[order] = null
    }
  })
}

const handleDropToBattingOrder = (targetOrder) => {
  if (!draggingPlayerId.value) {
    return
  }

  const dragged = draggingPlayerId.value
  const sourceOrder = draggingFromBattingOrder.value
  const targetPlayer = battingOrder[targetOrder]

  if (draggingSourceType.value === 'order' && sourceOrder) {
    if (String(sourceOrder) === String(targetOrder)) {
      handleDragEnd()
      return
    }

    battingOrder[sourceOrder] = targetPlayer ?? null
    battingOrder[targetOrder] = dragged
    handleDragEnd()
    return
  }

  clearExistingBattingOrder(dragged)
  battingOrder[targetOrder] = dragged
  handleDragEnd()
}

const handleDropOrderToBench = () => {
  if (draggingSourceType.value !== 'order' || !draggingFromBattingOrder.value) {
    handleDragEnd()
    return
  }

  battingOrder[draggingFromBattingOrder.value] = null
  handleDragEnd()
}

const resetBattingOrder = () => {
  Object.keys(battingOrder).forEach((order) => {
    battingOrder[order] = null
  })
}

const getAssignedPositionLabel = (playerId) => {
  const foundKey = Object.keys(assignments).find((key) => assignments[key] === playerId)

  if (!foundKey) {
    return '未配置'
  }

  return position_slots.find((slot) => slot.key === foundKey)?.label ?? '未配置'
}

watch(players, (p) => savePlayers(p), { deep: true })
watch(assignments, (a) => saveAssignments(a), { deep: true })
watch(battingOrder, o => saveBattingOrder(o), {deep:true})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 24px;
}

.app-header {
  max-width: 1400px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.app-header h1 {
  margin: 0;
  font-size: 32px;
}

.sub-title {
  margin: 6px 0 0;
  color: #475569;
}

.nav-tabs {
  display: flex;
  gap: 10px;
}

.tab-button {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
  background: #cbd5e1;
  color: #0f172a;
  font-weight: 700;
}

.tab-button.active {
  background: #2563eb;
  color: #fff;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 720px) {
  .app-shell {
    padding: 14px;
  }
}
</style>