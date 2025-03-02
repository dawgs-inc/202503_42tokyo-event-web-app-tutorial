import './style.css'

// スケジュール追加関数
function addSchedule() {
  const scheduleInput = document.getElementById('new-schedule');
  const memoInput = document.getElementById('schedule-memo');
  const dateInput = document.getElementById('schedule-date');
  const scheduleTitle = scheduleInput.value.trim();
  const scheduleMemo = memoInput.value.trim();
  const scheduleDate = dateInput.value;
  
  if (scheduleTitle && scheduleDate) {
    // スケジュールリストの取得
    const schedulesList = document.getElementById('schedules-list');
    
    // 新しいスケジュール項目を作成
    const scheduleItem = createScheduleItem(scheduleTitle, scheduleMemo, scheduleDate);
    
    // 日付順に並べるために適切な位置に挿入
    insertScheduleInOrder(schedulesList, scheduleItem, scheduleDate);
    
    // 入力フィールドをクリア
    clearInputFields(scheduleInput, memoInput);
  }
}

// 入力フィールドをクリアする関数
function clearInputFields(titleInput, memoInput) {
  titleInput.value = '';
  memoInput.value = '';
}

// スケジュール項目を作成する関数
function createScheduleItem(title, memo, date) {
  const scheduleItem = document.createElement('li');
  scheduleItem.className = 'schedule-item';
  
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
    scheduleItem.remove();
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

// 日付順にスケジュールを挿入する関数
function insertScheduleInOrder(schedulesList, newScheduleItem, newScheduleDate) {
  const items = schedulesList.children;
  let inserted = false;
  
  // 日付を比較して適切な位置に挿入
  for (let i = 0; i < items.length; i++) {
    const itemDateElement = items[i].querySelector('.schedule-date');
    if (itemDateElement) {
      const itemDateText = itemDateElement.textContent;
      // 日本語形式の日付から年月日を抽出
      const yearMatch = itemDateText.match(/(\d+)年/);
      const monthMatch = itemDateText.match(/(\d+)月/);
      const dayMatch = itemDateText.match(/(\d+)日/);
      
      if (yearMatch && monthMatch && dayMatch) {
        const year = parseInt(yearMatch[1]);
        const month = parseInt(monthMatch[1]) - 1; // JavaScriptの月は0始まり
        const day = parseInt(dayMatch[1]);
        
        const itemDate = new Date(year, month, day);
        const newDate = new Date(newScheduleDate);
        
        if (newDate < itemDate) {
          schedulesList.insertBefore(newScheduleItem, items[i]);
          inserted = true;
          break;
        }
      }
    }
  }
  
  // リストの最後に追加
  if (!inserted) {
    schedulesList.appendChild(newScheduleItem);
  }
}

// アプリの初期化関数
function initializeApp() {
  // 今日の日付を初期値として設定
  const dateInput = document.getElementById('schedule-date');
  dateInput.value = new Date().toISOString().split('T')[0];
  
  // スケジュール追加ボタンのクリックイベント
  document.getElementById('add-schedule').addEventListener('click', addSchedule);
}

document.addEventListener('DOMContentLoaded', function() {
  // 初期化処理
  initializeApp();
});