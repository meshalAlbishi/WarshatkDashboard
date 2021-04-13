
export function loginAdmin(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {

            window.location = "../../html/AdminPage/overview.html";

        }).catch((error) => alert(error.message));
}