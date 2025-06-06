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
    
    /* FUNCTION GO TO LOGIN PAGE */
    function go_login() {
        window.location.href = "templates/login.html";
    }
    
    /* FUNCTION GO TO REGISTER PAGE */
    function go_register() {
        window.location.href = "templates/register.html";
    }
});

/* FUNCTION SHOW HEADER */
    function up_screen() {
        window.location.href = "#topPage";
    }