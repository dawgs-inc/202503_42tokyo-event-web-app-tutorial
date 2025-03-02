import './style.css'

// API接続用の定数
const API_URL = import.meta.env.VITE_SERVER_URL;

// 編集中のイベントのID
let editingEventId = null;

// スケジュール追加/更新関数
async function addOrUpdateSchedule() {
  const scheduleInput = document.getElementById('new-schedule');
  const memoInput = document.getElementById('schedule-memo');
  const dateInput = document.getElementById('schedule-date');
  const scheduleTitle = scheduleInput.value.trim();
  const scheduleMemo = memoInput.value.trim();
  const scheduleDate = dateInput.value;
  
  if (scheduleTitle && scheduleDate) {
    try {
      let url = `${API_URL}/events`;
      let method = 'POST';
      
      // 編集モードの場合
      if (editingEventId) {
        url = `${API_URL}/events/${editingEventId}`;
        method = 'PUT';
      }
      
      // APIにスケジュールを追加/更新
      const response = await fetch(url, {
        method: method,
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
        throw new Error(editingEventId ? 'スケジュールの更新に失敗しました' : 'スケジュールの追加に失敗しました');
      }

      // 編集モードを解除
      if (editingEventId) {
        exitEditMode();
      }

      // スケジュール一覧を再読み込み
      await loadSchedules();
      
      // 入力フィールドをクリア
      clearInputFields(scheduleInput, memoInput);
    } catch (error) {
      console.error('エラー:', error);
      alert((editingEventId ? 'スケジュールの更新' : 'スケジュールの追加') + 'に失敗しました: ' + error.message);
    }
  }
}

// 編集モードに入る関数
function enterEditMode(event) {
  const scheduleItem = event.target.closest('.schedule-item');
  if (!scheduleItem) return;
  
  const id = scheduleItem.dataset.id;
  const title = scheduleItem.querySelector('.schedule-title').textContent;
  const memo = scheduleItem.querySelector('.schedule-memo')?.textContent || '';
  const dateText = scheduleItem.querySelector('.schedule-date').textContent;
  
  // 日本語形式の日付からYYYY-MM-DD形式に変換
  const yearMatch = dateText.match(/(\d+)年/);
  const monthMatch = dateText.match(/(\d+)月/);
  const dayMatch = dateText.match(/(\d+)日/);
  
  if (yearMatch && monthMatch && dayMatch) {
    const year = parseInt(yearMatch[1]);
    const month = parseInt(monthMatch[1]).toString().padStart(2, '0');
    const day = parseInt(dayMatch[1]).toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // フォームに値をセット
    document.getElementById('new-schedule').value = title;
    document.getElementById('schedule-memo').value = memo;
    document.getElementById('schedule-date').value = formattedDate;
    
    // 編集モードに切り替え
    editingEventId = id;
    const addButton = document.getElementById('add-schedule');
    addButton.textContent = 'スケジュールを更新';
    
    // キャンセルボタンを表示
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel-edit';
    cancelButton.textContent = '編集をキャンセル';
    cancelButton.className = 'cancel-button';
    cancelButton.addEventListener('click', exitEditMode);
    
    const scheduleInput = document.querySelector('.schedule-input');
    if (!document.getElementById('cancel-edit')) {
      scheduleInput.appendChild(cancelButton);
    }
    
    // フォームにフォーカス
    document.getElementById('new-schedule').focus();
  }
}

// 編集モードを終了する関数
function exitEditMode() {
  // 編集モードをリセット
  editingEventId = null;
  
  // ボタンテキストを戻す
  const addButton = document.getElementById('add-schedule');
  addButton.textContent = 'スケジュールを追加';
  
  // キャンセルボタンを削除
  const cancelButton = document.getElementById('cancel-edit');
  if (cancelButton) {
    cancelButton.remove();
  }
  
  // フォームをクリア
  clearInputFields(
    document.getElementById('new-schedule'), 
    document.getElementById('schedule-memo')
  );
  
  // 今日の日付に戻す
  document.getElementById('schedule-date').value = new Date().toISOString().split('T')[0];
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

    // 編集中のイベントが削除された場合、編集モードを解除
    if (editingEventId === id) {
      exitEditMode();
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
    <div class="schedule-actions">
      <button class="edit-button">編集</button>
      <button class="delete-button">削除</button>
    </div>
  `;
  
  // 編集ボタンのイベントリスナーを追加
  const editButton = scheduleItem.querySelector('.edit-button');
  editButton.addEventListener('click', enterEditMode);
  
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
  
  // スケジュール追加/更新ボタンのクリックイベント
  document.getElementById('add-schedule').addEventListener('click', addOrUpdateSchedule);
  
  // 初期データの読み込み
  loadSchedules();
}

document.addEventListener('DOMContentLoaded', function() {
  // 初期化処理
  initializeApp();
});