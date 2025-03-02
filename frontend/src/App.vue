<template>
  <div class="schedule-app">
    <h1>カレンダーアプリ</h1>
    
    <ScheduleForm 
      :editing-schedule="editingSchedule"
      :is-editing="isEditing"
      @submit-schedule="addOrUpdateSchedule"
      @cancel-edit="exitEditMode"
      ref="scheduleForm"
    />
    
    <ScheduleList 
      :schedules="schedules"
      @edit="enterEditMode"
      @delete="deleteSchedule"
    />
  </div>
</template>

<script>
import ScheduleForm from './components/ScheduleForm.vue';
import ScheduleList from './components/ScheduleList.vue';

export default {
  components: {
    ScheduleForm,
    ScheduleList
  },
  
  data() {
    return {
      API_URL: import.meta.env.VITE_SERVER_URL,
      schedules: [],
      editingEventId: null,
      editingSchedule: null
    }
  },
  
  computed: {
    isEditing() {
      return this.editingEventId !== null;
    }
  },
  
  methods: {
    async addOrUpdateSchedule(scheduleData) {
      const { title, memo, event_date } = scheduleData;
      
      if (title && event_date) {
        try {
          let url = `${this.API_URL}/events`;
          let method = 'POST';
          
          // 編集モードの場合
          if (this.editingEventId) {
            url = `${this.API_URL}/events/${this.editingEventId}`;
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
            throw new Error(this.editingEventId ? 'スケジュールの更新に失敗しました' : 'スケジュールの追加に失敗しました');
          }

          // 入力欄をリセット（追加・更新どちらの場合も）
          this.$refs.scheduleForm.resetForm();

          // 編集モードを解除
          if (this.editingEventId) {
            this.exitEditMode();
          }

          // スケジュール一覧を再読み込み
          await this.loadSchedules();
        } catch (error) {
          console.error('エラー:', error);
          alert((this.editingEventId ? 'スケジュールの更新' : 'スケジュールの追加') + 'に失敗しました: ' + error.message);
        }
      }
    },
    
    enterEditMode(schedule) {
      // Ensure we're working with a clean date format
      const cleanSchedule = {
        ...schedule,
        event_date: schedule.event_date.split('T')[0]
      };
      
      this.editingEventId = schedule.id;
      this.editingSchedule = cleanSchedule;
    },
    
    exitEditMode() {
      this.editingEventId = null;
      this.editingSchedule = null;
    },
    
    async deleteSchedule(id) {
      try {
        const response = await fetch(`${this.API_URL}/events/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('スケジュールの削除に失敗しました');
        }

        // 編集中のイベントが削除された場合、編集モードを解除
        if (this.editingEventId === id) {
          this.exitEditMode();
        }

        // スケジュール一覧を再読み込み
        await this.loadSchedules();
      } catch (error) {
        console.error('エラー:', error);
        alert('スケジュールの削除に失敗しました: ' + error.message);
      }
    },
    
    async loadSchedules() {
      try {
        const response = await fetch(`${this.API_URL}/events`);
        if (!response.ok) {
          throw new Error('スケジュールの取得に失敗しました');
        }

        const data = await response.json();
        
        // Ensure all dates are properly formatted
        this.schedules = data.map(schedule => ({
          ...schedule,
          event_date: schedule.event_date.split('T')[0]
        }));
      } catch (error) {
        console.error('エラー:', error);
        alert('スケジュールの取得に失敗しました: ' + error.message);
      }
    }
  },
  
  mounted() {
    this.loadSchedules();
  }
}
</script>
