function generatePassword() {
    const length = document.getElementById("length").value;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSymbols = document.getElementById("symbols").checked;

    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%&*";

    let chars = letters;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById("result").innerText = password;
}

function validatePassword() {
    const password = document.getElementById("passwordCheck").value;

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%&*]/.test(password)) strength++;

    let message = "Fraca";

    if (strength >= 3) message = "Média";
    if (strength === 4) message = "Forte";

    document.getElementById("strength").innerText = "Força da senha: " + message;
}
