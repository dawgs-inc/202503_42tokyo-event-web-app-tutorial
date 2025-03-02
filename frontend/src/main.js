import './style.css'

// API接続用の定数
const API_URL = import.meta.env.VITE_SERVER_URL;

// スケジュール追加関数
async function addSchedule() {
  const scheduleInput = document.getElementById('new-schedule');
  const memoInput = document.getElementById('schedule-memo');
  const dateInput = document.getElementById('schedule-date');
  const scheduleTitle = scheduleInput.value.trim();
  const scheduleMemo = memoInput.value.trim();
  const scheduleDate = dateInput.value;
  
  if (scheduleTitle && scheduleDate) {
    try {
      // APIにスケジュールを追加
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: scheduleTitle,
          memo: scheduleMemo,
          event_date: scheduleDate
        })
      });

      if (!response.ok) {
        throw new Error('スケジュールの追加に失敗しました');
      }

      // スケジュール一覧を再読み込み
      await loadSchedules();
      
      // 入力フィールドをクリア
      clearInputFields(scheduleInput, memoInput);
    } catch (error) {
      console.error('エラー:', error);
      alert('スケジュールの追加に失敗しました: ' + error.message);
    }
  }
}

// スケジュール削除関数
async function deleteSchedule(id) {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('スケジュールの削除に失敗しました');
    }

    // スケジュール一覧を再読み込み
    await loadSchedules();
  } catch (error) {
    console.error('エラー:', error);
    alert('スケジュールの削除に失敗しました: ' + error.message);
  }
}

// スケジュール一覧を読み込む関数
async function loadSchedules() {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('スケジュールの取得に失敗しました');
    }

    const events = await response.json();
    
    // スケジュールリストをクリア
    const schedulesList = document.getElementById('schedules-list');
    schedulesList.innerHTML = '';
    
    // 日付でソート
    events.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    
    // スケジュールを表示
    events.forEach(event => {
      const scheduleItem = createScheduleItem(
        event.title, 
        event.memo, 
        event.event_date,
        event.id
      );
      schedulesList.appendChild(scheduleItem);
    });
  } catch (error) {
    console.error('エラー:', error);
    alert('スケジュールの取得に失敗しました: ' + error.message);
  }
}

// 入力フィールドをクリアする関数
function clearInputFields(titleInput, memoInput) {
  titleInput.value = '';
  memoInput.value = '';
}

// スケジュール項目を作成する関数
function createScheduleItem(title, memo, date, id) {
  const scheduleItem = document.createElement('li');
  scheduleItem.className = 'schedule-item';
  scheduleItem.dataset.id = id;
  
  // 日付をフォーマット
  const formattedDate = formatDate(date);
  
  // メモ部分のHTML（メモがある場合のみ表示）
  const memoHtml = memo ? `<div class="schedule-memo">${memo}</div>` : '';
  
  // HTMLテンプレートを使用して要素を作成
  scheduleItem.innerHTML = `
    <div class="schedule-date">${formattedDate}</div>
    <div class="schedule-content">
      <div class="schedule-title">${title}</div>
      ${memoHtml}
    </div>
    <button class="delete-button">削除</button>
  `;
  
  // 削除ボタンのイベントリスナーを追加
  const deleteButton = scheduleItem.querySelector('.delete-button');
  deleteButton.addEventListener('click', function() {
    deleteSchedule(id);
  });
  
  return scheduleItem;
}

// 日付のフォーマット関数 (YYYY-MM-DD → YYYY年MM月DD日)
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}年${month}月${day}日`;
}

// アプリの初期化関数
function initializeApp() {
  // 今日の日付を初期値として設定
  const dateInput = document.getElementById('schedule-date');
  dateInput.value = new Date().toISOString().split('T')[0];
  
  // スケジュール追加ボタンのクリックイベント
  document.getElementById('add-schedule').addEventListener('click', addSchedule);
  
  // 初期データの読み込み
  loadSchedules();
}

document.addEventListener('DOMContentLoaded', function() {
  // 初期化処理
  initializeApp();
});