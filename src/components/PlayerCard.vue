<template>
  <div
      class="player-card"
      :class="[positionType, { 'is-field': isField, 'is-bench': !isField }]"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
  >

    <!-- フィールド表示 -->
    <template v-if="isField">

      <div class="field-header">
        <strong>{{ player.name }}</strong>

        <span
            v-if="assignedPositionLabel"
            class="position-badge"
        >
          {{ assignedPositionLabel }}
        </span>

      </div>

      <div class="field-body">
        {{ throwBatLabel }}
      </div>

    </template>


    <!-- ベンチ / 打順 -->
    <template v-else>

      <div class="player-card-header">

        <strong>{{ player.name }}</strong>

        <span
            v-if="assignedPositionLabel"
            class="main-badge"
        >
          {{ assignedPositionLabel }}
        </span>

        <span
            v-else
            class="main-badge"
        >
          {{ mainPositionLabel }}
        </span>

      </div>

      <div class="player-card-body">

        <div>{{ throwBatLabel }}</div>
        <div>{{ player.age }}歳</div>
        <div>メイン: {{ mainPositionLabel }}</div>
        <div>サブ: {{ subPositionLabels }}</div>

      </div>

    </template>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  player: Object,
  positionSlots: Array,
  isField: Boolean,
  fromPosition: String,
  assignedPositionLabel: String,
})

const emit = defineEmits(['dragstart','dragend'])

const getPositionLabel = (key) => {
  return props.positionSlots.find(s => s.key === key)?.label ?? '-'
}

const throwBatLabel = computed(() => {

  const throw_label =
      props.player.throw_hand === 'left'
          ? '左投'
          : '右投'

  const bat_label =
      props.player.bat_hand === 'left'
          ? '左打'
          : props.player.bat_hand === 'switch'
              ? '両打'
              : '右打'

  return `${throw_label}${bat_label}`
})

const mainPositionLabel = computed(() => {
  return getPositionLabel(props.player.main_position)
})

const subPositionLabels = computed(() => {

  if(!props.player.sub_positions?.length){
    return 'なし'
  }

  return props.player.sub_positions
      .map(getPositionLabel)
      .join(', ')
})

const positionType = computed(() => {

  if(!props.isField || !props.fromPosition){
    return ''
  }

  if(props.player.main_position === props.fromPosition){
    return 'main'
  }

  if(props.player.sub_positions?.includes(props.fromPosition)){
    return 'sub'
  }

  return 'out'
})

const onDragStart = (event) => {

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.player.id)

  emit('dragstart', props.player, props.fromPosition)
}

const onDragEnd = () => {
  emit('dragend')
}
</script>

<style scoped>

.player-card{
  border-radius:12px;
  border:2px solid #1f2937;
  cursor:grab;
  user-select:none;
}

/* フィールド表示 */
.player-card.is-field{
  min-width:78px;
  padding:6px 8px;
  text-align:center;
}

.field-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:13px;
}

.field-body{
  font-size:12px;
  margin-top:2px;
}

/* 守備位置バッジ */

.position-badge{
  background:#1f2937;
  color:white;
  font-size:11px;
  padding:2px 6px;
  border-radius:999px;
}


/* ベンチカード */

.player-card.is-bench{
  padding:10px 12px;
  background:#d9f0cd;
  box-shadow:0 6px 16px rgba(15,23,42,.16);
}

.player-card-header{
  display:flex;
  justify-content:space-between;
}

.player-card-body{
  margin-top:6px;
  display:grid;
  gap:2px;
  font-size:13px;
  color:#475569;
}


/* 適正カラー */

.player-card.main{
  background:#bbf7d0;
  border:3px solid #16a34a;
}

.player-card.sub{
  background:#fde68a;
  border:3px solid #eab308;
}

.player-card.out{
  background:#fecaca;
  border:3px solid #dc2626;
}


/* バッジ */

.main-badge{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:36px;
  height:22px;
  padding:0 6px;
  border-radius:999px;
  background:#dcfce7;
  color:#166534;
  font-size:11px;
  font-weight:700;
}

</style>