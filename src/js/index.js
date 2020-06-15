// Main js file

import { HomePageTemplate } from "./HomePageTemplate";
import { EditTaskTemplate } from "./EditTaskTemplate";
import { Loader } from "./Loader";

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

document.body.innerHTML = HomePageTemplate;
let textarea = document.querySelector("#textarea");
let addCard = document.querySelector("#add-card");
let deleteValue = document.querySelector(".task-form__delete");
let overflow = document.querySelector(".task-form__text-overflow");
let sortBtn = document.querySelector(".task-form__options");
let list = document.querySelector(".task-list");
let prevBtn = document.querySelector(".task-control__prev-btn");
let nextBtn = document.querySelector(".task-control__next-btn");

const editRegExp = /\/edit\/([0-9]*)/;
const pageRegExp = /\/page\/([0-9]*)/;
//routing check
routes();
// Event fires when URL changes
window.addEventListener("popstate", function () {
  routes();
});

// render task list or other routes

// list.beforeend(spinner)
window.addEventListener("load", () => {
  routes();
  updateTodos();
});
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
      .then(() => {
        if (pageRegExp.exec(window.location.pathname)) {
          renderList(Number(pageRegExp.exec(window.location.pathname)[1]));
        }
      })
      .then(history.pushState(null, null, "/page/1"));
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
function renderList(pageNumber) {
  document.body.innerHTML = HomePageTemplate;
  textarea = document.querySelector("#textarea");
  addCard = document.querySelector("#add-card");
  deleteValue = document.querySelector(".task-form__delete");
  overflow = document.querySelector(".task-form__text-overflow");
  sortBtn = document.querySelector(".task-form__options");
  list = document.querySelector(".task-list");
  prevBtn = document.querySelector(".task-control__prev-btn");
  nextBtn = document.querySelector(".task-control__next-btn");
  addCard.addEventListener("click", createTodo);
  nextBtn.addEventListener("click", goNextPage);
  prevBtn.addEventListener("click", goPreviousPage);
  const todos = getTodosFromLocalStorage();
  const firstTodo = pageNumber * 10 - 10;
  const lastTodo = pageNumber * 10;
  const pageTodos = todos.slice(firstTodo, lastTodo);
  const pageTodosIndexes = [...Array(todos.length).keys()].slice(
    firstTodo,
    lastTodo
  );

  displayNavigationBtn(todos);
  prevDisable(pageNumber);
  nextDisable(pageNumber);

  const newTodo = pageTodos.map((todo, index) => {
    return {
      ...todo,
      index: pageTodosIndexes[index],
    };
  });

  function sort() {
    sortToLocalStorage();
    const todos = getTodosFromLocalStorage();
    const firstTodo = pageNumber * 10 - 10;
    const lastTodo = pageNumber * 10;
    const pageTodos = todos.slice(firstTodo, lastTodo);
    const pageTodosIndexes = [...Array(todos.length).keys()].slice(
      firstTodo,
      lastTodo
    );
    const newTodo = pageTodos.map((todo, index) => {
      return {
        ...todo,
        index: pageTodosIndexes[index],
      };
    });
    displayTodos(newTodo);
  }
  sortBtn.addEventListener("click", sort);
  displayTodos(newTodo);

  if (pageNumber * 10 > getTodosFromLocalStorage().length) {
    if (newTodo[0]) {
      displayTodos(newTodo);
    } else if (
      !newTodo[0] &&
      Number(pageRegExp.exec(window.location.pathname)[1]) === 1
    ) {
      displayTodos(newTodo);
    } else {
      history.go(-1);
    }
    displayTodos(newTodo);
  }
}

