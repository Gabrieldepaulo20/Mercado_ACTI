const emailUSer = getCookie('email');

fetch(`/pesquisa/${emailUSer}`)
.then(response => {
    if (!response.ok) throw new Error('Erro ao buscar os dados');
    return response.json();
})
.then(data => {
    carregaDados(data);
}) //Chama a função que constroi a tabela e exibe os produtos encontrados
.catch(error => console.error('Erro:', error));

function carregaDados(dados){
    // selecionando elementos do HTML
    const inputNome = document.querySelector('#input-name');
    const inputEmail = document.querySelector('#input-email');
    const inputSenha = document.querySelector('#input-password');
    const inputContato = document.querySelector('#input-contact');

    const usuarios = dados.usuarios;
    if(usuarios.lenght > 1) return;

    inputNome.value = usuarios[0].nome;
    inputEmail.value = usuarios[0].email;
    inputContato.value = usuarios[0].telefone;
}

atualizaDados()
function atualizaDados() {
    const buttonAtualizar = document.querySelector('#atualizar');
    buttonAtualizar.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.querySelector('.form');
        const input = document.querySelectorAll('input');
        const dados = {
            nome: input[0].value,
            email: input[1].value,
            senha: input[2].value,
            telefone: input[3].value,
        }
        fetch('/atualiza/funcionario', {
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
            popup(data.message);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    })
}



// Função que retorna o email
function getCookie(email) {
    const cookie = document.cookie;
    const separandoCookie = cookie.split('; ');
    for( let buscando of separandoCookie) {
        const [cookieNome, cookieValor] = buscando.split('=');
        if(cookieNome === email) {
            return decodeURIComponent(cookieValor);
        }
    }
    return null
}

// Realizando a seleção de elementos da página
const buttonLogout = document.querySelector('#logoutIcon');

// Realiza o logout do sistema

buttonLogout.addEventListener('click', () => {
    sessionStorage.removeItem('store');
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => {
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Erro ao fazer logout:', error);
    });
});

// função
function popup(mensagem){
    console.log(mensagem)
    const popUp = document.querySelector('.popup');
    document.querySelector('.message').textContent = mensagem
    popUp.style.display = 'flex'; // Torna o popup visivel
  
    //Seleciona os itens do popup
    const btnconfirmar = document.querySelector('.confirmar');

    btnconfirmar.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/perfil'
    })
}

