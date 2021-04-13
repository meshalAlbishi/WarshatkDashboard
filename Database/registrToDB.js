// var currentUSer = {};

export function registerCSP(csp) {
    try {

        firebase.database().ref('Registration/' + csp.phone).set(
            {
                phone: csp.phone,
                commercial: csp.commercial,
                email: csp.email,
                password: csp.password,
                storeName: csp.store,
                serviceType: csp.serviceType,
                IBAN: csp.IBAN,
                registDate: csp.registDate,
                status: "new",
                latitude: csp.lat,
                longitude: csp.lng

            }, (error) => {
                if (!error) {
                    getNumNew();
                }
            });
        return true;

    } catch (error) {

        return false;

    }
}

function getNumNew() {
    var old_numNew = 0;

    firebase.database().ref('Registration/numNew').once("value").then((snapshot) => {
        old_numNew = snapshot.val() + 1;
        updateNumNew(old_numNew);
    });
}

function updateNumNew(new_numNew) {
    firebase.database().ref('Registration/').update(
        {
            numNew: new_numNew
        }, (error) => {
            if (!error) {
                alert('Registration has been sent! please wait for the admin response');
                window.location.reload();
            }
        }
    );
}
