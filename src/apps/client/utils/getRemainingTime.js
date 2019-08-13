import format from 'date-fns/format';

export default (discountTime) => {
    const dateNew = format(discountTime, 'MM DD,YYYY hh:mm');
    const dateT = new Date(dateNew);
    const date = new Date();
    const timer = dateT - date;
    let day = 0;
    let hour = 0;
    let min = 0;
    let sec = 0;

    if (dateT > date) {
        day = parseInt(timer / (60 * 60 * 1000 * 24));

        if (day < 10) {
            day = '0' + day;
        }

        day = day.toString();

        hour = parseInt(timer / (60 * 60 * 1000)) % 24;

        if (hour < 10) {
            hour = '0' + hour;
        }

        hour = hour.toString();

        min = parseInt(timer / (1000 * 60)) % 60;

        if (min < 10) {
            min = '0' + min;
        }

        sec = parseInt(timer / 1000) % 60;

        if (sec < 10) {
            sec = '0' + sec;
        }

        sec = sec.toString();

        return `${day}:${hour}:${min}:${sec}`;
    } else {
        return '';
    }
};
