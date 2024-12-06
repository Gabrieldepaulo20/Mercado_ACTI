// Realizando a seleção de elementos da página
const buttonCadastro = document.querySelector('#cadastrar-produto');
const buttonExcluir = document.querySelector('#excluir-produto');
const prod_nome = document.querySelector('#name');
const prod_codigo = document.querySelector('#codigo');
const prod_valor = document.querySelector('#valor');

//Trata os campo input que recebem numeros(codigo e preço unitario)
prod_codigo.addEventListener('input', (e) => {
  let value = prod_codigo.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  prod_codigo.value = value;
})
prod_valor.addEventListener('input', (e) => {
  let value = prod_valor.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  value = value.replace(/(\d{2})$/, '.$1'); // Adiciona a virgula como separador de decimal
  value = value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); //Adiciona ponto de separador de milhar
  prod_valor.value = 'R$ ' + value;
});

// Envia o formulário de histórico de pedidos para o banco de dados, o qual será exibido no front-end.
buttonCadastro.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.querySelector('#formularioProduto');
      const formatandoDados = new FormData(form);
      const valorFormatado = formatandoDados.get('valor').replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'); // Remove o prefixo e formata o valor como número

      const dados = {
        nome: formatandoDados.get('nome'),
        codigo: formatandoDados.get('codigo'),
        valor: valorFormatado,
        tipo_produto: formatandoDados.get('tipoProduto')
      }

      fetch('/cadastrando/produto', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      })
      .then ( response => {
        if(!response.ok) {
          throw new Error('Erro no envio de dados')
        }
        return response.json();
      })
      .then(data => {
          popup(data.message);
      })
      .catch(error => {
        console.error(error);
      });
})

// <-- FIM
function popup(mensagem){
  const popUp = document.querySelector('#popup');
  popUp.style.display = 'flex'; // Torna o popup visivel

  //Seleciona os itens do popup
  const btnClose = document.querySelector('.close-btn');
  const btnBack = document.querySelector('.back-btn');
  const icon = document.querySelector('.icon');
  const message = document.querySelector('.message');
  message.innerHTML = mensagem; // Exibe mensagem de retorno

  
  if(mensagem.includes('sucesso')){
    icon.innerHTML = 'task_alt';
    btnBack.style.display = '';
  }else{
    icon.innerHTML = 'cancel';
    btnBack.style.display = 'none';
    prod_nome.value = '';
    prod_codigo.value = '';
    prod_valor.value = '';
  }

  btnClose.addEventListener('click', (e) =>{
    popUp.style.display = 'none';
  })
  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/tabela/produto'
  })
}















