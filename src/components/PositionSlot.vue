<template>
  <div
      class="position-slot"
      :class="slot.css_class"
      @dragover.prevent="onDragOver"
      @drop="onDrop"
  >
    <div class="slot-label">{{ slot.label }}</div>

    <PlayerCard
        v-if="player"
        :player="player"
        :position-slots="positionSlots"
        :is-field="true"
        :from-position="slot.key"
        :assigned-position-label="slot.label"
        @dragstart="onDragStart"
        @dragend="$emit('dragend')"
    />

    <div v-else class="empty-slot">ここへドロップ</div>
  </div>
</template>

<script setup>
import PlayerCard from './PlayerCard.vue'

const props = defineProps({
  slot: {
    type: Object,
    required: true,
  },
  player: {
    type: Object,
    default: null,
  },
  positionSlots: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['drop', 'dragstart', 'dragend'])

const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const onDrop = (event) => {
  event.preventDefault()
  emit('drop', props.slot.key)
}

const onDragStart = (player, fromPosition) => {
  emit('dragstart', player, fromPosition)
}
</script>

<style scoped>
.position-slot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 86px;
  z-index: 2;
}

.slot-label {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.75);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.empty-slot {
  padding: 10px 8px;
  min-width: 96px;
  text-align: center;
  border: 2px dashed rgba(15, 23, 42, 0.35);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.14);
  color: #0f172a;
  font-size: 13px;
}

/* 外野 */
.slot-lf {
  left: 10%;
  top: 9%;
}

.slot-cf {
  left: 50%;
  top: 4%;
  transform: translateX(-50%);
}

.slot-rf {
  right: 10%;
  top: 9%;
}

/* 内野上を少し外・上へ */
.slot-ss {
  left: 29%;
  top: 34%;
}

.slot-second {
  right: 29%;
  top: 34%;
}

/* ピッチャーを少し上へ */
.slot-pitcher {
  left: 50%;
  top: 43%;
  transform: translateX(-50%);
}

/* 内野下を少し外へ */
.slot-third {
  left: 14%;
  top: 55%;
}

.slot-first {
  right: 14%;
  top: 55%;
}

/* 捕手を少し下へ */
.slot-catcher {
  left: 50%;
  bottom: 9%;
  transform: translateX(-50%);
}

/* DH */
.slot-dh {
  right: 6%;
  bottom: 8%;
}

@media (max-width: 720px) {
  .position-slot {
    min-width: 76px;
    gap: 4px;
  }

  .slot-label {
    font-size: 11px;
    padding: 3px 8px;
  }

  .empty-slot {
    min-width: 82px;
    padding: 8px 6px;
    font-size: 12px;
  }
}
</style>