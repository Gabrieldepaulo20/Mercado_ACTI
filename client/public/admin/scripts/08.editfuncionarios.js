const buttonApagar = document.querySelector('#apagarFuncionario');
const button_atualizar = document.querySelector('#button_atualizar');

const ativoCheckbox = document.getElementById('status_ativo');
const desativoCheckbox = document.getElementById('status_desativado');

//Busca dados do funcionario que será editado --->
const editData = JSON.parse(sessionStorage.getItem('editData'));
const nomeInput = document.querySelector('#nome_edit');
const sobrenomeInput = document.querySelector('#lastname_edit');
const emailInput = document.querySelector('#email_edit');
const numberInput = document.querySelector('#number_edit');
const statusInput = document.querySelector('#status');

const nomee = editData.nome.indexOf(' ')
nomeInput.value = editData.nome.slice(0, nomee);;
sobrenomeInput.value = editData.nome.slice(nomee + 1);;
emailInput.value = editData.email;
numberInput.value = editData.contato;
if(editData.status == 'ativo') ativoCheckbox.checked = true;
else desativoCheckbox.checked = true;

// <--- FIM


ativoCheckbox.addEventListener('change', () => {
    if (ativoCheckbox.checked) {
        desativoCheckbox.checked = false;
    }
});

desativoCheckbox.addEventListener('change', () => {
    if (desativoCheckbox.checked) {
        ativoCheckbox.checked = false;
    }
});


buttonApagar.addEventListener('click', (e) => {
    e.preventDefault();
    // Verifica se realmente quer excluir os dados do usuario
    const popUp2 = document.querySelector('#popup2');
    const btnConfirma = document.querySelector('.apagar-btn');
    const btnCancelar = document.querySelector('.cancelar');
    popUp2.style.display = "flex"; // Torna visivel o popup de confimação

    btnConfirma.addEventListener('click', (e) =>{
        e.preventDefault()
        popUp2.style.display = 'none';
        apagaUsuario(); // Chama a função que apaga o usuario com base no e-mail
    })
    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/funcionarios/editar'
    })
})

function apagaUsuario(){
    const email = document.getElementById('email_edit').value;
    fetch(`/delete?email_user=${encodeURIComponent(email)}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir o usuário');
        }
        return response.json();
    })
    .then(data => {
        popup(data.message); // Exibe o popup de confirmação
    })
    .catch(error => {
        alert('Erro ao excluir o usuário!');
    });
}

// Essa função ou evento realiza a atualização dos dados do usuário, porém ainda iremos entrar em validação de como ela irá funcionar corretamente.
button_atualizar.addEventListener('click', (e) => {

    e.preventDefault();
    const form = document.querySelector('#formulario');
    const formatandoDados = new FormData(form);

    const dados = {
        nome: formatandoDados.get('nome_user'),
        sobrenome: formatandoDados.get('sobrenome_user'),
        email: formatandoDados.get('email_user'),
        telefone: formatandoDados.get('tel_user'),
        status_ativo: formatandoDados.get('ativo'),
        status_desativo: formatandoDados.get('desativo')
    }


    fetch('/atualizando', {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados');
        }
        return response.json();
    })
    .then(data => {
        popup(data.message)
    })
    .catch(error => {
        console.error('Erro:', error);
    });

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
    btnClose.style.display = 'none';
    if(mensagem.includes('sucesso')){
      icon.innerHTML = 'task_alt';
      btnBack.style.display = '';
    }else{
      icon.innerHTML = 'cancel';
      btnBack.style.display = 'none'
    }
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/funcionarios'
    })
}

