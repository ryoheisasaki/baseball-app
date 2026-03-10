<template>
  <section class="view-section">
    <div class="order-layout">
      <BattingOrderBoard
          :position-slots="positionSlots"
          :batting-order="battingOrder"
          :get-batting-order-player="getBattingOrderPlayer"
          :get-assigned-position-label="getAssignedPositionLabel"
          @dragstart="onDragStart"
          @dragend="$emit('dragend')"
          @drop-to-batting-order="onDropToBattingOrder"
          @drop-order-to-bench="$emit('drop-order-to-bench')"
          @reset-batting-order="$emit('reset-batting-order')"
      />

      <BaseballField
          :position-slots="positionSlots"
          :get-assigned-player="getAssignedPlayer"
          @drop-to-slot="onDropToSlot"
          @dragstart="onDragStart"
          @dragend="$emit('dragend')"
          @reset-field="$emit('reset-field')"
      />

      <PlayerList
          :players="benchPlayers"
          :position-slots="positionSlots"
          @dragstart="onDragStart"
          @dragend="$emit('dragend')"
          @drop-to-bench="$emit('drop-to-bench')"
      />
    </div>
  </section>
</template>

<script setup>
import BaseballField from '../components/BaseballField.vue'
import BattingOrderBoard from '../components/BattingOrderBoard.vue'
import PlayerList from '../components/PlayerList.vue'

defineProps({
  positionSlots: {
    type: Array,
    required: true,
  },
  benchPlayers: {
    type: Array,
    required: true,
  },
  getAssignedPlayer: {
    type: Function,
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
  'drop-to-slot',
  'dragstart',
  'dragend',
  'drop-to-bench',
  'reset-field',
  'drop-to-batting-order',
  'drop-order-to-bench',
  'reset-batting-order',
])

const onDragStart = (player, options) => {
  emit('dragstart', player, options)
}

const onDropToSlot = (slot) => {
  emit('drop-to-slot', slot)
}

const onDropToBattingOrder = (order) => {
  emit('drop-to-batting-order', order)
}
</script>

<style scoped>
.order-layout {
  display: grid;
  gap: 20px;
  grid-template-columns: 320px minmax(0, 1fr) 360px;
  align-items: start;
}

@media (max-width: 1400px) {
  .order-layout {
    grid-template-columns: 280px minmax(0, 1fr) 320px;
  }
}

@media (max-width: 1100px) {
  .order-layout {
    grid-template-columns: 1fr;
  }
}
</style>