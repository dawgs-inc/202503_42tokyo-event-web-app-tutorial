<template>
  <div class="schedule-input">
    <div class="input-group">
      <label for="schedule-date">日付</label>
      <input type="date" id="schedule-date" v-model="scheduleData.event_date">
    </div>
    <div class="input-group">
      <label for="new-schedule">タイトル</label>
      <input 
        type="text" 
        id="new-schedule" 
        placeholder="スケジュールのタイトルを入力" 
        v-model="scheduleData.title"
      >
    </div>
    <div class="input-group">
      <label for="schedule-memo">メモ</label>
      <input 
        type="text" 
        id="schedule-memo" 
        placeholder="詳細メモを入力（任意）" 
        v-model="scheduleData.memo"
      >
    </div>
    <button @click="submitForm">{{ isEditing ? 'スケジュールを更新' : 'スケジュールを追加' }}</button>
    <button v-if="isEditing" class="cancel-button" @click="cancelEdit">編集をキャンセル</button>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  editingSchedule: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-schedule', 'cancel-edit']);

const scheduleData = ref({
  title: '',
  memo: '',
  event_date: new Date().toISOString().split('T')[0]
});

watch(() => props.editingSchedule, (newVal) => {
  if (newVal) {
    const dateOnly = newVal.event_date ? newVal.event_date.split('T')[0] : new Date().toISOString().split('T')[0];
    
    scheduleData.value = {
      title: newVal.title,
      memo: newVal.memo || '',
      event_date: dateOnly
    };
  }
}, { immediate: true });

const submitForm = () => {
  if (scheduleData.value.title && scheduleData.value.event_date) {
    const formData = {
      ...scheduleData.value,
      event_date: scheduleData.value.event_date.split('T')[0]
    };
    
    emit('submit-schedule', formData);
  }
};

const resetForm = () => {
  scheduleData.value = {
    title: '',
    memo: '',
    event_date: new Date().toISOString().split('T')[0]
  };
};

const cancelEdit = () => {
  emit('cancel-edit');
  resetForm();
};

defineExpose({
  resetForm
})
</script>
