// general varible to use
var ref = firebase.database().ref("Registration");
var tbody = $("#reg-table").find("tbody");
//  -----------------------------------------------

tableAll();

function appendRegistration(registration) {
    if (!isNaN(registration.val())) {
        return;
    }

    var td = `<td>${registration.val().storeName}</td>`;

    td += `<td>${registration.val().phone}</td>`;
    td += `<td>${registration.val().serviceType}</td>`;
    td += `<td>${registration.val().commercial}</td>`;

    var date = new Date(registration.val().registDate).toISOString().slice(0, 10);
    td += `<td>${date}</td>`;

    // button status
    var status = registration.val().status;
    td += addBtns(status, registration.val().phone);
    // ------------------------------------------------------------

    var tr = `<tr>${td}</tr>`

    tbody.append(tr);

    // update html
    $("#main").css("display", "");
    $(".loader").css("display", "none");
}

function addBtns(status, phone) {
    var td = "";

    if (status === 'new') {
        td += `<td><a class="btn btn-success accept-regist"  id='${phone}'">Accept</a>`;
        td += ` <a class="btn btn-danger reject-regist" id='${phone}'>Reject</a></td>`;
    } else if (status === 'rejected') {
        td += `<td><a class="btn btn-success" disabled id='${phone}'">Accept</a>`;
        td += ` <a class="btn btn-danger" id='${phone}'>Rejected</a></td>`;
    }


    return td;
}

// accept button event
$(document).on('click', '.accept-regist', function () {
    var regist_id = this.id.trim();
    // ! update 
    firebase.database().ref(`Registration/${regist_id}`).once('value')
        .then((registration) => {

            firebase.auth().createUserWithEmailAndPassword(registration.val().email, registration.val().password)
                .then((userStatus) => {
                    var uid = userStatus.user.uid;

                    firebase.database().ref(`users/ApplicationUsers/CarServiceProvider/${uid}`)
                        .set({
                            phone: registration.val().phone,
                            commercial: registration.val().commercial,
                            email: registration.val().email,
                            storeName: registration.val().storeName,
                            serviceType: registration.val().serviceType,
                            IBAN: registration.val().IBAN,
                            registDate: registration.val().registDate,
                            status: 'un-block',
                            rating: 0,
                            numOrders: 0,
                            totalPayment: 0,
                            appActivity: "inactive",
                            numberOfRating: 0,
                            ratingsTotal: 0,
                            latitude: registration.val().latitude,
                            longitude: registration.val().longitude
                        }, (error) => {
                            if (!error) {
                                getNumNew();
                                firebase.database().ref(`Registration/${regist_id}`).remove();
                            } else {
                                alert(errot.message);
                            }
                        });
                })
                .catch((error) => handleError(error));
        });
});

// reject button event
$(document).on('click', '.reject-regist', function () {
    var regist_id = this.id.trim();

    firebase.database().ref('Registration/' + regist_id)
        .update({
            status: "rejected"
        }, (error) => getNumRejected());
});

// handle error
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

// filter buttons ----------------------------------------------------------------------
var btns = $(".filter-btn");
btns.each(function () {

    // add click event
    $(this).click(function () {

        var current = $(".active");
        current.removeClass("active");

        $(this).addClass("active");

        // clear the table
        tbody.empty();

        var btnVal = $(this).html();
        if (btnVal.includes("all")) {
            tableAll();
        }
        else {
            tableFilterd(btnVal.trim());
        }
    });

});

function tableAll() {
    ref.on("value", (snapshot) => {

        tbody.empty();

        snapshot.forEach((registration) => {

            appendRegistration(registration);

        });

        $(".panel-body h3").css("display", "none");
    });
}

function tableFilterd(filter) {
    tbody.empty();

    ref.orderByChild("status").equalTo(filter.toLowerCase()).on("value", (snapshot) => {

        snapshot.forEach((registration) => {

            appendRegistration(registration);

        });

        $(".panel-body h3").css("display", "none");
    });
}
// ---------------------------------------------------------------------------------------


// update counters

// accepted counter
function getNumNew() {
    var old_numNew = 0;

    firebase.database().ref('Registration/numNew').once("value").then((snapshot) => {
        old_numNew = snapshot.val() - 1;
        updateNumNew(old_numNew);
    });
}

function updateNumNew(new_numNew) {
    firebase.database().ref('Registration/').update(
        {
            numNew: new_numNew
        }, (error) => handleError(error)
    );
}
// ------------------------------

// rejected counter
function getNumRejected() {
    console.log("hi");
    var old_numRejected = 0;

    firebase.database().ref('Registration/numRejected').once("value").then((snapshot) => {
        old_numRejected = snapshot.val() + 1;
        updateNumRejected(old_numRejected);
    });
}

function updateNumRejected(new_numRejected) {
    firebase.database().ref('Registration/').update(
        {
            numRejected: new_numRejected
        }, (error) => handleError(error)
    );
}
/// ------------------------------
