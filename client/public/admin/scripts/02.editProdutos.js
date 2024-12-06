// Selecionando os elementos para puxar as info do funcionario que será editado
const editData = JSON.parse(sessionStorage.getItem('editData'));
const nomeInput = document.querySelector('#name');
const codigoInput = document.querySelector('#codigo');
const valorInput = document.querySelector('#valor');
const buttonAtt = document.querySelector('#cadastrar-produto');

nomeInput.value = editData.produto;
codigoInput.value = editData.codigo;
valorInput.value = editData.valor;
// FIM
valorInput.addEventListener('input', (e) => {
  let value = valorInput.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  value = value.replace(/(\d{2})$/, '.$1'); // Adiciona a virgula como separador de decimal
  value = value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); //Adiciona ponto de separador de milhar
  valorInput.value = 'R$ ' + value;
});

buttonAtt.addEventListener('click', (e) => {
  e.preventDefault();
  const form = document.querySelector('#formularioProduto');
  const formatandoDados = new FormData(form);
  const valorFormatado = formatandoDados.get('valor').replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'); // Remove o prefixo e formata o valor como número

  const dados = {
    nome: formatandoDados.get('nome'),
    codigo: formatandoDados.get('codigo'),
    valor: valorFormatado
  }

  fetch('/atualizando/produto', {
    method: "PATCH",
    headers: {
      'content-Type': 'application/json'
      },
    body: JSON.stringify(dados)
    })
    .then( response => {
      if(!response.ok) {
        throw new Error('Erro no envio de dados')
      }
      return response.json();
    })
    .then( data => {
      popup(data.message);
    })
    .catch(error => {
      console.error(error);
    })

})

//Quando realizar a API de atualizar cadastro de produtos, chamar a função popup
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


