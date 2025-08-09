let carrinho = {};

function adicionarAoCarrinho(nome, preco) {
  if (carrinho[nome]) {
    carrinho[nome].quantidade++;
  } else {
    carrinho[nome] = { preco, quantidade: 1 };
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  let listaCarrinho = document.getElementById("lista-carrinho");
  let total = 0;
  listaCarrinho.innerHTML = "";

  Object.keys(carrinho).forEach(nome => {
    let item = carrinho[nome];
    total += item.preco * item.quantidade;

    let li = document.createElement("li");
    li.innerHTML = `${nome} - R$${item.preco} x ${item.quantidade} 
      <button class="quantidade-btn" onclick="modificarQuantidade('${nome}', -1)">-</button>
      <button class="quantidade-btn" onclick="modificarQuantidade('${nome}', 1)">+</button>`;
    listaCarrinho.appendChild(li);
  });

  document.getElementById("cart-count").textContent =
    Object.values(carrinho).reduce((acc, item) => acc + item.quantidade, 0);
  document.getElementById("total").textContent = total.toFixed(2);
}

function modificarQuantidade(nome, modificacao) {
  if (carrinho[nome]) {
    carrinho[nome].quantidade += modificacao;
    if (carrinho[nome].quantidade <= 0) {
      delete carrinho[nome];
    }
  }
  atualizarCarrinho();
}

function mostrarCarrinho() {
  document.getElementById("modalCarrinho").style.display = "block";
}

function fecharCarrinho() {
  document.getElementById("modalCarrinho").style.display = "none";
}

function finalizarCompra() {
  let itens = Object.keys(carrinho).map(nome => ({
    nome,
    quantidade: carrinho[nome].quantidade,
    preco: carrinho[nome].preco
  }));

  fetch("/api/enviar-pedido", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itens })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        alert("Pedido enviado com sucesso!");
        carrinho = {};
        atualizarCarrinho();
        fecharCarrinho();
      } else {
        alert("Erro ao enviar pedido");
      }
    })
    .catch(() => alert("Erro de conexão"));
}

window.onclick = function(event) {
  let modal = document.getElementById("modalCarrinho");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
