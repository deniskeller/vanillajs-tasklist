import {
  Page
} from "../core/Page";
import {
  $
} from "../core/dome";
export class TodolistPage extends Page {

  getRoot() {
    return $.create('div', 'task-content').html(`
      <div class="task-header">
          <div class="task-header__title">Задачи</div>
          <div class="task-header__options">
            <span>&bull;&bull;&bull;</span>
          </div>
        </div>

        <div class="task-form">
          <div class="task-form__text-overflow">
            <textarea
              type="text"
              placeholder="Enter a title for this card..."
              class="task-form__text"
              id="textarea"
            ></textarea>
          </div>
          <div class="task-form__actions">
            <button id="add-card" class="task-form__add">Add card</button>
            <div class="task-form__delete">
              <span></span>
            </div>
            <div class="task-form__options">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"
                />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        <div id="list" class="task-list"></div>

        <div class="task-control">
          <router-link
            :class="{'disable': prevDisable}"
            :to="'/page/' + (pageNumber-1)"
            class="task-control__prev-btn task-control--btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </router-link>
          <router-link
            :class="{'disable': nextDisable}"
            :to="'/page/'+ (pageNumber+1)"
            class="task-control__next-btn task-control--btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </router-link>
        </div>
    `)
  }
}
