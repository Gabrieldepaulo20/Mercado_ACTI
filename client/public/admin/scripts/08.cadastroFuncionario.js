// Selecionando form
const buttonCadastro = document.querySelector('#cadastroFuncionario');
const nomeInput = document.querySelector('#name');
const sobrenomeInput = document.querySelector('#lastname');
const emailInput = document.querySelector('#email');
const telInput = document.querySelector('#number');
const senhaInput = document.querySelector('#password');
const nsenhaInput = document.querySelector('#checkPassword');

buttonCadastro.addEventListener('click', (e) => {
    e.preventDefault();

    const form = document.querySelector('#formularioFuncionario');
    const formatandoDados = new FormData(form);

    const dados = {
        nome: formatandoDados.get('nome'),
        sobreNome: formatandoDados.get('sobrenome'),
        email: formatandoDados.get('email'),
        number: formatandoDados.get('number'),
        senha: formatandoDados.get('senha'),
        confirmarSenha: formatandoDados.get('confirmarSenha'),
        tipo_user: formatandoDados.get('tipoUser')
    }

    fetch('/funcionarios/cadastro', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then ( response => {
        if(!response.ok) {
            throw new Error('Erro ao enviar dados')
        }
        return response.json();
    })
    .then(data => {
        popup(data.message);
    })
    .catch(error => {
        console.error(error);
    })
})

function popup(mensagem){
    const popUp = document.querySelector('#popup');
    popUp.style.display = 'flex'; // Torna o popup visivel
  
    //Seleciona os itens do popup
    const btnClose = document.querySelector('.close-btn');
    const btnBack = document.querySelector('.back-btn');
    const icon = document.querySelector('.icon');
    const message = document.querySelector('.message');
    message.innerHTML = mensagem; // Exibe mensagem de retorno
    
    if(mensagem == 'Funcionário cadastrado com sucesso!'){
      icon.innerHTML = 'task_alt';
      btnBack.style.display = '';
    }else{
      icon.innerHTML = 'cancel';
      btnBack.style.display = 'none';
    }
  
    btnClose.addEventListener('click', (e) =>{
      popUp.style.display = 'none';
    })
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/funcionarios'
    })
}




