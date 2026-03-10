<template>
  <section class="card bench-card">
    <div class="section-header-row">
      <h2>ベンチ選手一覧</h2>
      <span class="count-badge">{{ players.length }}人</span>
    </div>

    <div class="bench-grid" @dragover.prevent="onDragOver" @drop="onDropToBench">
      <PlayerCard
          v-for="player in players"
          :key="player.id"
          :player="player"
          :position-slots="positionSlots"
          @dragstart="onDragStart"
          @dragend="$emit('dragend')"
      />

      <div v-if="players.length === 0" class="empty-bench">
        全員配置済みです
      </div>
    </div>
  </section>
</template>

<script setup>
import PlayerCard from './PlayerCard.vue'

defineProps({
  players: {
    type: Array,
    required: true,
  },
  positionSlots: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['dragstart', 'dragend', 'drop-to-bench'])

const onDragStart = (player) => {
  emit('dragstart', player, {
    sourceType: 'bench',
  })
}

const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const onDropToBench = (event) => {
  event.preventDefault()
  emit('drop-to-bench')
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

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 700;
}

.bench-grid {
  min-height: 240px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  padding: 6px;
  border: 2px dashed #cbd5e1;
  border-radius: 18px;
  background: #f8fafc;
}

.empty-bench {
  text-align: center;
  color: #64748b;
  padding: 24px;
}
</style>