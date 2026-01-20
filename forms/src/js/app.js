import Router from './core/Router.js';
import Menu from './core/Menu.js';

import PopoversModule from './popovers/PopoversModule.js';
import EditorModule from './editor/EditorModule.js';

export default function bootstrap() {
    const tabsRoot = document.querySelector('[data-widget="tabs"]');

    const popoversPage = document.querySelector('[data-page="popovers"]');
    const editorPage = document.querySelector('[data-page="editor"]');
    const tripPage = document.querySelector('[data-page="trip"]');

    const router = new Router({
        pagesSelector: '[data-page]',
        tabsSelector: '[data-tab]',
        defaultPage: 'menu',
    });

    router.register('menu', { init() {}, destroy() {} });
    router.register('popovers', new PopoversModule(popoversPage));
    router.register('editor', new EditorModule(editorPage));

    router.register('trip', {
        init() {
            tripPage.innerHTML = '<p>-</p>';
        },
        destroy() {
            tripPage.innerHTML = '';
        },
    });

    const menu = new Menu(tabsRoot, (pageName) => router.go(pageName));
    menu.init();

    router.start();
}
