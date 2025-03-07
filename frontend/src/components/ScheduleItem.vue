<template>
  <li class="schedule-item" :data-id="schedule.id">
    <div class="schedule-date">{{ formattedDate }}</div>
    <div class="schedule-content">
      <div class="schedule-title">{{ schedule.title }}</div>
      <div v-if="schedule.memo" class="schedule-memo">{{ schedule.memo }}</div>
    </div>
    <div class="schedule-actions">
      <button class="edit-button" @click="emitEdit">編集</button>
      <button class="delete-button" @click="emitDelete">削除</button>
    </div>
  </li>
</template>

<script setup>
import { computed, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  schedule: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const formattedDate = computed(() => {
  const dateStr = props.schedule.event_date.split('T')[0];
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}年${month}月${day}日`;
});

const emitEdit = () => {
  emit('edit', props.schedule);
};

const emitDelete = () => {
  emit('delete', props.schedule.id);
};

onMounted(() => {
  console.log(props.schedule);
});
</script>
