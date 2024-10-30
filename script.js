let timer;
let seconds = parseInt(localStorage.getItem('seconds')) || 0;
let diamonds = parseInt(localStorage.getItem('diamonds')) || 0;
let taskName = localStorage.getItem('taskName') || '';
let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
let isRunning = false;
let startTime;

const timeDisplay = document.getElementById("timeDisplay");
const diamondDisplay = document.getElementById("diamondDisplay");
const playPauseButton = document.getElementById("playPauseButton");
const stopButton = document.getElementById("stopButton");
const taskNameInput = document.getElementById("taskNameInput");
const historyBody = document.getElementById("historyBody");

// 显示历史任务记录
function displayHistory() {
  historyBody.innerHTML = '';
  taskHistory.forEach((task, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.start}</td>
      <td>${task.end}</td>
      <td>${task.diamonds}</td>
      <td><button onclick="deleteTask(${index})">Delete</button></td>
    `;
    historyBody.appendChild(row);
  });
}

// 删除任务
function deleteTask(index) {
  taskHistory.splice(index, 1);
  localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
  displayHistory();
}

// 时间格式化为 hh:mm:ss
function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// 更新显示和 localStorage
function updateDisplay() {
  timeDisplay.textContent = formatTime(seconds);
  diamondDisplay.textContent = `Diamonds: 💎${diamonds}`;
  taskNameInput.value = taskName;

  localStorage.setItem('seconds', seconds);
  localStorage.setItem('diamonds', diamonds);
  localStorage.setItem('taskName', taskName);
  localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
}

// Play/Pause 按钮点击事件
playPauseButton.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timer);
    playPauseButton.textContent = "▶️";
  } else {
    startTime = new Date().toLocaleTimeString();
    timer = setInterval(() => {
      seconds++;
      diamonds++;
      updateDisplay();
    }, 1000);
    playPauseButton.textContent = "⏸️";
  }
  isRunning = !isRunning;
});

// Stop 按钮点击事件
stopButton.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timer);
    const endTime = new Date().toLocaleTimeString();
    taskHistory.push({
      name: taskName || 'Unnamed Task',
      start: startTime,
      end: endTime,
      diamonds: diamonds
    });
    displayHistory();
  }
  seconds = 0;
  isRunning = false;
  playPauseButton.textContent = "▶️";
  updateDisplay();
});

// 任务名字输入事件
taskNameInput.addEventListener("input", () => {
  taskName = taskNameInput.value;
  localStorage.setItem('taskName', taskName);
});

// 导出数据
function exportData() {
  const dataStr = JSON.stringify(taskHistory, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "task_history.json";
  a.click();
  URL.revokeObjectURL(url);
}

// 导入数据
function importData() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const importedData = JSON.parse(event.target.result);
        taskHistory = importedData;
        localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
        displayHistory();
      } catch (e) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }
}

// 初始化显示和历史记录
updateDisplay();
displayHistory();
