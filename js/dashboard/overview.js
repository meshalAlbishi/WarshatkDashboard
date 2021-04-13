$(document).ready(() => {
    // csp-num
    var ref = firebase.database().ref("users/ApplicationUsers/CarServiceProvider/");
    ref.once("value").then((snapshot) => { $("#csp-num").text(snapshot.numChildren()) });

    // cust-num
    var ref = firebase.database().ref("users/ApplicationUsers/Customer/");
    ref.once("value").then((snapshot) => { $("#cust-num").text(snapshot.numChildren()) });

    // active-req-num
    var ref = firebase.database().ref("Request/");
    ref.once("value").then((snapshot) => { $("#req-num").text(snapshot.numChildren()) });

    // complaint-num
    var ref = firebase.database().ref("Complaint/");

    // ref.once("value").then((snapshot) => { $("#complaint-num").text(snapshot.numChildren()) });
    ref.orderByChild("status").equalTo("open").on("value", (snapshot) => {
        $("#complaint-num").text(snapshot.numChildren());
        $("#main").css("display", "");
        $(".loader").css("display", "none");
    });
});