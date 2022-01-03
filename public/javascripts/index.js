window.onscroll = function () {
    myFunction()
};
var topnav = document.getElementById("topnav");
var sticky = topnav.offsetTop;
var photo = document.getElementById("photos");
var photoOffset = photo.offsetTop;
var photoBox = document.getElementById("photoBox");
var contacts = document.getElementById("contacts");
var contactsbox = document.getElementById("contactsBox");
//console.log(contacts.offsetTop)
var contactsOffset = 1822 + window.screen.height;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        topnav.classList.add("sticky")

    } else {
        topnav.classList.remove("sticky");
    }
    if (window.pageYOffset >= photoOffset) {
        photoBox.classList.add("active")
    } else {
        photoBox.classList.remove("active")
    }
    if (window.pageYOffset >= contactsOffset) {
        contactsbox.classList.add("active")
        photoBox.classList.remove("active")
    } else {
        contactsBox.classList.remove("active")
    }

}
