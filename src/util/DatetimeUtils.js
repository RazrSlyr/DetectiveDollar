const getCurrentDateString = () => {
    const date = new Date();
    let month = date.getMonth();
    if (month.length < 2) {
        month = '0' + month;
    }
    let day = date.getDate();
    if (day.length < 2) {
        day = '0' + day;
    }
    return `${date.getFullYear()}${month}${day}`;
}

const getCurrentUTCTimestamp = () => {
    return Date.now();
}

export { getCurrentDateString, getCurrentUTCTimestamp };
