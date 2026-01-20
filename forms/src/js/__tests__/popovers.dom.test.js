import PopoversModule from '../popovers/PopoversModule';

describe('Popovers widget (DOM)', () => {
    test('should toggle popover on button click', () => {
        document.body.innerHTML = '<div data-page="popovers"></div>';

        const container = document.querySelector('[data-page="popovers"]');
        const module = new PopoversModule(container);
        module.init();

        const button = container.querySelector('[data-widget="popover-trigger"]');

        button.click();

        let popover = document.querySelector('[data-widget="popover"]');
        expect(popover).not.toBeNull();
        expect(popover.querySelector('.popover-title').textContent).toBe('Popover title');
        expect(popover.querySelector('.popover-content').textContent).toContain('amazing content');

        button.click();
        popover = document.querySelector('[data-widget="popover"]');
        expect(popover).toBeNull();

        module.destroy();
    });
});