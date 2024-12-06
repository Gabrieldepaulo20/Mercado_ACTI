const bcryptjs = require('bcryptjs');

async function cadastrarUsuario(username, senha) {
  try {
    const hash = await bcryptjs.hash(senha, 8);
    console.log('Senha criptografada:', hash);
    return hash; // Agora a função retorna o hash
  } catch (err) {
    console.error('Erro ao criptografar senha:', err);
  }
}

async function loginUsuario(username, senha, hashArmazenado) {
  try {
    const resultado = await bcryptjs.compare(senha, hashArmazenado);
    console.log('A senha corresponde?', resultado);
    if (resultado) {
      console.log('Login bem-sucedido!');
    } else {
      console.log('Senha incorreta.');
    }
  } catch (err) {
    console.error('Erro ao comparar senha:', err);
  }
}

// Exemplo de uso:
(async () => {
  const hashGerado = await cadastrarUsuario('usuario1', 'minhasenha'); // Gerar e pegar o hash
  await loginUsuario('usuario1', 'minhasenha', hashGerado); // Comparar com a senha correta
})();

