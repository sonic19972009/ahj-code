export default class TripView {
    constructor(container) {
        this.container = container;

        this.departInput = null;
        this.returnInput = null;
        this.returnField = null;
    }

    renderLayout() {
        this.container.innerHTML = `
            <div class="trip" data-widget="trip">
                <div class="trip-card">
                    <div class="trip-title">Trip Calendar</div>

                    <label class="trip-roundtrip">
                        <input type="checkbox" data-id="roundtrip" />
                        <span>Туда-обратно</span>
                    </label>

                    <div class="trip-fields">
                        <div class="trip-field" data-field="depart">
                            <div class="trip-label">Туда</div>

                            <div class="trip-input-wrap">
                                <input
                                    class="trip-input"
                                    type="text"
                                    readonly
                                    placeholder="Выберите дату"
                                    data-id="depart-input"
                                />
                                <span class="trip-icon">📅</span>
                            </div>
                        </div>

                        <div class="trip-field hidden" data-id="return-block" data-field="return">
                            <div class="trip-label">Обратно</div>

                            <div class="trip-input-wrap">
                                <input
                                    class="trip-input"
                                    type="text"
                                    readonly
                                    placeholder="Выберите дату"
                                    data-id="return-input"
                                />
                                <span class="trip-icon">📅</span>
                            </div>
                        </div>
                    </div>

                    <div class="trip-hint" data-id="trip-hint"></div>
                </div>
            </div>
        `;

        this.departInput = this.container.querySelector('[data-id="depart-input"]');
        this.returnInput = this.container.querySelector('[data-id="return-input"]');
        this.returnField = this.container.querySelector('[data-id="return-block"]');
    }

    destroy() {
        this.container.innerHTML = '';
        this.departInput = null;
        this.returnInput = null;
        this.returnField = null;
    }

    setReturnVisible(isVisible) {
        if (!this.returnField) {
            return;
        }

        this.returnField.classList.toggle('hidden', !isVisible);
    }

    setDepartValue(value) {
        if (!this.departInput) {
            return;
        }

        this.departInput.value = value;
    }

    setReturnValue(value) {
        if (!this.returnInput) {
            return;
        }

        this.returnInput.value = value;
    }

    getInputEl(field) {
        if (field === 'depart') {
            return this.departInput;
        }

        return this.returnInput;
    }
}
