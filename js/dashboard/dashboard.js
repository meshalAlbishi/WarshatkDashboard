var numReq = 0;

$(document).ready(() => {
    $('#inc-dashboard-nav').load('dashboard-nav.html');
    $('#inc-badges').load('badges.html', updateBadges());
});

function updateBadges() {
    // regist-badge
    var ref = firebase.database().ref("Registration");
    ref.orderByChild("status").equalTo("new").on("value", (snapshot) => $("#regist-badge").text(snapshot.numChildren()));

    // request-badge
    var ref = firebase.database().ref("Request");
    ref.once("value").then((snapshot) => $("#request-badge").text(getNumActiveReq()));

    // payment-badge
    var ref = firebase.database().ref("Bill");
    ref.once("value").then((snapshot) => $("#payment-badge").text(snapshot.numChildren()));

    // complaint-badge
    var ref = firebase.database().ref("Complaint");
    ref.once("value").then((snapshot) => $("#complaint-badge").text(snapshot.numChildren()));
}


function getNumActiveReq() {

    firebase.database().ref("Request").orderByChild("status").equalTo("active").once("value")
        .then(function (snapshot) {

            console.log(numReq);

        });
}

// function updateProgress() {
//     // getNumNew();
// }

// update registration progress
// function getNumNew() {
//     console.log("hi2");
//     var numNew = 0;

//     firebase.database().ref('Registration/numNew').once("value", (snapshot) => {
//         numNew = snapshot.val();
//         getNumRejected(numNew);
//     });
// }

// function getNumRejected(numNew) {
//     console.log("hi2");
//     var numRejected = 0;
//     console.log("rej");
//     firebase.database().ref('Registration/numRejected').once("value", (snapshot) => {
//         numRejected = snapshot.val();
//         updateRegistProgress(numRejected, numNew);
//     });
// }

// function updateRegistProgress(numRejected, numNew) {
//     var progPer = (numRejected / (numNew + numRejected)) * 100;

//     regist_prog.attr("aria-valuenow", progPer);
//     regist_prog.css("width", progPer);
//     regist_prog.text(progPer);
// }
// --------------------------------------------------------------------------------------