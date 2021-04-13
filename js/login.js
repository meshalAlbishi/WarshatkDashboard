import { setErrorFor } from './form-controller.js';
import { loginAdmin } from '../Database/loginToDB.js';

$(document).ready(() => {
    $('#inc-navbar').load('../HomePage/navbar.html');
    $('#inc-footer').load('../HomePage/footer.html');
});

const form = document.getElementById('login');
const admin_id = document.getElementById('email');
const password = document.getElementById('password');

var isValied = true;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    checkID();
    checkPassword();

    if (isValied) {
        loginAdmin(admin_id.value, password.value);
    }
})

// the function check admin number validate
function checkID() {
    const admin = admin_id.value.trim();

    if (admin === '') {
        isValied &= false;

        setErrorFor(admin_id, 'email not match any account')
        return;
    }

    isValied &= true;
}

// the function check password validate
function checkPassword() {
    const pass = password.value.trim();

    if (pass === '') {
        isValied &= false;

        setErrorFor(password, 'Password cannot be empty')
        return;
    }

    isValied &= true;
}
