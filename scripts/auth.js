// scripts/auth.js

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === "admin@gym.com") {
        window.location.href = "dashboard.html";
    } else {
        window.location.href = "member.html";
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Login Successful!");
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}
