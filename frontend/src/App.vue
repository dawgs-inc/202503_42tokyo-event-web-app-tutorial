<template>
  <div class="schedule-app">
    <h1>カレンダーアプリ</h1>
    
    <ScheduleForm 
      :editing-schedule="editingSchedule"
      :is-editing="isEditing"
      @submit-schedule="addOrUpdateSchedule"
      @cancel-edit="exitEditMode"
      ref="scheduleFormRef"
    />
    
    <ScheduleList 
      :schedules="schedules"
      @edit="enterEditMode"
      @delete="deleteSchedule"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ScheduleForm from './components/ScheduleForm.vue';
import ScheduleList from './components/ScheduleList.vue';

const API_URL = import.meta.env.VITE_SERVER_URL;

const scheduleFormRef = ref();
const schedules = ref([]);
const editingEventId = ref(null);
const editingSchedule = ref(null);

const isEditing = computed(() => {
  return editingEventId.value !== null;
});

const addOrUpdateSchedule = async (scheduleData) => {
  const { title, memo, event_date } = scheduleData;
  
  if (title && event_date) {
    try {
      let url = `${API_URL}/events`;
      let method = 'POST';
      
      // 編集モードの場合
      if (editingEventId.value) {
        url = `${API_URL}/events/${editingEventId.value}`;
        method = 'PUT';
      }
      
      const dateObj = new Date(event_date);
      // UTCで計算されるので、日本で使うときは一日加える
      dateObj.setDate(dateObj.getDate() + 1);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      // APIにスケジュールを追加/更新
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          memo,
          event_date: formattedDate
        })
      });

      if (!response.ok) {
        throw new Error(editingEventId.value ? 'スケジュールの更新に失敗しました' : 'スケジュールの追加に失敗しました');
      }

      // 入力欄をリセット（追加・更新どちらの場合も）
      scheduleFormRef.value.resetForm();

      // 編集モードを解除
      if (editingEventId.value) {
        exitEditMode();
      }

      // スケジュール一覧を再読み込み
      await loadSchedules();
    } catch (error) {
      console.error('エラー:', error);
      alert((editingEventId.value ? 'スケジュールの更新' : 'スケジュールの追加') + 'に失敗しました: ' + error.message);
    }
  }
};

const enterEditMode = (schedule) => {
  const cleanSchedule = {
    ...schedule,
    event_date: schedule.event_date.split('T')[0]
  };
  
  editingEventId.value = schedule.id;
  editingSchedule.value = cleanSchedule;
};

const exitEditMode = () => {
  editingEventId.value = null;
  editingSchedule.value = null;
};

const deleteSchedule = async (id) => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('スケジュールの削除に失敗しました');
    }

    // 編集中のイベントが削除された場合、編集モードを解除
    if (editingEventId.value === id) {
      exitEditMode();
    }

    // スケジュール一覧を再読み込み
    await loadSchedules();
  } catch (error) {
    console.error('エラー:', error);
    alert('スケジュールの削除に失敗しました: ' + error.message);
  }
};

const loadSchedules = async () => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('スケジュールの取得に失敗しました');
    }

    const data = await response.json();
    
    schedules.value = data.map(schedule => ({
      ...schedule,
      event_date: schedule.event_date.split('T')[0]
    }));
  } catch (error) {
    console.error('エラー:', error);
    alert('スケジュールの取得に失敗しました: ' + error.message);
  }
};

onMounted(() => {
  loadSchedules();
});
</script>
