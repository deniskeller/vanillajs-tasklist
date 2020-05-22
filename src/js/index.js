// Main js file
// import { TodoList } from "./todo";

import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "@firebase/firestore";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFHBNyfIRG3g6pA74Jk3K1tEJjKOlNKFg",
  authDomain: "vanillajs-todoapp.firebaseapp.com",
  databaseURL: "https://vanillajs-todoapp.firebaseio.com",
  projectId: "vanillajs-todoapp",
  storageBucket: "vanillajs-todoapp.appspot.com",
  messagingSenderId: "342117345775",
  appId: "1:342117345775:web:276624c34db15aad456e1a",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const textarea = document.querySelector("#textarea");
const addCard = document.querySelector("#add-card");
const deleteValue = document.querySelector(".task-form__delete");
const overflow = document.querySelector(".task-form__text-overflow");
const sortBtn = document.querySelector(".task-form__options");
const list = document.querySelector(".task-list");

// render task list
window.addEventListener("load", renderList);

//add task
function createTodo() {
  // textarea validate
  if (textarea.value == "") {
    overflow.classList.add("error");
  }

  if (textarea.value) {
    const id = Math.random().toString(36).substr(2, 9) + Date.now();
    const todo = {
      text: textarea.value.trim(),
      date: new Date().toJSON(),
      done: false,
      id,
    };
    db.collection("todos")
      .doc(id)
      .set(todo)
      .then((textarea.value = ""))
      .then(addToLocalStorage(todo))
      .then(renderList);
  }
}
// function textarea validate
textarea.addEventListener("keyup", () => {
  if (textarea.value !== "") {
    overflow.classList.remove("error");
  }
});
// clear textarea
deleteValue.addEventListener("click", () => {
  textarea.value = "";
});
addCard.addEventListener("click", createTodo);
//function render task list
function renderList() {
  const todos = getTodosFromLocalStorage();
  const newTodo = todos.map((todo, index) => {
    return {
      ...todo,
      index: index++,
    };
  });
  // sorting task
  function sort() {
    newTodo.reverse();
    displayTodos();
  }
  sortBtn.addEventListener("click", sort);
  displayTodos();

  function displayTodos() {
    const noTodo = newTodo.length
      ? newTodo.map(getContent).join("")
      : `<div class="task-empty">У вас пока нет задач</div>`;
    list.innerHTML = noTodo;
  }
  // index assignment to elements
  const taskItems = document.querySelectorAll(".task-list__item");
  taskItems.forEach((elem, index) => {
    elem.setAttribute("userid", index);
  });
}

function addToLocalStorage(todo) {
  const all = getTodosFromLocalStorage();
  all.push(todo);
  localStorage.setItem("todos", JSON.stringify(all));
}

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem("todos") || "[]");
}

function deleteFromLocalStorage(id) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  var newTodos = todos.filter((item) => item.id != id);
  localStorage.setItem("todos", JSON.stringify(newTodos));
}

function getContent(todo) {
  return `<div class="task-list__item">
  <span>${todo.index + 1}) ${todo.text}</span>
  <div class="task-list__item__edit" data-toggle-id="${todo.id}">
    
  </div>
  <div class="task-list__item__menu" id="${todo.id}" hidden>
      <div class="task-list__item__menu-item" id="done-task">Выполнено</div>
      <div class="task-list__item__menu-item" id="edit-task">Редактировать</div>
      <div class="task-list__item__menu-item" id="delete-task">Удалить</div>
    </div>  
</div>`;
}

// open menu target item
document.addEventListener("click", function (event) {
  let target = event.target;
  let id = target.dataset.toggleId;
  const btnTodoMenu = target.closest(".task-list__item__edit");
  const menu = btnTodoMenu.nextElementSibling;
  if (btnTodoMenu) {
    menu.hidden = !menu.hidden;
  }

  console.log(menu);

  // deleteTask(id);
});

// const btnDeleteTask = document.getElementById("delete-task");
// btnDeleteTask.addEventListener("click", deleteTask(retId));

// function deleteTask(id) {
//   db.collection("todos")
//     .doc(id)
//     .delete()
//     .then(deleteFromLocalStorage(id))
//     .then(renderList);
// }
