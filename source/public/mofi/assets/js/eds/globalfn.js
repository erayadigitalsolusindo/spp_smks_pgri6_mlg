function setDefaultDate(namaid,mundurberapatahunkebelakakang) {
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - mundurberapatahunkebelakakang);
    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    let day = ('0' + currentDate.getDate()).slice(-2);
    let hours = ('0' + currentDate.getHours()).slice(-2);
    let minutes = ('0' + currentDate.getMinutes()).slice(-2);
    let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById(namaid).value = formattedDate;
}
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
