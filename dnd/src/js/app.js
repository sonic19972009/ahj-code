import Router from './core/Router';
import Menu from './core/Menu';
import MenuModule from './core/MenuModule';
import TrelloModule from './trello/TrelloModule';
import ImageModule from './image/ImageModule';

class StubModule {
    constructor(container) {
        this.container = container;
    }

    init() {
        this.container.innerHTML = '<p class="text">Заглушка</p>';
    }

    destroy() {
        this.container.innerHTML = '';
    }
}

export default function bootstrap() {
    const tabsRoot = document.querySelector('[data-widget="tabs"]');

    const menuPage = document.querySelector('[data-page="menu"]');
    const trelloPage = document.querySelector('[data-page="trello"]');
    const imagePage = document.querySelector('[data-page="image"]');
    const downloadPage = document.querySelector('[data-page="download"]');

    const router = new Router({
        pagesSelector: '[data-page]',
        tabsSelector: '[data-tab]',
        defaultPage: 'menu',
    });

    router.register('menu', new MenuModule(menuPage, (page) => router.go(page)));
    router.register('trello', new TrelloModule(trelloPage));
    router.register('image', new ImageModule(imagePage));
    router.register('download', new StubModule(downloadPage));

    const menu = new Menu(tabsRoot, (pageName) => router.go(pageName));
    menu.init();

    router.start();
}
