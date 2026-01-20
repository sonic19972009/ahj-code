import moment from 'moment';
import TripView from './TripView.js';
import CalendarPopover from './calendar/CalendarPopover.js';

export default class TripModule {
    constructor(container) {
        this.container = container;

        this.view = new TripView(container);
        this.calendar = new CalendarPopover();

        this.state = {
            roundTrip: false,
            depart: null,
            ret: null,
            activeField: 'depart',
        };

        this.onContainerClick = this.onContainerClick.bind(this);
        this.onContainerChange = this.onContainerChange.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
    }

    init() {
        this.view.renderLayout();
        this.syncInputs();

        this.container.addEventListener('click', this.onContainerClick);
        this.container.addEventListener('change', this.onContainerChange);
        document.addEventListener('click', this.onDocumentClick);
    }

    destroy() {
        document.removeEventListener('click', this.onDocumentClick);
        this.container.removeEventListener('change', this.onContainerChange);
        this.container.removeEventListener('click', this.onContainerClick);

        this.calendar.destroy();
        this.view.destroy();
    }

    onContainerChange(event) {
        const el = event.target;

        if (el.matches('[data-id="roundtrip"]')) {
            this.state.roundTrip = Boolean(el.checked);

            if (!this.state.roundTrip) {
                this.state.ret = null;
                this.state.activeField = 'depart';
                this.calendar.close();
            } else if (this.state.depart && this.state.ret && this.state.ret.isBefore(this.state.depart, 'day')) {
                this.state.ret = null;
            }

            this.view.setReturnVisible(this.state.roundTrip);
            this.syncInputs();
        }
    }

    onContainerClick(event) {
        const departInput = event.target.closest('[data-id="depart-input"]');
        const returnInput = event.target.closest('[data-id="return-input"]');

        if (departInput) {
            this.openCalendar('depart');
            return;
        }

        if (returnInput) {
            if (!this.state.roundTrip) {
                return;
            }
            this.openCalendar('return');
        }
    }

    onDocumentClick(event) {
        if (!this.calendar.isOpen()) {
            return;
        }

        const clickedInsideTrip = this.container.contains(event.target);
        const clickedInsideCalendar = this.calendar.contains(event.target);

        if (!clickedInsideTrip && !clickedInsideCalendar) {
            this.calendar.close();
        }
    }

    openCalendar(field) {
        this.state.activeField = field;

        const anchor = this.view.getInputEl(field);
        const today = moment().startOf('day');

        let minDate = today;

        if (field === 'return') {
            if (!this.state.roundTrip) {
                return;
            }
            if (this.state.depart) {
                minDate = moment.max(today, this.state.depart.clone().startOf('day'));
            }
        }

        const initialMonth = (field === 'return' && this.state.ret)
            ? this.state.ret.clone()
            : (field === 'depart' && this.state.depart)
                ? this.state.depart.clone()
                : today.clone();

        this.calendar.open({
            anchorEl: anchor,
            month: initialMonth,
            selected: field === 'depart' ? this.state.depart : this.state.ret,
            minDate,
            onSelect: (date) => this.onSelectDate(date),
        });
    }

    onSelectDate(date) {
        if (!date) {
            return;
        }

        if (this.state.activeField === 'depart') {
            this.state.depart = date.clone().startOf('day');

            if (this.state.roundTrip && this.state.ret && this.state.ret.isBefore(this.state.depart, 'day')) {
                this.state.ret = null;
            }

            this.syncInputs();

            if (this.state.roundTrip) {
                this.openCalendar('return');
            } else {
                this.calendar.close();
            }

            return;
        }

        this.state.ret = date.clone().startOf('day');
        this.syncInputs();
        this.calendar.close();
    }

    syncInputs() {
        this.view.setDepartValue(this.state.depart ? this.state.depart.format('DD.MM.YYYY') : '');
        this.view.setReturnValue(this.state.ret ? this.state.ret.format('DD.MM.YYYY') : '');
    }
}
