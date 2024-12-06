// Relatorios dos pedidos   
fetch('/saida/produto')
.then(response => {
  if (!response.ok) throw new Error('Erro ao buscar os dados');
  return response.json();
})
.then(data => {
  construirTabela(data);
  exportarTabela(data);
})
.catch(error => console.error('Erro:', error));

function construirTabela(dados){
  if(dados.quantidade <= 0) return;
  let i = 0;
  produtos = dados.produtos;
  const template = document.querySelector('#produto-template');
  const tabela = document.querySelector('#tabelaProdutos');

  for(let i=produtos.length-1; i>=0; i--){
    let transformando_data = new Date(produtos[i].data_saida).toLocaleDateString()

    const td = template.content.cloneNode(true);  // Clona o conteúdo do template
    td.querySelector('#codigo_produto').textContent = produtos[i].codigo_produto
    td.querySelector('#codigo_venda').textContent = produtos[i].codido_pedido;
    td.querySelector('#funcionario').textContent = produtos[i].funcionario;
    td.querySelector('#produto').textContent = produtos[i].nome_produto;
    td.querySelector('#data_saida').textContent = transformando_data;
    td.querySelector('#qtd').textContent = produtos[i].qtd_comprada;
    td.querySelector('#valorCompra').textContent = produtos[i].valor_compra;
    td.querySelector('#forma_pgto').textContent = produtos[i].forma_pagamento;

    let tr = td.querySelector('tr');
    tabela.appendChild(tr); // Adiciona a linha à tabela
    if (i % 2 == 0) tr.setAttribute('class', 'linha-par');
    else tr.setAttribute('class', 'linha-impar');
  }
 
}

function exportarTabela(dados){
  produtos = dados.produtos;
  document.getElementById('exportarExcel').addEventListener('click', function() {
    // Converter tabela para uma planilha (workbook)
    const planilha = XLSX.utils.json_to_sheet(produtos);
    const arquivoExcel = XLSX.utils.book_new();

    // Adiciona a planilha no arquivo criado com um nome
    XLSX.utils.book_append_sheet(arquivoExcel, planilha, 'produtos 1');

    // Gerar o arquivo Excel e faz o download
    XLSX.writeFile(arquivoExcel, 'produtos.xlsx');
  })
} 

function filtrar() {
  let input,tabela,tr;
  input = document.querySelector('#searchbar');
  tabela = document.querySelector('#tabelaProdutos');
  filter = input.value.toUpperCase();
  tr = tabela.getElementsByTagName("tr");

  // Esconde todas as linhas da tabela
  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = 'none'; 
  }

  // Mostra as linhas que correspondem à pesquisa
  for (let i = 1; i < tr.length; i++) {
    td_funcionario = tr[i].querySelector('#funcionario').innerHTML;
    td__produto = tr[i].querySelector('#produto').innerHTML;
    if (td_funcionario.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
    if (td__produto.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
  }
}


