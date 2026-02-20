let listaHistorico = JSON.parse(localStorage.getItem("historico")) || [];

function mostrarValor(valor) {
  document.getElementById("valor-tamanho").textContent = valor;
}

function generatePassword() {

  const length = parseInt(document.getElementById("length").value);

  let caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const incluirNumeros = document.getElementById("numbers").checked;
  const incluirSimbolos = document.getElementById("symbols").checked;

  if (incluirNumeros) {
    caracteres += "0123456789";
  }

  if (incluirSimbolos) {
    caracteres += "!@#$%^&*()";
  }

  if (caracteres.length === 0) {
    alert("Selecione pelo menos uma opção de caractere.");
    return;
  }

  let senha = "";

  for (let i = 0; i < length; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  document.getElementById("result").textContent = senha;

  adicionarAoHistorico(senha);
  avaliarForca(senha);
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
  const tempo = document.getElementById("tempo-quebra");

  const temMinuscula = /[a-z]/.test(senha);
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temSimbolo = /[^A-Za-z0-9]/.test(senha);
  const comprimento = senha.length >= 12;

  atualizarChecklist("check-length", comprimento);
  atualizarChecklist("check-lower", temMinuscula);
  atualizarChecklist("check-upper", temMaiuscula);
  atualizarChecklist("check-number", temNumero);
  atualizarChecklist("check-symbol", temSimbolo);

  const criterios = [temMinuscula, temMaiuscula, temNumero, temSimbolo, comprimento]
    .filter(Boolean).length;

  const percentual = (criterios / 5) * 100;
  barra.style.width = percentual + "%";

  if (criterios === 5) {
    barra.style.background = "linear-gradient(90deg, #22c55e, #16a34a)";
    texto.textContent = "Forte";
  } else if (criterios >= 3) {
    barra.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
    texto.textContent = "Média";
  } else {
    barra.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
    texto.textContent = "Fraca";
  }

  calcularTempoQuebra(senha);
}


function atualizarChecklist(id, valido) {
  const item = document.getElementById(id);
  if (valido) {
    item.classList.add("ok");
    item.textContent = item.textContent.replace("✖", "✔");
  } else {
    item.classList.remove("ok");
    item.textContent = item.textContent.replace("✔", "✖");
  }
}


function calcularTempoQuebra(senha) {

  let charset = 0;

  if (/[a-z]/.test(senha)) charset += 26;
  if (/[A-Z]/.test(senha)) charset += 26;
  if (/[0-9]/.test(senha)) charset += 10;
  if (/[^A-Za-z0-9]/.test(senha)) charset += 32;

  const combinacoes = Math.pow(charset, senha.length);

  const tentativasPorSegundo = 1e9; // 1 bilhão por segundo (ataque moderno)
  const segundos = combinacoes / tentativasPorSegundo;

  const tempo = document.getElementById("tempo-quebra");

  if (segundos < 60) {
    tempo.textContent = "Pode ser quebrada em segundos.";
  } else if (segundos < 3600) {
    tempo.textContent = "Pode ser quebrada em minutos.";
  } else if (segundos < 86400) {
    tempo.textContent = "Pode levar horas para quebrar.";
  } else if (segundos < 31536000) {
    tempo.textContent = "Pode levar anos para quebrar.";
  } else {
    tempo.textContent = "Levaria décadas ou mais para quebrar.";
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

