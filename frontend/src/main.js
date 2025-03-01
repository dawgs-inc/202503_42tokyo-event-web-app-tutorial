import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="todo-app">
    <h1>カレンダーアプリ</h1>
    
    <div class="todo-input">
      <input type="date" id="task-date" value="${new Date().toISOString().split('T')[0]}">
      <input type="text" id="new-task" placeholder="新しいタスクを入力">
      <button id="add-task">追加</button>
    </div>
    
    <div class="calendar-view">
      <h2>予定一覧</h2>
      <ul id="tasks-list" class="tasks-list">
        <!-- タスクはここに追加されます -->
      </ul>
    </div>
  </div>
`

// タスク追加ボタンのクリックイベント
document.getElementById('add-task').addEventListener('click', addTask);

// タスク追加関数
function addTask() {
  const taskInput = document.getElementById('new-task');
  const dateInput = document.getElementById('task-date');
  const taskText = taskInput.value.trim();
  const taskDate = dateInput.value;
  
  if (taskText && taskDate) {
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
    
    // タスクテキストを作成
    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;
    taskContent.className = 'task-text';
    
    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';
    
    // チェックボックスのイベント
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        taskContent.classList.add('completed');
      } else {
        taskContent.classList.remove('completed');
      }
    });
    
    // 削除ボタンのイベント
    deleteButton.addEventListener('click', function() {
      taskItem.remove();
    });
    
    // 要素を組み立てて追加
    taskItem.appendChild(dateDisplay);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteButton);
    
    // 日付順に並べるために適切な位置に挿入
    insertTaskInOrder(tasksList, taskItem, taskDate);
    
    // 入力フィールドをクリア
    taskInput.value = '';
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
