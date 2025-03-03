<template>
  <li class="schedule-item" :data-id="schedule.id">
    <div class="schedule-date">{{ formattedDate }}</div>
    <div class="schedule-content">
      <div class="schedule-title">{{ schedule.title }}</div>
      <div v-if="schedule.memo" class="schedule-memo">{{ schedule.memo }}</div>
    </div>
    <div class="schedule-actions">
      <button class="edit-button" @click="$emit('edit', schedule)">編集</button>
      <button class="delete-button" @click="$emit('delete', schedule.id)">削除</button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ScheduleItem',
  props: {
    schedule: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      // Ensure we're only using the date portion (YYYY-MM-DD)
      const dateStr = this.schedule.event_date.split('T')[0];
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      return `${year}年${month}月${day}日`;
    }
  }
}
</script>
