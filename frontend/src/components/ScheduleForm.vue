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

<script>
export default {
  name: 'ScheduleForm',
  props: {
    editingSchedule: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scheduleData: {
        title: '',
        memo: '',
        event_date: new Date().toISOString().split('T')[0]
      }
    }
  },
  watch: {
    editingSchedule(newVal) {
      if (newVal) {
        // Ensure we're only using the date portion (YYYY-MM-DD)
        const dateOnly = newVal.event_date ? newVal.event_date.split('T')[0] : new Date().toISOString().split('T')[0];
        
        this.scheduleData = {
          title: newVal.title,
          memo: newVal.memo || '',
          event_date: dateOnly
        };
      }
    }
  },
  methods: {
    submitForm() {
      if (this.scheduleData.title && this.scheduleData.event_date) {
        // Ensure we're only using the date portion (YYYY-MM-DD)
        const formData = {
          ...this.scheduleData,
          event_date: this.scheduleData.event_date.split('T')[0]
        };
        
        this.$emit('submit-schedule', formData);
      }
    },
    cancelEdit() {
      this.$emit('cancel-edit');
      this.resetForm();
    },
    resetForm() {
      // 入力欄をリセット
      this.scheduleData = {
        title: '',
        memo: '',
        event_date: new Date().toISOString().split('T')[0]
      };
    }
  }
}
</script>
