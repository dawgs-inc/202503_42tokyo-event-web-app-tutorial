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
    const scheduleItem = document.createElement('li');
    scheduleItem.className = 'schedule-item';
    
    // 日付表示を作成
    const dateDisplay = document.createElement('div');
    dateDisplay.className = 'schedule-date';
    
    // 日付をフォーマット (YYYY-MM-DD → YYYY年MM月DD日)
    const formattedDate = formatDate(scheduleDate);
    dateDisplay.textContent = formattedDate;
    
    // スケジュールコンテンツコンテナを作成
    const scheduleContent = document.createElement('div');
    scheduleContent.className = 'schedule-content';
    
    // スケジュールタイトルを作成
    const scheduleTitleElement = document.createElement('div');
    scheduleTitleElement.textContent = scheduleTitle;
    scheduleTitleElement.className = 'schedule-title';
    
    // スケジュールメモを作成（メモがある場合のみ）
    const scheduleMemoElement = document.createElement('div');
    scheduleMemoElement.className = 'schedule-memo';
    scheduleMemoElement.textContent = scheduleMemo || ''; // メモが空の場合は空文字列を設定
    
    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';
    
    // 削除ボタンのイベント
    deleteButton.addEventListener('click', function() {
      scheduleItem.remove();
    });
    
    // スケジュールコンテンツを組み立て
    scheduleContent.appendChild(scheduleTitleElement);
    if (scheduleMemo) {
      scheduleContent.appendChild(scheduleMemoElement);
    }
    
    // 要素を組み立てて追加
    scheduleItem.appendChild(dateDisplay);
    scheduleItem.appendChild(scheduleContent);
    scheduleItem.appendChild(deleteButton);
    
    // 日付順に並べるために適切な位置に挿入
    insertScheduleInOrder(schedulesList, scheduleItem, scheduleDate);
    
    // 入力フィールドをクリア
    scheduleInput.value = '';
    memoInput.value = '';
  }
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

document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('schedule-date');
  dateInput.value = new Date().toISOString().split('T')[0];
  
  // スケジュール追加ボタンのクリックイベント
  document.getElementById('add-schedule').addEventListener('click', addSchedule);
});