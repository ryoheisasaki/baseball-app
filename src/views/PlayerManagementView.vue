<template>
  <section class="view-section">
    <div class="manage-layout">
      <PlayerForm
          :form="playerForm"
          :editing-player-id="editingPlayerId"
          :position-slots="positionSlots"
          @save="$emit('save-player')"
          @reset="$emit('reset-form')"
      />
  <section class="card list-card">
    <div class="section-header-row">
      <h2>登録済み選手</h2>
      <span class="count-badge">{{ players.length }}人</span>
    </div>

    <div class="table-wrap">
      <table class="players-table">
        <thead>
        <tr>
          <th>名前</th>
          <th>年齢</th>
          <th>投打</th>
          <th>メイン</th>
          <th>サブ</th>
          <th>状態</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="player in players" :key="player.id">
          <td>{{ player.name }}</td>
          <td>{{ player.age }}</td>
          <td>{{ formatThrowBat(player) }}</td>
          <td>{{ getPositionLabel(player.main_position) }}</td>
          <td>{{ formatSubPositions(player.sub_positions) }}</td>
          <td>
                  <span :class="['status-badge', isAssigned(player.id) ? 'assigned' : 'bench']">
                    {{ isAssigned(player.id) ? '配置中' : 'ベンチ' }}
                  </span>
          </td>
          <td>
            <div class="row-actions">
              <button type="button" class="mini-button" @click="$emit('edit-player', player)">編集</button>
              <button type="button" class="mini-button danger" @click="$emit('delete-player', player.id)">削除</button>
            </div>
          </td>
        </tr>
        <tr v-if="players.length === 0">
          <td colspan="7" class="empty-row">まだ選手が登録されていません</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
  </div>
  </section>
</template>

<script setup>
import PlayerForm from '../components/PlayerForm.vue'

const props = defineProps({
  playerForm: {
    type: Object,
    required: true,
  },
  editingPlayerId: {
    type: String,
    default: null,
  },
  players: {
    type: Array,
    required: true,
  },
  positionSlots: {
    type: Array,
    required: true,
  },
  isAssigned: {
    type: Function,
    required: true,
  },
})

defineEmits(['save-player', 'reset-form', 'edit-player', 'delete-player'])

const getPositionLabel = (position_key) => {
  return props.positionSlots.find((slot) => slot.key === position_key)?.label ?? '-'
}

const formatSubPositions = (sub_positions) => {
  if (!sub_positions || sub_positions.length === 0) {
    return 'なし'
  }
  return sub_positions.map((position_key) => getPositionLabel(position_key)).join(', ')
}

const formatThrowBat = (player) => {
  const throw_label = player.throw_hand === 'left' ? '左投' : '右投'
  const bat_label = player.bat_hand === 'left' ? '左打' : player.bat_hand === 'switch' ? '両打' : '右打'
  return `${throw_label}${bat_label}`
}
</script>

<style scoped>
.manage-layout {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
}

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

.table-wrap {
  overflow: auto;
}

.players-table {
  width: 100%;
  border-collapse: collapse;
}

.players-table th,
.players-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: top;
}

.players-table th {
  background: #f8fafc;
  color: #334155;
  font-size: 14px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge.assigned {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.bench {
  background: #ecfccb;
  color: #3f6212;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mini-button {
  padding: 8px 12px;
  border-radius: 10px;
  background: #e2e8f0;
  color: #0f172a;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.mini-button.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.empty-row {
  text-align: center;
  color: #64748b;
  padding: 24px;
}

@media (max-width: 1100px) {
  .manage-layout {
    grid-template-columns: 1fr;
  }
}
</style>