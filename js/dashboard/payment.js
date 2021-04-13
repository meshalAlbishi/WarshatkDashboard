// general varible to use
var paymentRef = firebase.database().ref("Payment");
var billRef = firebase.database().ref('Bill/');
var tbody = $("#paymnet-table").find("tbody");
// ----------------------------------------------

// $(document).ready(() => {

// csp Payment
firebase.database().ref('users/ApplicationUser/ServiceProvider/')
    .once('value').then((snap) => {

        let amount = 0;

        snap.forEach((sps) => {
            amount += sps.val().totalPayment;
        });

        $("#csp-pay").text(amount);

    });

// Customer Payment
firebase.database().ref('users/ApplicationUser/Customer/')
    .once('value').then((snap) => {

        let amount = 0;

        snap.forEach((sps) => {
            amount += sps.val().totalPayment;
        });

        $("#cust-pay").text(amount);
    });


firebase.database().ref('Payment/Warshatk').once('value').then((snap) => {

    let warshatkAmount = snap.val().amount;
    $("#warshatk-pay").text(warshatkAmount);

});

// append all bill
tableAll();
// });

// * append all
function tableAll() {

    billRef.on('value', function (snapshot) {

        tbody.empty();

        snapshot.forEach(bill => {

            appendPayment(bill.val());

        });

    });

    $(".loader").css("display", "none");
    $("#main").css("display", "");
}

function appendPayment(bill) {

    var td = `<td>${bill.billNo}</td>`;

    td += `<td>${bill.describtion}</td>`;
    td += `<td>${bill.amount}</td>`;
    td += `<td>${bill.isPaid}</td>`;

    // date format
    var date = new Date(bill.payDate).toISOString().slice(0, 10);
    td += `<td>${date}</td>`;

    var tr = `<tr>${td}</tr>`
    tbody.append(tr);
}


// firebase.database().ref('Payment/customerUID').set({
//     IBAN:
//         "SA1234567890123456789012",
//     amount:
//         10000
// });

// firebase.database().ref('Bill/10005').set({
//     amount:
//         0,
//     billNo:
//         10004,
//     describtion:
//         "blah blah blaaah..",
//     isPaid:
//         false,
//     payDate:
//         0,

// });