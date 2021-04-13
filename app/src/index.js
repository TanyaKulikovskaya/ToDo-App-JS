/* eslint-disable no-use-before-define */
const allList = document.querySelector('.tasks__list--all');
const activeList = document.querySelector('.tasks__list--active');
const doneList = document.querySelector('.tasks__list--done');
const textarea = document.querySelector('.add-task__textarea');
const addBtn = document.querySelector('.add-task__btn');

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
  displayAllTasks();
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
});

textarea.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addTask();
  }
});

displayAllTasks();

function displayAllTasks() {
  displayTasks();
  displayActiveTasks();
  displayDoneTasks();
}

function displayTasks() {
  allList.innerHTML = '';
  for (let i = 0; i < localStorage.length; i += 1) {
    const id = localStorage.key(i);
    const task = JSON.parse(localStorage.getItem(id));
    const taskItem = document.createElement('li');
    taskItem.setAttribute('id', id);
    const text = document.createElement('p');
    text.textContent = task.text;
    if (task.isDone) {
      taskItem.classList.add('done');
    }
    taskItem.appendChild(text);
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
      if (task.isDone) {
        taskItem.classList.add('done');
      }
      taskItem.appendChild(text);
      doneList.appendChild(taskItem);
    }
  }
}

function handleClick(target) {
  if (target.tagName === 'P') {
    setDone(target.parentElement.id);
  }
}

function setDone(id) {
  const task = JSON.parse(localStorage.getItem(id));
  task.isDone = !task.isDone;
  localStorage.setItem(id, JSON.stringify(task));
  displayAllTasks();
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
  displayAllTasks();
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
}
