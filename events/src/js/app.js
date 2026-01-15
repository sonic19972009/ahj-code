import Router from './core/Router';
import Menu from './core/Menu';

import GoblinModule from './goblin';
import TasksModule from './tasks';
import GalleryModule from './gallery';

export default function bootstrap() {
    const tabsRoot = document.querySelector('.tabs');

    const goblinPage = document.querySelector('[data-page="goblin"]');
    const tasksPage = document.querySelector('[data-page="tasks"]');
    const galleryPage = document.querySelector('[data-page="gallery"]');

    const router = new Router({
        pagesSelector: '[data-page]',
        tabsSelector: '[data-tab]',
        defaultPage: 'menu',
    });

    router.register('menu', {
        init() {},
        destroy() {},
    });

    router.register('goblin', new GoblinModule(goblinPage));
    router.register('tasks', new TasksModule(tasksPage));
    router.register('gallery', new GalleryModule(galleryPage));

    const menu = new Menu(tabsRoot, (pageName) => router.go(pageName));
    menu.init();

    router.start();
}
