import {
  $
} from '../dome';
import {
  ActiveRoute
} from './ActiveRoute';

export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('Selector is not provided in Router')
    }
    this.$placeholder = $(selector)
    this.routes = routes
    this.page = null
    this.changePageHandler = this.changePageHandler.bind();
    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler)
    this.changePageHandler()
  }
  changePageHandler() {
    if (this.page) {
      this.page.destroy()
    }

    this.$placeholder.clear()

    const Page = ActiveRoute.path.includes('todolist') ?

      this.routes.todolist :
      this.routes.dashboard
    console.log('Page: ', Page);

    this.page = new Page(ActiveRoute.param)

    this.$placeholder.append(this.page.getRoot())

    this.page.afterRender()
  }
  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler)
  }
}
