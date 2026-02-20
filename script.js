let listaHistorico = JSON.parse(localStorage.getItem("historico")) || [];

function mostrarValor(valor) {
  document.getElementById("valor-tamanho").textContent = valor;
}

function generatePassword() {

  const result = document.getElementById("result");
  result.classList.add("animar");

  setTimeout(() => {

    const length = document.getElementById("length").value;

    let caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (document.getElementById("numbers").checked) {
      caracteres += "0123456789";
    }

    if (document.getElementById("symbols").checked) {
      caracteres += "!@#$%^&*()";
    }

    let senha = "";

    for (let i = 0; i < length; i++) {
      senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    result.textContent = senha;
    result.classList.remove("animar");

    adicionarAoHistorico(senha);
    avaliarForca(senha);

  }, 150);
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

function avaliarForca(senha) {

  const barra = document.getElementById("forca-barra");
  const texto = document.getElementById("forca-texto");

  const maxLength = 12;
  const percentual = (senha.length / maxLength) * 100;

  barra.style.width = percentual + "%";

  if (senha.length < 6) {
    barra.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
    texto.textContent = "Fraca";
  } else if (senha.length < 10) {
    barra.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
    texto.textContent = "Média";
  } else {
    barra.style.background = "linear-gradient(90deg, #22c55e, #16a34a)";
    texto.textContent = "Forte";
  }
}

function atualizarHistorico() {
  const ul = document.getElementById("historico");
  ul.innerHTML = "";

  listaHistorico.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });

  localStorage.setItem("historico", JSON.stringify(listaHistorico));
}

function limparHistorico() {
  listaHistorico = [];
  localStorage.removeItem("historico");
  atualizarHistorico();
}

function adicionarAoHistorico(senha) {
  listaHistorico.unshift(senha);

  if (listaHistorico.length > 5) {
    listaHistorico.pop();
  }

  localStorage.setItem("historico", JSON.stringify(listaHistorico));
  atualizarHistorico();
}

atualizarHistorico();

function copiarSenha() {
  const senha = document.getElementById("result").textContent;
  const msg = document.getElementById("copiado-msg");

  if (!senha) {
    msg.textContent = "Gere uma senha primeiro.";
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(senha)
      .then(() => {
        msg.textContent = "Senha copiada com sucesso!";
        setTimeout(() => msg.textContent = "", 2000);
      })
      .catch(() => fallbackCopy(senha, msg));
  } else {
    fallbackCopy(senha, msg);
  }
}

function fallbackCopy(texto, msg) {
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  msg.textContent = "Senha copiada com sucesso!";
  setTimeout(() => msg.textContent = "", 2000);
}

