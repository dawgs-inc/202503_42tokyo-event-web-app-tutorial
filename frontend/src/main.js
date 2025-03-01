import './style.css'

// タスク追加関数
function addTask() {
  const taskInput = document.getElementById('new-task');
  const memoInput = document.getElementById('task-memo');
  const dateInput = document.getElementById('task-date');
  const taskTitle = taskInput.value.trim();
  const taskMemo = memoInput.value.trim();
  const taskDate = dateInput.value;
  
  if (taskTitle && taskDate) {
    // タスクリストの取得
    const tasksList = document.getElementById('tasks-list');
    
    // 新しいタスク項目を作成
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    
    // 日付表示を作成
    const dateDisplay = document.createElement('div');
    dateDisplay.className = 'task-date';
    
    // 日付をフォーマット (YYYY-MM-DD → YYYY年MM月DD日)
    const formattedDate = formatDate(taskDate);
    dateDisplay.textContent = formattedDate;
    
    // チェックボックスを作成
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    
    // タスクコンテンツコンテナを作成
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    // タスクタイトルを作成
    const taskTitleElement = document.createElement('div');
    taskTitleElement.textContent = taskTitle;
    taskTitleElement.className = 'task-title';
    
    // タスクメモを作成（メモがある場合のみ）
    const taskMemoElement = document.createElement('div');
    taskMemoElement.className = 'task-memo';
    taskMemoElement.textContent = taskMemo || ''; // メモが空の場合は空文字列を設定
    
    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';
    
    // チェックボックスのイベント
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        taskTitleElement.classList.add('completed');
        taskMemoElement.classList.add('completed');
      } else {
        taskTitleElement.classList.remove('completed');
        taskMemoElement.classList.remove('completed');
      }
    });
    
    // 削除ボタンのイベント
    deleteButton.addEventListener('click', function() {
      taskItem.remove();
    });
    
    // タスクコンテンツを組み立て
    taskContent.appendChild(taskTitleElement);
    if (taskMemo) {
      taskContent.appendChild(taskMemoElement);
    }
    
    // 要素を組み立てて追加
    taskItem.appendChild(dateDisplay);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteButton);
    
    // 日付順に並べるために適切な位置に挿入
    insertTaskInOrder(tasksList, taskItem, taskDate);
    
    // 入力フィールドをクリア
    taskInput.value = '';
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

// 日付順にタスクを挿入する関数
function insertTaskInOrder(tasksList, newTaskItem, newTaskDate) {
  const items = tasksList.children;
  let inserted = false;
  
  // 日付を比較して適切な位置に挿入
  for (let i = 0; i < items.length; i++) {
    const itemDateElement = items[i].querySelector('.task-date');
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
        const newDate = new Date(newTaskDate);
        
        if (newDate < itemDate) {
          tasksList.insertBefore(newTaskItem, items[i]);
          inserted = true;
          break;
        }
      }
    }
  }
  
  // リストの最後に追加
  if (!inserted) {
    tasksList.appendChild(newTaskItem);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('task-date');
  dateInput.value = new Date().toISOString().split('T')[0];
  
  // タスク追加ボタンのクリックイベント
  document.getElementById('add-task').addEventListener('click', addTask);
});