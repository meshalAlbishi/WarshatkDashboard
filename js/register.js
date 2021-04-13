import { setErrorFor, setSuccess } from './form-controller.js';
import { registerCSP } from '../Database/registrToDB.js';


// initMap();
$(document).ready(() => {
    $('#inc-navbar').load('navbar.html', () => {
        $("#home", this).attr("href", "../../index.html#inc-home");
        $("#about", this).attr("href", "../../index.html#inc-about");
        $("#services", this).attr("href", "../../index.html#inc-service");
        $("#contact", this).attr("href", "../../index.html#inc-contact");
        $("#register", this).attr("href", "#");
    });

    $('#inc-footer').load('footer.html');
});


const form = document.getElementById('form');
const phoneNumber = document.getElementById('phoneNumber');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordCheck = document.getElementById('checkPassword');
const storeName = document.getElementById('storeName');
const city = document.getElementById('city');
const serviceType = document.getElementById('serviceType');
const IBAN = document.getElementById('IBAN');
const CommercialRegister = document.getElementById('CommercialRegister');
const location = document.getElementById('location');

var isValid = true;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    isValid = true;

    checkPhoneNumber();
    checkEmail();
    checkPassword();
    checkStoreName();
    checkCity();
    checkServiceTypeList();
    checkIBAN();
    checkCommercialRegister();

    if (isValid) {
        console.log(location.value);
        var registUser = createJSON();

        // send to the database
        registerCSP(registUser);
    }
})


// ------------------ Checking validation of the fields --------------------------------------

// the function check phone number validate
function checkPhoneNumber() {
    var isPhone = false;
    const phone = phoneNumber.value.trim();

    if (phone === '') {
        isValid &= false;
        setErrorFor(phoneNumber, 'Phone number cannot be empty');
        return;
    }

    if (phone.length !== 10) {
        isValid &= false;
        setErrorFor(phoneNumber, 'Phone number must be 10 digit');
        return;
    }

    if (!phone.startsWith('05')) {
        isValid &= false;
        setErrorFor(phoneNumber, 'Phone number must start with 05');
        return;
    }

    if (isNaN(phone)) {
        isValid &= false;
        setErrorFor(phoneNumber, 'Phone number must be only digit');
        return;
    }

    isValid &= true;
    setSuccess(phoneNumber);
}

// the function check email validate
function checkEmail() {
    const emailValue = email.value.trim();

    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailValue.match(mailformat)) {
        isValid &= false;
        setErrorFor(email, 'Email not valid');
        return;
    }

    isValid &= true;
    setSuccess(email);

}

// the function check password validate
function checkPassword() {
    const pass = password.value.trim();
    const passCheck = passwordCheck.value.trim();

    if (pass === '') {
        isValid &= false;
        setErrorFor(password, 'Password cannot be empty');
    }

    if (passCheck === '') {
        isValid &= false;
        setErrorFor(passwordCheck, 'Password cannot be empty');
    }

    if (pass.length < 6) {
        isValid &= false;
        setErrorFor(password, 'Must have minimum 6 character');
        return;
    }

    // var upperCaseLetters = /[A-Z]/g;
    // if (!pass.match(upperCaseLetters)) {
    //     isValid &= false;
    //     setErrorFor(password, 'Must have at least one uppercase');
    //     return;
    // }

    // var lowerCaseLetters = /[a-z]/g;
    // if (!pass.match(lowerCaseLetters)) {
    //     isValid &= false;
    //     setErrorFor(password, 'Must have at least one lowercase');
    //     return;
    // }

    var number = /[0-9]/g;
    if (!pass.match(number)) {
        isValid &= false;
        setErrorFor(password, 'Must have at least one number');
        return;
    }

    setSuccess(password);

    // --- --- --- --- --- --- --- --- --- --- --- 
    if (pass !== passCheck) {
        isValid &= false;
        setErrorFor(passwordCheck, 'Password must match');
        return;
    }

    isValid &= true;
    setSuccess(passwordCheck);
}

// the function check storeName validate 
function checkStoreName() {
    const storeN = storeName.value.trim();

    if (storeN === '') {
        setErrorFor(storeName, 'Store Name cannot be empty');
        isValid &= false;
        return;
    }

    isValid &= true;
    setSuccess(storeName);
}

// the function check city validate 
function checkCity() {
    const cityValue = city.value.trim();

    if (cityValue === '') {
        setErrorFor(city, 'City cannot be empty');
        isValid &= false;
        return;
    }

    isValid &= true;
    setSuccess(city);
}

// the function check IBAN validate 
function checkIBAN() {
    const iban = IBAN.value.trim();

    if (iban === '') {
        isValid &= false;
        setErrorFor(IBAN, 'IBAN cannot be empty');
        return;
    }

    if (!iban.startsWith('SA')) {
        isValid &= false;
        setErrorFor(IBAN, 'IBAN must start with SA');
        return;
    }
    if (iban.length !== 24) {
        isValid &= false;
        setErrorFor(IBAN, 'IBAN must have 24 digit');
        return;
    }

    isValid &= true;
    setSuccess(IBAN);
}

// the function check ServiceType validate
function checkServiceTypeList() {
    if (serviceType.selectedIndex == 0) {
        setErrorFor(serviceType, "Choose Service Type Please");
        isValid &= false;
        return;
    }

    isValid &= true;
    setSuccess(serviceType);
}

function checkCommercialRegister() {
    const commRegister = CommercialRegister.value.trim();
    if (commRegister === '') {
        setErrorFor(CommercialRegister, 'Commercial Register cannot be empty');
        isValid &= false;
        return;
    }

    isValid &= true;
    setSuccess(CommercialRegister);
}

// ------------------ ------------------ ------------------ ------------------

// this function to create JSON from the register form
function createJSON() {
    return {
        phone: phoneNumber.value,
        commercial: CommercialRegister.value,
        email: email.value,
        password: password.value,
        store: storeName.value,
        serviceType: serviceType.value,
        IBAN: IBAN.value,
        registDate: Date.now(),
        lat: location.value.substring(0, location.value.indexOf(',')).trim(),
        lng: location.value.substring(location.value.indexOf(',') + 1).trim()
    }
}

