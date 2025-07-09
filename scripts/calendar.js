document.addEventListener("DOMContentLoaded", function() {
    const activities = document.querySelectorAll('.activity');

    activities.forEach(activity => {
        activity.addEventListener('click', function() {
            window.location.href = "../templates/activity.html";
        });
    });

    const activityCount = activities.length;
    const countElement = document.querySelector('.activityCount');
    const calendarSubtitle = document.querySelector('.calendarSubtitle');
    if (countElement && calendarSubtitle) {
        countElement.textContent = `${activityCount} actividades`;
        calendarSubtitle.textContent = `${activityCount} actividades programadas para 2025`;
    }
});

function back_to_home() {
    window.location.href = "../index.html"
}

function go_to_activities( ) {
    window.location.href = "../templates/activities.html"
}

function go_to_statistics( ) {
    window.location.href = "../templates/statistics.html"
}

function go_to_login( ) {
    window.location.href = "../templates/login.html"
}