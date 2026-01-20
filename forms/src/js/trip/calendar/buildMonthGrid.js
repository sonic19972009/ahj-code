export default function buildMonthGrid(monthMoment) {
    const monthStart = monthMoment.clone().startOf('month');
    const monthEnd = monthMoment.clone().endOf('month');

    const startOffset = monthStart.isoWeekday() - 1;
    const start = monthStart.clone().subtract(startOffset, 'days');

    const endOffset = 6 - (monthEnd.isoWeekday() - 1);
    const end = monthEnd.clone().add(endOffset, 'days');

    const days = [];
    const cursor = start.clone();

    while (cursor.isSameOrBefore(end, 'day')) {
        days.push(cursor.clone());
        cursor.add(1, 'day');
    }

    if (days.length < 42) {
        const last = days[days.length - 1].clone();
        while (days.length < 42) {
            last.add(1, 'day');
            days.push(last.clone());
        }
    }

    return days;
}
