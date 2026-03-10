<template>
  <section class="card batting-card">
    <div class="section-header-row">
      <h2>打順</h2>
      <button type="button" class="ghost-button" @click="$emit('reset-batting-order')">
        打順リセット
      </button>
    </div>

    <div class="batting-list" @dragover.prevent="onDragOver">

      <div
          v-for="order in 10"
          :key="order"
          class="batting-slot"
          @dragover.prevent="onDragOver"
          @drop="onDrop(order, $event)"
      >

        <div class="batting-number">
          {{ order }}番
        </div>

        <PlayerCard
            v-if="getBattingOrderPlayer(order)"
            :player="getBattingOrderPlayer(order)"
            :position-slots="positionSlots"
            :is-field="false"
            :assigned-position-label="getAssignedPositionLabel(getBattingOrderPlayer(order).id)"
            @dragstart="(player) => onDragStart(player, order)"
            @dragend="$emit('dragend')"
        />

        <div v-else class="empty-order-slot">
          ここへドロップ
        </div>

      </div>

      <div
          class="order-remove-area"
          @dragover.prevent="onDragOver"
          @drop="onDropToBenchArea"
      >
        打順から外す
      </div>

    </div>
  </section>
</template>

<script setup>
import PlayerCard from './PlayerCard.vue'

defineProps({
  positionSlots: {
    type: Array,
    required: true,
  },
  battingOrder: {
    type: Object,
    required: true,
  },
  getBattingOrderPlayer: {
    type: Function,
    required: true,
  },
  getAssignedPositionLabel: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'dragstart',
  'dragend',
  'drop-to-batting-order',
  'drop-order-to-bench',
  'reset-batting-order',
])

const onDragStart = (player, fromBattingOrder) => {
  emit('dragstart', player, {
    sourceType: 'order',
    fromBattingOrder,
  })
}

const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const onDrop = (order, event) => {
  event.preventDefault()
  emit('drop-to-batting-order', order)
}

const onDropToBenchArea = (event) => {
  event.preventDefault()
  emit('drop-order-to-bench')
}
</script>

<style scoped>

.card {
  background: rgba(255, 255, 255, 0.94);
  border-radius: 24px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
  padding: 16px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-header-row h2 {
  margin: 0;
  font-size: 20px;
}

.ghost-button {
  background: #e2e8f0;
  color: #0f172a;
  padding: 8px 12px;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.batting-list {
  display: grid;
  gap: 8px;
}

.batting-slot {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 8px;
  align-items: stretch;
}

.batting-number {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 700;
  min-height: 64px;
  font-size: 14px;
}

.empty-order-slot {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(15, 23, 42, 0.3);
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
}

.order-remove-area {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #fca5a5;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  font-weight: 700;
  font-size: 14px;
}

</style>