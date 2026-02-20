let listaHistorico = [];

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
listaHistorico.unshift(senha);

if (listaHistorico.length > 5) {
  listaHistorico.pop();
}

atualizarHistorico();

avaliarForca(senhaGerada);

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

function avaliarForca(senha) {
  let pontos = 0;

  if (senha.length >= 8) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  const barra = document.getElementById("forca-barra");
  const texto = document.getElementById("forca-texto");

  if (pontos <= 1) {
    barra.style.width = "25%";
    barra.style.backgroundColor = "red";
    texto.textContent = "Senha Fraca";
  } else if (pontos === 2) {
    barra.style.width = "50%";
    barra.style.backgroundColor = "orange";
    texto.textContent = "Senha Média";
  } else {
    barra.style.width = "100%";
    barra.style.backgroundColor = "green";
    texto.textContent = "Senha Forte";
  }
}

function copiarSenha() {
  const senha = document.getElementById("result").textContent;
  const msg = document.getElementById("copiado-msg");

  if (!senha) {
    msg.textContent = "Gere uma senha primeiro.";
    return;
  }

  navigator.clipboard.writeText(senha);
  msg.textContent = "Senha copiada com sucesso!";
}

function mostrarValor(valor) {
  document.getElementById("valor-tamanho").textContent = valor;
}

function atualizarHistorico() {
  const ul = document.getElementById("historico");
  ul.innerHTML = "";

  listaHistorico.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

