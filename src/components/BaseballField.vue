<template>
  <section class="card field-card">
    <div class="section-header-row">
      <h2>フィールド</h2>
      <div class="section-actions">
        <button type="button" class="ghost-button" @click="$emit('reset-field')">
          配置リセット
        </button>
      </div>
    </div>

    <div class="field-wrapper">
      <div class="field-surface">
        <div class="fence-arc"></div>
        <div class="infield-diamond"></div>
        <div class="base home"></div>
        <div class="base first"></div>
        <div class="base second"></div>
        <div class="base third"></div>
        <div class="pitcher-plate"></div>

        <PositionSlot
            v-for="slot in positionSlots"
            :key="slot.key"
            :slot="slot"
            :player="getAssignedPlayer(slot.key)"
            :position-slots="positionSlots"
            @drop="$emit('drop-to-slot', $event)"
            @dragstart="handleSlotDragStart"
            @dragend="$emit('dragend')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import PositionSlot from './PositionSlot.vue'

defineProps({
  positionSlots: {
    type: Array,
    required: true,
  },
  getAssignedPlayer: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['drop-to-slot', 'dragstart', 'dragend', 'reset-field'])

const handleSlotDragStart = (player, fromPosition) => {
  emit('dragstart', player, {
    sourceType: 'field',
    fromPosition,
  })
}
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.94);
  border-radius: 24px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
  padding: 20px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-header-row h2 {
  margin: 0;
  font-size: 22px;
}

.ghost-button {
  background: #e2e8f0;
  color: #0f172a;
  padding: 10px 14px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.field-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.field-surface {
  position: relative;
  width: min(100%, 920px);
  aspect-ratio: 7 / 5;
  overflow: hidden;
  border-radius: 20px;
  background: #24952b;
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.12);
}

.fence-arc {
  position: absolute;
  left: 11%;
  top: 18%;
  width: 78%;
  height: 52%;
  border-top-left-radius: 800px;
  border-top-right-radius: 800px;
  border: 8px solid #fff;
  border-bottom: none;
}

.infield-diamond {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 42%;
  aspect-ratio: 1;
  background: #a86116;
  transform: translate(-50%, -44%) rotate(45deg);
}

.base,
.pitcher-plate {
  position: absolute;
  background: #fff;
  z-index: 1;
}

.base {
  width: 2.2%;
  aspect-ratio: 1;
}

.home { left: 49%; bottom: 15%; }
.first { right: 27.5%; top: 58%; }
.second { left: 49%; top: 34.5%; }
.third { left: 27.5%; top: 58%; }

.pitcher-plate {
  width: 3%;
  height: 1.1%;
  left: 48.5%;
  top: 54.8%;
}
</style>