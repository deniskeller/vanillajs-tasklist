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
const todoItem = document.querySelector(".task-list__item__edit");
// рендер списка задач
window.addEventListener("load", renderList);

//функция добавить задачу
function createTodo() {
  // валидация поля ввода
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
// валидация поля ввода
textarea.addEventListener("keyup", () => {
  if (textarea.value !== "") {
    overflow.classList.remove("error");
  }
});
// очистка поля ввода
deleteValue.addEventListener("click", () => {
  textarea.value = "";
});

addCard.addEventListener("click", createTodo);

//функция вывода задачи
function renderList() {
  const todos = getTodosFromLocalStorage();
  const newTodo = todos.map((todo, index) => {
    return {
      ...todo,
      index: index++,
    };
  });
  // console.log(newTodo);

  // сортировка задач
  let listType = false;
  function foo() {
    listType = !listType;
    let newType = listType;
    return newType;
  }

  sortBtn.onclick = function () {
    foo();
  };
  listType = foo();

  // отрисовка списка
  let noTodo;
  if (listType === true && newTodo.length) {
    noTodo = newTodo.map(getContent).reverse().join("");
  } else if (newTodo.length) {
    noTodo = newTodo.map(getContent).join("");
  } else {
    noTodo = `<div class="task-empty">У вас пока нет задач</div>`;
  }
  const list = document.querySelector(".task-list");
  list.innerHTML = noTodo;

  // присвоение индекса элементам
  const taskItem = document.querySelectorAll(".task-list__item");
  taskItem.forEach((elem, index) => {
    elem.setAttribute("userid", index);
  });
}

function revomeTodo(id) {
  db.collection("todos").doc(id).delete();
}

function addToLocalStorage(todo) {
  const all = getTodosFromLocalStorage();
  all.push(todo);

  localStorage.setItem("todos", JSON.stringify(all));
}

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem("todos") || "[]");
}

function getContent(todo) {
  return `<div class="task-list__item" :class="{'active': is_active}">
  <span :class="{'task-list__item--done': done}">${todo.index + 1}) ${
    todo.text
  }</span>

  <div class="task-list__item__edit">
    <svg
      class="edit"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  </div>  
</div>`;
}

{
  /* <div class="task-list__item__menu" id="menu">
        <div class="task-list__item__menu-item" >Выполнено</div>
        <div class="task-list__item__menu-item" >Редактировать</div>
        <div class="task-list__item__menu-item" id="delete" >Удалить</div>
      </div>  */
}

// function deleteItem(id) {
//   list.addEventListener("click", (e) => {
//     // e.stopPropagation();

//     db.collection("todos")
//       .doc(id)
//       .delete()
//       .then(function () {
//         todos.filter((todo) => {
//           if (todo.id !== id) {
//             return todo;
//           }
//         });
//       })
//       .then(function () {
//         const userID = e.target.getAttribute("userid");
//         console.log(userID);
//         if (userID == id) {
//           console.log("lol");
//           // todoItem.remove();
//         }
//       });
//   });
// }
// document.addEventListener("click", (e) => console.log(e.target.id));
