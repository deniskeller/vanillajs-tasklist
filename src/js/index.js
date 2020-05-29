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
    console.log(newTodo);
    try {
      newTodo.forEach((todo) => {
        done(todo);
      });
      // delete task
      const btnDeleteTask = document.querySelectorAll(".delete-task");
      btnDeleteTask.forEach((item) => {
        item.addEventListener("click", (e) => {
          let target = e.target;
          let id = target.id;
          deleteTask(id);
        });
      });
      // done task
      const btnDoneTask = document.querySelectorAll(".done-task");
      btnDoneTask.forEach((item) => {
        item.addEventListener("click", (e) => {
          let target = e.target;
          let id = target.id;
          const todo = newTodo.filter((todo) => todo.id == id)[0];
          doneTask(todo);
        });
      });

      for (
        let i = 0;
        i < document.querySelectorAll(".task-list__item").length;
        i++
      ) {
        document
          .querySelectorAll(".task-list__item__edit")
          [i].addEventListener("click", () => {
            document
              .querySelectorAll(".task-list__item__menu")
              [i].classList.toggle("hide");
            document
              .querySelectorAll(".task-list__item")
              [i].classList.toggle("active");
          });
      }
    } catch (e) {}

    document.onclick = (e) => {
      for (
        let i = 0;
        i < document.querySelectorAll(".task-list__item").length;
        i++
      ) {
        if (
          !document.querySelectorAll(".task-list__item")[i].contains(e.target)
        ) {
          document
            .querySelectorAll(".task-list__item__menu")
            [i].classList.add("hide");
          document
            .querySelectorAll(".task-list__item")
            [i].classList.remove("active");
        }
      }
    };
  }
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
  let newTodos = todos.filter((item) => item.id != id);
  localStorage.setItem("todos", JSON.stringify(newTodos));
}

function updateToLocalStorage(todo) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.forEach((item) => {
    if (item.id === todo.id) {
      item.done = !item.done;
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });
}

function getContent(todo) {
  return `<div class="task-list__item" id="${todo.id}">
  <span>${todo.index + 1}) ${todo.text}</span>
  <div class="task-list__item__edit">
  
  </div>
  <div class="task-list__item__menu hide">
      <div class="task-list__item__menu-item done-task" id="${
        todo.id
      }">Выполнено</div>
      <div class="task-list__item__menu-item edit-task" id="${
        todo.id
      }">Редактировать</div>
      <div class="task-list__item__menu-item delete-task"  id="${
        todo.id
      }">Удалить</div>
    </div>  
</div>`;
}

function deleteTask(id) {
  db.collection("todos")
    .doc(id)
    .delete()
    .then(deleteFromLocalStorage(id))
    .then(renderList);
}

function doneTask(todo) {
  todo.done = !todo.done;
  db.collection("todos")
    .doc(todo.id)
    .update({
      done: todo.done,
    })
    .then(updateToLocalStorage(todo))
    .then(done(todo));
}

function done(todo) {
  if (todo.done === true) {
    document.querySelectorAll(".task-list__item").forEach((item) => {
      if (item.id == todo.id) {
        item.classList.add("task-list__item--done");
      }
    });
  } else {
    document.querySelectorAll(".task-list__item").forEach((item) => {
      if (item.id == todo.id) {
        item.classList.remove("task-list__item--done");
      }
    });
  }
}
