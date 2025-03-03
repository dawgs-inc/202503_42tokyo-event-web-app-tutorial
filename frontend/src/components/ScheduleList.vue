<template>
  <div class="calendar-view">
    <h2>予定一覧</h2>
    <ul class="schedules-list">
      <ScheduleItem 
        v-for="schedule in sortedSchedules" 
        :key="schedule.id" 
        :schedule="schedule"
        @edit="$emit('edit', schedule)"
        @delete="$emit('delete', schedule.id)"
      />
    </ul>
  </div>
</template>

<script>
import ScheduleItem from './ScheduleItem.vue';

export default {
  name: 'ScheduleList',
  components: {
    ScheduleItem
  },
  props: {
    schedules: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    sortedSchedules() {
      return [...this.schedules].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    }
  }
}
</script>
