// general varible to use
var ref = firebase.database().ref("users/ApplicationUsers/CarServiceProvider/");
var tbody = $("#csp-table").find("tbody");
var modal = document.getElementById('editCsp');
//  ----------------------------------------------

tableAll();

// modal section
// outside modal click
$(window).click((e) => {
    if (e.target === modal) {
        $(".my-modal-wrapper").css("display", "none");
    }
});

$(document).on('click', ".edit-btn", function () {
    $(".my-modal-wrapper").css("display", "block");

    var id = $(this).attr('id');

    var store_text = $(`#${id}-store`).text();
    $("#StoreName").val(store_text);

    var comm_text = $(`#${id}-commerc`).text();
    $("#CommercialRegister").val(comm_text);

    var serv_text = $(`#${id}-type`).text();
    $("#serviceType").val(serv_text);

    $(".save-btn").attr('id', id);
});
//--------------------------------------------------------------------------------------------

// save btn event ---------------------------------------------------------------------------
$(document).on('click', ".save-btn", function () {
    saveEdit(this.id.trim());
});

function saveEdit(id) {
    firebase.database().ref('users/ApplicationUsers/CarServiceProvider/' + id)
        .update({
            commercial: $("#CommercialRegister").val(),
            storeName: $("#StoreName").val(),
            serviceType: $("#serviceType").val()
        }, (error) => handleError(error));
}
//--------------------------------------------------------------------------------------------


// block and unblock -------------------------------------------------------------------------
// block function
$(document).on('click', '.block-csp', function () {
    changeStatus(this.id.trim(), 'block');
});

// un-block function
$(document).on('click', '.unblock-csp', function () {
    changeStatus(this.id.trim(), 'un-block');
});

// change button status
function changeStatus(regist_id, new_status) {
    firebase.database().ref('users/ApplicationUsers/CarServiceProvider/' + regist_id)
        .update({
            status: new_status
        }, (error) => handleError(error));
}
//--------------------------------------------------------------------------------------------

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
            // console.log(tnVal.trim());
            tableFilterd(btnVal.trim());
        }
    });

});

// append all
function tableAll() {
    ref.on("value", (snapshot) => {

        tbody.empty();

        snapshot.forEach((csp) => {

            appendProvider(csp);

        });

        $("#main").css("display", "");
        $(".loader").css("display", "none");
    });
}

// append according to filter
function tableFilterd(filter) {

    ref.orderByChild("status").equalTo(filter.toLowerCase()).on("value", (snapshot) => {

        tbody.empty();

        snapshot.forEach((csp) => {

            appendProvider(csp);

        });

        $(".panel-body h3").css("display", "none");
    });
}

// to append to the table
function appendProvider(csp) {

    var td = `<td id='${csp.key}' class="edit-btn"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></td>`;

    td += `<td id='${csp.key}-store'>${csp.val().storeName}</td>`;
    td += `<td id="${csp.key}-phone">${csp.val().phone}</td>`;
    td += `<td id="${csp.key}-type">${csp.val().serviceType}</td>`;
    td += `<td id="${csp.key}-commerc">${csp.val().commercial}</td>`;

    // date format
    var date = new Date(csp.val().registDate).toISOString().slice(0, 10);
    td += `<td>${date}</td>`;

    td += `<td>${csp.val().rating}</td>`;
    td += `<td>${csp.val().numOrders}</td>`;

    td += addBtns(csp);

    var tr = `<tr id='${csp.key}'>${td}</tr>`
    tbody.append(tr);
}

function addBtns(csp) {
    var td = "";

    if (csp.val().status === 'un-block') {

        td += `<td><a class="btn btn-danger block-csp"  id='${csp.key}'>Block</a>`;
        td += ` <a class="btn btn-success" disabled id='${csp.key}'>Un-Block</a></td>`;

    } else {

        td += `<td><a class="btn btn-danger" disabled id='${csp.key}'>Block</a>`;
        td += ` <a class="btn btn-success unblock-csp"  id='${csp.key}'>Un-Block</a></td>`;
    }

    return td;
}
// ---------------------------------------------------------------------------------------



