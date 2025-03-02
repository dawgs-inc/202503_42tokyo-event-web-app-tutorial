<template>
  <div class="schedule-app">
    <h1>カレンダーアプリ</h1>
    
    <div class="schedule-input">
      <div class="input-group">
        <label for="schedule-date">日付</label>
        <input type="date" id="schedule-date" v-model="newSchedule.event_date">
      </div>
      <div class="input-group">
        <label for="new-schedule">タイトル</label>
        <input 
          type="text" 
          id="new-schedule" 
          placeholder="スケジュールのタイトルを入力" 
          v-model="newSchedule.title"
        >
      </div>
      <div class="input-group">
        <label for="schedule-memo">メモ</label>
        <input 
          type="text" 
          id="schedule-memo" 
          placeholder="詳細メモを入力（任意）" 
          v-model="newSchedule.memo"
        >
      </div>
      <button @click="addOrUpdateSchedule">{{ isEditing ? 'スケジュールを更新' : 'スケジュールを追加' }}</button>
      <button v-if="isEditing" class="cancel-button" @click="exitEditMode">編集をキャンセル</button>
    </div>
    
    <div class="calendar-view">
      <h2>予定一覧</h2>
      <ul class="schedules-list">
        <li 
          v-for="schedule in sortedSchedules" 
          :key="schedule.id" 
          class="schedule-item"
          :data-id="schedule.id"
        >
          <div class="schedule-date">{{ formatDate(schedule.event_date) }}</div>
          <div class="schedule-content">
            <div class="schedule-title">{{ schedule.title }}</div>
            <div v-if="schedule.memo" class="schedule-memo">{{ schedule.memo }}</div>
          </div>
          <div class="schedule-actions">
            <button class="edit-button" @click="enterEditMode(schedule)">編集</button>
            <button class="delete-button" @click="deleteSchedule(schedule.id)">削除</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      API_URL: import.meta.env.VITE_SERVER_URL,
      schedules: [],
      newSchedule: {
        title: '',
        memo: '',
        event_date: new Date().toISOString().split('T')[0]
      },
      editingEventId: null
    }
  },
  
  computed: {
    isEditing() {
      return this.editingEventId !== null;
    },
    
    sortedSchedules() {
      return [...this.schedules].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    }
  },
  
  methods: {
    async addOrUpdateSchedule() {
      const { title, memo, event_date } = this.newSchedule;
      
      if (title && event_date) {
        try {
          let url = `${this.API_URL}/events`;
          let method = 'POST';
          
          // 編集モードの場合
          if (this.editingEventId) {
            url = `${this.API_URL}/events/${this.editingEventId}`;
            method = 'PUT';
          }
          
          // APIにスケジュールを追加/更新
          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              memo,
              event_date
            })
          });

          if (!response.ok) {
            throw new Error(this.editingEventId ? 'スケジュールの更新に失敗しました' : 'スケジュールの追加に失敗しました');
          }

          // 編集モードを解除
          if (this.editingEventId) {
            this.exitEditMode();
          }

          // スケジュール一覧を再読み込み
          await this.loadSchedules();
          
          // 入力フィールドをクリア
          this.clearInputFields();
        } catch (error) {
          console.error('エラー:', error);
          alert((this.editingEventId ? 'スケジュールの更新' : 'スケジュールの追加') + 'に失敗しました: ' + error.message);
        }
      }
    },
    
    enterEditMode(schedule) {
      this.editingEventId = schedule.id;
      this.newSchedule = {
        title: schedule.title,
        memo: schedule.memo || '',
        event_date: schedule.event_date
      };
    },
    
    exitEditMode() {
      this.editingEventId = null;
      this.clearInputFields();
      this.newSchedule.event_date = new Date().toISOString().split('T')[0];
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

        this.schedules = await response.json();
      } catch (error) {
        console.error('エラー:', error);
        alert('スケジュールの取得に失敗しました: ' + error.message);
      }
    },
    
    clearInputFields() {
      this.newSchedule.title = '';
      this.newSchedule.memo = '';
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      return `${year}年${month}月${day}日`;
    }
  },
  
  mounted() {
    this.loadSchedules();
  }
}
</script>

<style scoped>
/* スタイルはグローバルCSSを使用するため、ここでは定義しません */
</style>
