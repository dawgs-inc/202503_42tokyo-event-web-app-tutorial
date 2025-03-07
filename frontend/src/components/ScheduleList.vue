<template>
  <div class="calendar-view">
    <h2>予定一覧</h2>
    <ul class="schedules-list">
      <ScheduleItem 
        v-for="schedule in sortedSchedules" 
        :key="schedule.id" 
        :schedule="schedule"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </ul>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import ScheduleItem from './ScheduleItem.vue';

const props = defineProps({
  schedules: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete']);

const sortedSchedules = computed(() => {
  return [...props.schedules].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
});

const handleEdit = (schedule) => {
  emit('edit', schedule);
};

const handleDelete = (id) => {
  emit('delete', id);
};
</script>
