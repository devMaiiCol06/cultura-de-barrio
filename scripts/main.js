document.addEventListener("DOMContentLoaded", function() {
    const upButton = document.querySelector('.up');
    
    /* FUNCTION SHOW BUTTON (UP) */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            upButton.style.display = 'flex';
        } else {
            upButton.style.display = 'none';
        }
    });
    
});

/* FUNCTION SHOW HEADER */
function up_screen() {
    window.location.href = "#topPage";
}

/* FUNCTION GO TO AUTH PAGE */
function go_auth() {
    window.location.href = "templates/login.html";
}

/* FUNCTION GO TO ACTIVITIES PAGE */
function go_activities() {
    window.location.href = "templates/activities.html";
}

/* FUNCTION GO TO CALENDAR PAGE */
function go_calendar() {
    window.location.href = "templates/calendar.html";
}

/* FUNCTION GO TO CALENDAR PAGE */
function go_statistics() {
    window.location.href = "templates/statistics.html";
}

/* FUNCTION SHOW SELECTED ACTIVITY PAGE */
function show_activity() {
    window.location.href = "templates/activity.html"
}