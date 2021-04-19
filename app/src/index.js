/* eslint-disable no-use-before-define */
const allList = document.querySelector('.tasks__list--all');
const activeList = document.querySelector('.tasks__list--active');
const doneList = document.querySelector('.tasks__list--done');

const textarea = document.querySelector('.add-task__textarea');
const addBtn = document.querySelector('.add-task__btn');
const addTaskSection = document.querySelector('.add-task');

const tabs = document.querySelectorAll('.tabs__item');
const sections = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    removeActiveTab();
    addActiveTab(tab);
  });
});

window.onstorage = () => {
  displayTasks();
};

allList.addEventListener('click', (e) => {
  handleClick(e.target);
});

activeList.addEventListener('click', (e) => {
  handleClick(e.target);
});

doneList.addEventListener('click', (e) => {
  handleClick(e.target);
});

addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addTask();
  textarea.focus();
});

textarea.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addTask();
  }
});

displayTasks();

function displayTasks() {
  displayAllTasks();
  displayActiveTasks();
  displayDoneTasks();
}

function displayAllTasks() {
  allList.innerHTML = '';
  for (let i = 0; i < localStorage.length; i += 1) {
    const id = localStorage.key(i);
    const task = JSON.parse(localStorage.getItem(id));
    const taskItem = document.createElement('li');
    taskItem.setAttribute('id', id);
    const text = document.createElement('p');
    text.textContent = task.text;
    taskItem.appendChild(text);
    if (task.isDone) {
      taskItem.classList.add('done');
    } else {
      const importantBtn = document.createElement('button');
      if (!task.isImportant) {
        importantBtn.textContent = 'mark important';
        importantBtn.classList.add('important', 'important--primary');
        text.classList.remove('bold');
      } else {
        importantBtn.textContent = 'not important';
        importantBtn.classList.add('important', 'important--secondary');
        text.classList.add('bold');
      }
      taskItem.appendChild(importantBtn);
    }
    if (task.isImportant && task.isDone) text.classList.add('bold');
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove');
    taskItem.appendChild(removeBtn);
    allList.appendChild(taskItem);
  }
}

function displayActiveTasks() {
  activeList.innerHTML = '';
  for (let i = 0; i < localStorage.length; i += 1) {
    const id = localStorage.key(i);
    const task = JSON.parse(localStorage.getItem(id));
    if (!task.isDone) {
      const taskItem = document.createElement('li');
      taskItem.setAttribute('id', id);
      const text = document.createElement('p');
      text.textContent = task.text;
      taskItem.appendChild(text);
      const importantBtn = document.createElement('button');
      if (!task.isImportant) {
        importantBtn.textContent = 'mark important';
        importantBtn.classList.add('important', 'important--primary');
        importantBtn.classList.add('important');
        text.classList.remove('bold');
      } else {
        importantBtn.textContent = 'not important';
        importantBtn.classList.add('important', 'important--secondary');
        text.classList.add('bold');
      }
      taskItem.appendChild(importantBtn);
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove');
      taskItem.appendChild(removeBtn);
      activeList.appendChild(taskItem);
    }
  }
}

function displayDoneTasks() {
  doneList.innerHTML = '';
  for (let i = 0; i < localStorage.length; i += 1) {
    const id = localStorage.key(i);
    const task = JSON.parse(localStorage.getItem(id));
    if (task.isDone) {
      const taskItem = document.createElement('li');
      taskItem.setAttribute('id', id);
      const text = document.createElement('p');
      text.textContent = task.text;
      taskItem.classList.add('done');
      taskItem.appendChild(text);
      if (task.isImportant) text.classList.add('bold');
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove');
      taskItem.appendChild(removeBtn);
      doneList.appendChild(taskItem);
    }
  }
}

function addTask() {
  if (textarea.value === '') return;
  writeTask(Number(maxTaskId()) + 1);
}

function writeTask(id) {
  const taskValue = {
    text: textarea.value,
    isDone: false,
    isImportant: false,
  };
  localStorage.setItem(id, JSON.stringify(taskValue));
  textarea.value = '';
  displayTasks();
}

function maxTaskId() {
  let maxId = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const id = localStorage.key(i);
    if (maxId < id) {
      maxId = id;
    }
  }
  return maxId;
}

function handleClick(target) {
  if (target.tagName === 'P') {
    setDone(target.parentElement.id);
  } else if (target.classList.contains('important')) {
    setImportant(target.parentElement.id);
  } else if (target.classList.contains('remove')) {
    removeTask(target.parentElement.id);
  }
}

function setDone(id) {
  const task = JSON.parse(localStorage.getItem(id));
  task.isDone = !task.isDone;
  localStorage.setItem(id, JSON.stringify(task));
  displayTasks();
}

function setImportant(id) {
  const task = JSON.parse(localStorage.getItem(id));
  task.isImportant = !task.isImportant;
  localStorage.setItem(id, JSON.stringify(task));
  displayAllTasks();
  displayActiveTasks();
}

function removeTask(id) {
  const task = JSON.parse(localStorage.getItem(id));
  localStorage.removeItem(id, JSON.stringify(task));
  displayTasks();
}

function removeActiveTab() {
  tabs.forEach((tab) => {
    tab.classList.remove('active');
  });
  sections.forEach((section) => {
    section.classList.remove('active');
  });
}

function addActiveTab(e) {
  e.classList.add('active');
  const href = e.querySelector('a').getAttribute('href');
  const matchingSection = document.querySelector(href);
  matchingSection.classList.add('active');
  if (matchingSection.id === 'tab-done') {
    addTaskSection.classList.add('hidden');
  } else {
    addTaskSection.classList.remove('hidden');
  }
}
