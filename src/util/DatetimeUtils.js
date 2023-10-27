function getCurrentDateString() {
    const date = new Date();
    let month = date.getUTCMonth();
    if (month.length < 2) {
        month = "0" + month;
    }
    let day = date.getUTCDate();
    if (day.length < 2) {
        day = "0" + day;
    }
    return `${date.getUTCFullYear()}${month}${day}`;
}

export { getCurrentDateString };