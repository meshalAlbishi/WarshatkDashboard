// general varible to use
var ref = firebase.database().ref("users/ApplicationUsers/Customer/");
var tbody = $("#customer-table").find("tbody");
//  ----------------------------------------------

tableAll();

// block and unblock -------------------------------------------------------------------------
// block function
$(document).on('click', '.block-cust', function () {
    changeStatus(this.id.trim(), 'block');
});

// un-block function
$(document).on('click', '.unblock-cust', function () {
    changeStatus(this.id.trim(), 'un-block');
});

// change button status
function changeStatus(regist_id, new_status) {
    firebase.database().ref('users/ApplicationUsers/Customer/' + regist_id)
        .update({
            status: new_status
        }, (error) => handleError(error));
}
//--------------------------------------------------------------------------------------------

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
            // console.log(tnVal.trim());
            tableFilterd(btnVal.trim());
        }
    });

});

// append all
function tableAll() {
    ref.on("value", (snapshot) => {

        tbody.empty();

        snapshot.forEach((customer) => {

            appendCustomer(customer);

        });

        $("#main").css("display", "");
        $(".loader").css("display", "none");
    });
}

// append according to filter
function tableFilterd(filter) {

    ref.orderByChild("status").equalTo(filter.toLowerCase()).on("value", (snapshot) => {

        tbody.empty();

        snapshot.forEach((customer) => {

            appendCustomer(customer);

        });

        $(".panel-body h3").css("display", "none");
    });
}

// to append to the table
function appendCustomer(customer) {
    var td = `<td>${customer.val().name}</td>`;
    td += `<td>${customer.val().phone}</td>`;

    // date format
    var date = new Date(customer.val().registDate).toISOString().slice(0, 10);
    td += `<td>${date}</td>`;

    td += `<td>${customer.val().numRequests}</td>`;
    td += `<td>${customer.val().totalPayment}</td>`;
    td += `<td>${customer.val().rating}</td>`;

    td += addBtns(customer);

    var tr = `<tr id='${customer.key}'>${td}</tr>`
    tbody.append(tr);
}

function addBtns(customer) {
    var td = "";

    if (customer.val().status === 'un-block') {

        td += `<td><a class="btn btn-danger block-cust"  id='${customer.key}'>Block</a>`;
        td += ` <a class="btn btn-success" disabled id='${customer.key}'>Un-Block</a></td>`;

    } else {

        td += `<td><a class="btn btn-danger" disabled id='${customer.key}'>Block</a>`;
        td += ` <a class="btn btn-success unblock-cust"  id='${customer.key}'>Un-Block</a></td>`;
    }

    return td;
}
// ---------------------------------------------------------------------------------------


function handleError(error) {
    if (error) {
        alert(error.message);
    }
}


// firebase.database().ref('users/ApplicationUsers/Customer/' + "0564896325").set(
//     {
//         phone: "0564896325",
//         name: "esmaeeil",
//         email: "esmaeeil@gmail.com",
//         IBAN: "SA1234567890123456789012",
//         registDate: 1612022655144,
//         status: "Un-block",
//         rating: 5,
//         city: "jeddah",
//         totalPayment: 0,
//         numRequests: 1
//     });   
