const buttonEntrada = document.querySelector('#entradaProduto');

fetch('/entradas/produtos')
.then(response => {
  if(!response.ok) {
    throw new Error('Erro ao buscar os dados');
  }
  return response.json();
})
.then(data => {

  let entrada_produtos = data.entradas

  let i = 0;
  const ul = document.querySelector('#tabelaProdutos')

  for(let i=entrada_produtos.length-1; i>=0; i--){
    let tr = document.createElement('tr');

    let  td_nome_produto = document.createElement('td');
    td_nome_produto.setAttribute('id', 'id_nome_prod');
    let  td_data_produto = document.createElement('td');
    td_data_produto.setAttribute('id', 'id_data_prod');
    let  td_preco_total_produto = document.createElement('td');
    td_preco_total_produto.setAttribute('id', 'id_preco_total_prod');
    let  td_preco_unit_produto = document.createElement('td');
    td_preco_unit_produto.setAttribute('id', 'id_preco_unit_prod');
    let  td_qtd_comp_prod = document.createElement('td');
    td_qtd_comp_prod.setAttribute('id', 'id_qtd_comp_prod');
   
    // tranformando a data em valor válido.
    let transformando_data = new Date(entrada_produtos[i].data_entrada).toLocaleDateString()

    td_nome_produto.innerHTML = entrada_produtos[i].nome_produto
    td_data_produto.innerHTML = transformando_data
    td_preco_total_produto.innerHTML =  `R$ ${entrada_produtos[i].preco_total}`
    td_preco_unit_produto.innerHTML = `R$ ${entrada_produtos[i].preco_unitario}`
    td_qtd_comp_prod.innerHTML = entrada_produtos[i].qtd_comprada

    tr.appendChild(td_nome_produto)
    tr.appendChild(td_data_produto)
    tr.appendChild(td_qtd_comp_prod)
    tr.appendChild(td_preco_unit_produto)
    tr.appendChild(td_preco_total_produto)

      if (i % 2 == 0) {
        tr.setAttribute('class', 'linha-par');
      } else {
        tr.setAttribute('class', 'linha-impar');
      }

      ul.appendChild(tr);
  }

})
.catch(error => {
  console.error("Erro:", error);
});

// <-- FIM

// <-- FIM 

function atribuirValorTotal(listaProdutos) {
  for (let i = 0; i < listaProdutos.length; i++) {
    listaProdutos[i].valorTotal = (listaProdutos[i].quantidade * listaProdutos[i].preco);
  }
}

function filtrar() {
  var input,
    ul,
    tr,
    td_nome_produto;

  input = document.querySelector('#searchbar');
  ul = document.querySelector('#tabelaProdutos');

  filter = input.value.toUpperCase();
  tr = ul.getElementsByTagName("tr");

  // Esconde todas as linhas da tabela
  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = 'none'; 
  }

  // Mostra as linhas que correspondem à pesquisa
  for (let i = 1; i < tr.length; i++) {
    td_nome_produto = tr[i].querySelector('#id_nome_prod').innerHTML;

    if (td_nome_produto.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
  }
}
