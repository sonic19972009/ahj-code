import moment from 'moment';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default class CalendarPopover {
    constructor() {
        this.el = null;
        this.anchorWrap = null;

        this.month = null;
        this.selected = null;
        this.minDate = null;
        this.onSelect = null;

        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onInnerClick = this.onInnerClick.bind(this);
    }

    isOpen() {
        return Boolean(this.el) && !this.el.classList.contains('hidden');
    }

    contains(target) {
        return Boolean(this.el) && this.el.contains(target);
    }

    onInnerClick(event) {
        event.stopPropagation();
    }

    open({ anchorEl, month, selected, minDate, onSelect }) {
        this.month = month.clone().startOf('month');
        this.selected = selected ? selected.clone().startOf('day') : null;
        this.minDate = minDate ? minDate.clone().startOf('day') : moment().startOf('day');
        this.onSelect = onSelect;

        this.anchorWrap = anchorEl.closest('.trip-input-wrap');
        if (!this.anchorWrap) {
            this.anchorWrap = anchorEl.parentElement;
        }

        if (!this.el) {
            this.el = document.createElement('div');
            this.el.className = 'trip-calendar hidden';
            this.el.dataset.widget = 'calendar';
            this.anchorWrap.append(this.el);

            this.el.addEventListener('click', this.onInnerClick);
        } else if (this.el.parentElement !== this.anchorWrap) {
            this.el.remove();
            this.anchorWrap.append(this.el);
        }

        this.el.style.top = 'calc(100% + 8px)';
        this.el.style.left = '0px';

        this.render();
        this.el.classList.remove('hidden');
    }

    close() {
        if (!this.el) {
            return;
        }

        this.el.classList.add('hidden');
    }

    destroy() {
        if (!this.el) {
            return;
        }

        this.el.removeEventListener('click', this.onInnerClick);
        this.el.remove();
        this.el = null;
        this.anchorWrap = null;
        this.onSelect = null;
    }

    onPrev(event) {
        event.preventDefault();
        event.stopPropagation();

        this.month = this.month.clone().subtract(1, 'month');
        this.render();
    }

    onNext(event) {
        event.preventDefault();
        event.stopPropagation();

        this.month = this.month.clone().add(1, 'month');
        this.render();
    }

    render() {
        if (!this.el) {
            return;
        }

        this.el.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'cal-header';

        const title = document.createElement('div');
        title.className = 'cal-title';
        title.textContent = this.month.format('MMMM YYYY');

        const nav = document.createElement('div');
        nav.className = 'cal-nav';

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'cal-btn';
        prevBtn.textContent = '←';
        prevBtn.addEventListener('click', this.onPrev);

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'cal-btn';
        nextBtn.textContent = '→';
        nextBtn.addEventListener('click', this.onNext);

        nav.append(prevBtn, nextBtn);
        header.append(title, nav);

        const weekRow = document.createElement('div');
        weekRow.className = 'cal-week';

        WEEKDAYS.forEach((d) => {
            const wd = document.createElement('div');
            wd.className = 'cal-weekday';
            wd.textContent = d;
            weekRow.append(wd);
        });

        const grid = document.createElement('div');
        grid.className = 'cal-grid';

        const start = this.month.clone().startOf('month').isoWeekday(1);
        const end = this.month.clone().endOf('month').isoWeekday(7);

        const today = moment().startOf('day');

        let cursor = start.clone();

        while (cursor.isSameOrBefore(end, 'day')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cal-day';
            btn.textContent = String(cursor.date());

            const isDisabled = cursor.isBefore(this.minDate, 'day');
            if (isDisabled) {
                btn.disabled = true;
            }

            if (cursor.isSame(today, 'day')) {
                btn.classList.add('today');
            }

            if (this.selected && cursor.isSame(this.selected, 'day')) {
                btn.classList.add('selected');
            }

            const picked = cursor.clone();
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (btn.disabled) {
                    return;
                }

                if (typeof this.onSelect === 'function') {
                    this.onSelect(picked);
                }
            });

            grid.append(btn);
            cursor.add(1, 'day');
        }

        this.el.append(header, weekRow, grid);
    }
}
