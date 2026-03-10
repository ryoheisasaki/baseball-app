<template>
  <section class="card form-card">
    <div class="section-header-row">
      <h2>{{ editingPlayerId ? '選手編集' : '選手登録' }}</h2>
    </div>

  <form class="player-form" @submit.prevent="$emit('save')">
    <label>
      <span>名前</span>
      <input v-model.trim="form.name" type="text" placeholder="例: 大谷 翔平" required>
    </label>

    <div class="form-row two-columns">
      <label>
        <span>年齢</span>
        <input v-model.number="form.age" type="number" min="0" max="99" required>
      </label>

      <label>
        <span>投げ</span>
        <select v-model="form.throw_hand" required>
          <option value="right">右</option>
          <option value="left">左</option>
        </select>
      </label>
    </div>

    <div class="form-row two-columns">
      <label>
        <span>打ち</span>
        <select v-model="form.bat_hand" required>
          <option value="right">右</option>
          <option value="left">左</option>
          <option value="switch">両</option>
        </select>
      </label>

      <label>
        <span>メイン守備位置</span>
        <select v-model="form.main_position" required>
          <option v-for="slot in positionSlots" :key="slot.key" :value="slot.key">
            {{ slot.label }}
          </option>
        </select>
      </label>
    </div>

    <fieldset class="sub-position-fieldset">
      <legend>サブ守備位置</legend>
      <div class="checkbox-grid">
        <label v-for="slot in positionSlots" :key="slot.key" class="checkbox-item">
          <input
              v-model="form.sub_positions"
              type="checkbox"
              :value="slot.key"
          >
          <span>{{ slot.label }}</span>
        </label>
      </div>
    </fieldset>

    <div class="form-actions">
      <button type="submit" class="primary-button">
        {{ editingPlayerId ? '更新する' : '登録する' }}
      </button>
      <button type="button" class="ghost-button" @click="$emit('reset')">
        クリア
      </button>
    </div>
  </form>
  </section>
</template>

<script setup>
defineProps({
  form: {
    type: Object,
    required: true,
  },
  editingPlayerId: {
    type: String,
    default: null,
  },
  positionSlots: {
    type: Array,
    required: true,
  },
})

defineEmits(['save', 'reset'])
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

.player-form {
  display: grid;
  gap: 14px;
}

.player-form label,
.sub-position-fieldset {
  display: grid;
  gap: 8px;
}

.player-form span,
.sub-position-fieldset legend {
  font-weight: 700;
  color: #1e293b;
}

.player-form input,
.player-form select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.sub-position-fieldset {
  margin: 0;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.checkbox-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-button {
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
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

@media (max-width: 720px) {
  .two-columns,
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>