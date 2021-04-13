// general varible to use
var ref = firebase.database().ref("Request");
var tbody = $("#req-table").find("tbody");
var modal = document.getElementById('viewReq');
//  -----------------------------------------------

tableAll();

// filter buttons ---------------------------------------------------------------------------------
var btns = $(".filter-btn");
btns.each(function () {

    // add click event
    $(this).click(function () {
        tbody.empty();

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

// append all
function tableAll() {

    ref.on("value", (snapshot) => {

        tbody.empty();

        snapshot.forEach((request) => {

            appendRequest(request);

        });

        $("#main").css("display", "");
        $(".loader").css("display", "none");

        $(".panel-body h3").css("display", "none");
    });
}

// append according to filter
function tableFilterd(filter) {

    tbody.empty();

    ref.orderByChild("status").equalTo(filter.toLowerCase()).on("value", (snapshot) => {

        snapshot.forEach((request) => {

            appendRequest(request);

        })

        $(".panel-body h3").css("display", "none");
    });
}

// to append to the table
function appendRequest(request) {
    var reqNo = request.val().requestNo;

    var td = `<td class='viewReq' id="${request.key}"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></td>`;
    td += `<td>${reqNo}</td>`;

    // empty to column to add later
    td += `<td id='${request.val().customer}-cust-${request.key}'></td>`;
    td += `<td id='${request.val().servProvider}-serv-${request.key}'></td>`;

    // date format
    var date = new Date(request.val().requestDate).toISOString().slice(0, 10);
    td += `<td>${date}</td>`;

    var status = request.val().status;
    td += `<td>${status}</td>`;

    td += `<td>${addBtns(request.key, status)}</td>`


    var tr = `<tr>${td}</tr>`
    tbody.append(tr);

    getCustomerName(request);
    getServProviderName(request);
}

function addBtns(reqNo, status) {
    if (status === 'active' || status === 'workshop') {
        return `<a id="${reqNo}" class="btn btn-danger close_req">Close Request</a>`;
    } else {
        return `<a class="btn btn-danger" disabled>Close Request</a>`;
    }
}

// get customer name from db
function getCustomerName(request) {
    firebase.database().ref(`users/ApplicationUsers/Customer/${request.val().customer}`)
        .on('value', (customer) => {

            var custName = customer.val().name;
            updateCustomerName(request.key, request.val().customer, custName);

        });
}

// update customer name in the table
function updateCustomerName(reqNo, phone, custName) {
    $(`#${phone}-cust-${reqNo}`).html(custName);
}

// get Service Provider name from db
function getServProviderName(request) {
    console.log(request.val().servProvider);
    firebase.database().ref(`users/ApplicationUsers/CarServiceProvider/${request.val().servProvider}`)
        .on('value', (serviceProvider) => {

            var providerName = serviceProvider.val().storeName;
            updateServProviderName(request.key, request.val().servProvider, providerName);

        });
}

// update Service Provider name in the table
function updateServProviderName(reqNo, phone, providerName) {
    $(`#${phone}-serv-${reqNo}`).html(providerName);
}
// --------------------------------------------------------------------------------------------------

// close btn event
$(document).on('click', '.close_req', function () {
    firebase.database().ref('Request/' + this.id.trim())
        .update({
            status: "closed"
        });

    $(".my-modal-wrapper").css("display", "none");
});

// modal section
// outside modal click
$(window).click((e) => {
    if (e.target === modal) {
        $(".my-modal-wrapper").css("display", "none");
    }
});

$(document).on('click', ".viewReq", function () {
    // show modal
    $(".my-modal-wrapper").css("display", "flex");

    var reqNo = $(this).attr('id');
    $('.reqNo').text(reqNo);
    $('#requestNumber').val(reqNo);


    firebase.database().ref(`Request/${reqNo}/`).once('value').then((request) => {

        updateModalFields(request.val());

    });

});

function updateModalFields(request) {

    // date field
    var date = new Date(request.requestDate).toISOString().slice(0, 10);
    $('#requestDate').val(date);

    // customer phone field        
    var customerPhone = request.customer;
    $('#CustomerPhone').val(customerPhone);

    // customer name field   
    var customerName = $(`#${customerPhone}-cust-${request.requestNo}`).text();
    $('#CustomerName').val(customerName);

    // provider phone field
    var providerPhone = request.servProvider;
    $('#providerPhone').val(providerPhone);

    // customer name field    
    var providerName = $(`#${providerPhone}-serv-${request.requestNo}`).text();
    $('#providerName').val(providerName);

    // details field
    $('#details').val(request.details);

    // progress field
    $('#progress').val(request.progress);

    // status field
    var status = request.status;
    $('#status').val(status.trim());

    // update payment field
    updatePaymentField(request.billNo);

    $('#req-btn-modal').html(addBtns(request.requestNo, status));
}

function updatePaymentField(billNo) {

    firebase.database().ref(`Bill/${billNo}`).once('value').then((bill) => {

        console.log(bill);

        // total payment field
        var totalPayment = bill.val().amount;
        $('#totalPayment').val(totalPayment);

        // is payment field
        var isPayment = bill.val().isPaid;
        $('#isPaid').val(isPayment);
    });
}

//--------------------------------------------------------------------------------------------


// firebase.auth().createUserWithEmailAndPassword("test2@email.com", "123456")
//     .then((userCredential) => {
//         console.log(userCredential.user.uid);
//         firebase.database().ref("users/ApplicationUsers/CarServiceProvider/" + userCredential.user.uid).set({
//             IBAN:
//                 "SA1234567890123456789012",
//             commercial:
//                 "565459646",
//             email:
//                 "test2@email.com",
//             numOrders:
//                 2,
//             password:
//                 "1234567",
//             phone:
//                 "0512345678",
//             rating:
//                 5,
//             registDate:
//                 1611944905395,
//             serviceType:
//                 "workshop",
//             status:
//                 "Block",
//             storeName:
//                 "Al-Safa Workshop",
//             totalPayment:
//                 0

//         });
//     })
//     .catch((error) => console.log(error.message));


// firebase.database().ref('Request/' + 2222).update(
//     {
//     requestNo: 1111,
//     customer: "0569813231",
// servProvider: "LPG70EO4e0UafBDyp6MQ5BTmcsB3"
//     requestDate: 1612022655144,
//     isAccepted: true,
//     details: "plah plah plah pla..",
//     status: "Active",
//     progress: "on work",
//     billNo: 10001,
//     carID: "Toyota-Camry-2017"
// });

// firebase.database().ref('Car/' + "Toyota-Corolla-2016").set(
//     {
//         carID: "Toyota-Corolla-2016",
//         company: "Toyota",
//         name: "Corolla",
//         model: 2016,
//         numRequests: 1
//     });

// firebase.database().ref('Bill/' + "10004").set(
//     {
//         billNo: 10004,
//         amount: 0,
//         isPaid: false,
//         payDate: 1612022655144,
//         describtion: "blah blah blaaah.."
// 
//     });

// firebase.database().ref('Users-Requests/servicePRoviderUID/').update(
//     {
//         uidRequest: requestNo
//     });

// firebase.database().ref('Users-Bills/' + "LPG70EO4e0UafBDyp6MQ5BTmcsB3/").set(
//     {
//         '10001': '10001',
//         '10002': '10002',
//         '10005': '10005'
// bill/uid
//     });