function displayTodos(newTodo) {
  try {
    const noTodo = newTodo.length
      ? newTodo.map(getContent).join("")
      : `<div class="task-empty">У вас пока нет задач</div>`;
    list.innerHTML = noTodo;

    for (const edit of document.querySelectorAll(".edit-task")) {
      edit.onclick = () => {
        history.pushState(null, null, `/edit/${edit.dataset.idx}`);
        history.pushState(null, null, `/edit/${edit.dataset.idx}`);
        history.go(-1);
        history.go(2);
      };
    }

    newTodo.forEach((todo) => {
      done(todo);
      changeNameItemMenu(todo);
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

function editToLocalStorage(todo, newText) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.forEach((el) => {
    if (el.id === todo.id) {
      el.text = newText;
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
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
      }" data-idx="${todo.index + 1}">Редактировать</div>
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
    .then(() => {
      if (pageRegExp.exec(window.location.pathname)) {
        renderList(Number(pageRegExp.exec(window.location.pathname)[1]));
      }
    });
}

function doneTask(todo) {
  todo.done = !todo.done;
  db.collection("todos")
    .doc(todo.id)
    .update({
      done: todo.done,
    })
    .then(updateToLocalStorage(todo))
    .then(done(todo))
    .then(changeNameItemMenu(todo))
    .then(() => {
      if (pageRegExp.exec(window.location.pathname)) {
        renderList(Number(pageRegExp.exec(window.location.pathname)[1]));
      }
    });
}

function updateTodos() {
  toggleLoader();
  db.collection("todos")
    .get()
    .then(({ docs }) => {
      let todos = [];
      docs.forEach((el) => {
        todos.push(el.data());
      });
      localStorage.setItem("todos", JSON.stringify(todos));
    })
    .then(() => {
      if (pageRegExp.exec(window.location.pathname)) {
        renderList(Number(pageRegExp.exec(window.location.pathname)[1]));
      }
    });
}

function sortToLocalStorage() {
  const todos = getTodosFromLocalStorage();
  localStorage.setItem("todos", JSON.stringify(todos.reverse()));
}

function toggleLoader() {
  list.innerHTML = Loader;
}

function changeNameItemMenu(todo) {
  if (todo.done === true) {
    document.querySelectorAll(".done-task").forEach((item) => {
      if (item.id == todo.id) {
        item.innerHTML = "Не выполнено";
      }
    });
  } else {
    document.querySelectorAll(".done-task").forEach((item) => {
      if (item.id == todo.id) {
        item.innerHTML = "Выполнено";
      }
    });
  }
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

function goNextPage() {
  console.log(Number(pageRegExp.exec(window.location.pathname)[1]) + 1);
  history.pushState(
    null,
    null,
    `/page/${Number(pageRegExp.exec(window.location.pathname)[1]) + 1}`
  );
  history.pushState(
    null,
    null,
    `/page/${Number(pageRegExp.exec(window.location.pathname)[1]) + 1}`
  );
  history.go(-1);
  history.go(2);
}

function prevDisable(pageNumber) {
  if (pageNumber <= 1) {
    prevBtn.style.pointerEvents = "none";
  }
}

function nextDisable(pageNumber) {
  const taskLength = getTodosFromLocalStorage().length;
  if (taskLength <= pageNumber * 10) {
    nextBtn.style.pointerEvents = "none";
  }
}

function goPreviousPage() {
  const currentPageNumber = Number(
    pageRegExp.exec(window.location.pathname)[1]
  );
  console.log("currentPageNumber: ", currentPageNumber);
  history.pushState(null, null, `/page/${currentPageNumber - 1}`);
  history.pushState(null, null, `/page/${currentPageNumber - 1}`);
  history.go(-1);
  history.go(2);
}

function displayNavigationBtn(todos) {
  const navbarPagination = document.querySelector(".task-control");
  if (todos.length > 10) {
    navbarPagination.style.display = "block";
  }
}

//routing
function routes() {
  if (editRegExp.exec(window.location.pathname)) {
    if (Number(editRegExp.exec(window.location.pathname)[1]) !== 0) {
      document.body.innerHTML = EditTaskTemplate;

      const textareaEdit = document.querySelector(".task-edit__text");
      textareaEdit.value = getTodosFromLocalStorage()[
        Number(editRegExp.exec(window.location.pathname)[1]) - 1
      ].text;

      const saveBtn = document.querySelector(".btn-save");
      saveBtn.onclick = () => {
        const todo = getTodosFromLocalStorage()[
          Number(editRegExp.exec(window.location.pathname)[1]) - 1
        ];

        const newText = textareaEdit.value;

        editToLocalStorage(todo, newText);
        db.collection("todos")
          .doc(todo.id)
          .set(
            getTodosFromLocalStorage()[
              Number(editRegExp.exec(window.location.pathname)[1]) - 1
            ]
          )
          .then(() => {
            history.go(-1);
          })
          .then((renderList) => {
            if (pageRegExp.exec(window.location.pathname)) {
              renderList(Number(pageRegExp.exec(window.location.pathname)[1]));
            }
          });
      };
      const backBtn = document.querySelector(".btn-back");

      backBtn.onclick = () => {
        history.go(-1);
        if (pageRegExp.exec(window.location.pathname)) {
          renderList(Number(pageRegExp.exec(window.location.pathname)[1]));
        }
      };
    } else {
      history.pushState(null, null, "/page/1");
      renderList(1);
    }
  } else if (pageRegExp.exec(window.location.pathname)) {
    if (Number(pageRegExp.exec(window.location.pathname)[1]) !== 0) {
      const maxPageNumber =
        parseInt(getTodosFromLocalStorage().length / 10) + 1;
      const pageNumber = Number(pageRegExp.exec(window.location.pathname)[1]);
      if (pageNumber <= maxPageNumber) {
        renderList(pageNumber);
      } else {
        history.replaceState(null, null, `/page/${maxPageNumber}`);
        renderList(maxPageNumber);
      }
    } else {
      history.pushState(null, null, "/page/1");
      renderList(1);
    }
  } else {
    history.pushState(null, null, "/page/1");
    renderList(1);
  }
}
