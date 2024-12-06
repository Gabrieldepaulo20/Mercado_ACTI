const mysql = require('../aa.db').pool; // chamando as credenciais do banco de dados;
const path = require('path');
const data = new Date().toISOString(); // PEgando a data no formatado desejado para o banco;

exports.cadastrandoProduto = (req, res, next) => {

    const { nome, codigo, valor, tipo_produto } = req.body;

    mysql.getConnection((err, conn) => {
        if (err) return res.json({ message: "Erro ao conectar ao banco de dados...." });

        if(!nome || !codigo || !valor){
            return res.json({message: "Todos os campos (nome, código e valor) devem ser preenchidos."});  
        }

        const query = `SELECT * FROM tbl_Produto WHERE nome_Prd = ?;`

        conn.query(query, [nome], (err, result) => {
            conn.release();
            if (err) return res.json({ message: "Erro ao conectar ao banco de dados..." });

            if (result.length > 0) return res.json({ message: "Já existe um produto cadastrado com este nome no sistema." });

            const query = `SELECT * FROM tbl_Produto WHERE cod_Prd = ?;`

            conn.query(query, [codigo], (err, result) => {
                if (err) return res.json({ message: "Erro ao conectar ao banco de dados....." });

                if(result.length > 0) return res.json( {message: "Já existe um produto cadastrado com este código no sistema." })

                mysql.getConnection((err, conn) => {
                    conn.release();
                    if (err) return res.json({ message: "Erro ao conectar ao banco de dados" });
                    const query = `INSERT INTO tbl_Produto (cod_Prd, nome_Prd, vlr_Unit, qtd_TotProduto, tipo_produto) VALUES(?,?,?,?,?);`
                    conn.query(query, [codigo, nome, valor, 0, tipo_produto], (err, results) => {

                        if (err) return res.json({ message: "Erro ao conectar ao banco de dados.." });

                        return res.json({ message: "Produto cadastrado com sucesso!" });
                    })
                })

            })

        })
    })
}

exports.deletandoProduto = (req, res, next) => {

    const { nome, codigo, valor } = req.body;
    
    mysql.getConnection((err, conn) => {
        conn.release();
        if(err) return res.json({message: "Erro ao conectar no banco de dados!"})

        if(!codigo){
            return res.json({message: `O campo "Código" é obrigatório para realizar a exclusão do produto.`});  
        }

        const query = `SELECT * FROM tbl_Produto WHERE cod_Prd = ?;`

        conn.query(query, [codigo], (err, result) => {
            if (err) return res.json({ message: "Erro ao conectar ao banco de dados" });

            if(result.length == 0) return res.json({ message: "Nenhum produto encontrado com este código"});

            mysql.getConnection((err, conn) => {
                conn.release();

                if (err) return res.json({ message: "Erro ao conectar ao banco de dados" });

                const query = `DELETE FROM tbl_Produto WHERE cod_Prd = ?;`

                conn.query(query, [codigo], (err, result) => {
                    if (err) return res.json({ message: "Erro ao conectar ao banco de dados" });

                    return res.json({message: "Produto excluido com sucesso"})
                    
                })

            })

        })
        
    })

}

exports.chamandoProduto = (req, res, next) => {

    mysql.getConnection((err, conn) => {
        if (err) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '02.cadastrarProdutos.html'), { message: "Erro ao conectar com o banco de dados" });

        const query = `SELECT * FROM tbl_Produto;`;

        conn.query(query, (err, result) => {
            conn.release();
            if (err) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '02.cadastrarProdutos.html'), { message: "Erro ao conectar com o banco de dados" });

            if (result.length == 0) return res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'pages', '02.cadastrarProdutos.html'), { message: "Ainda nenhum produto foi cadastrado" });

            const response = {
                quantidade: result.length,
                produtos: result.map(prod => {
                    return {
                        cod_Prd: prod.cod_Prd,
                        nome_Prd: prod.nome_Prd,
                        qtd_TotProduto: prod.qtd_TotProduto,
                        vlr_Unit: prod.vlr_Unit,
                        tipo_produto: prod.tipo_produto
                    }
                })
            }

            return res.json(response);
        })
    })
}

exports.chamandoProdutoEspec = (req, res, next) => {

    const tipoProduto = req.body.tipoProduto; 

    const query = `SELECT * FROM tbl_Produto WHERE nome_Prd = ?;`

    mysql.getConnection((err, conn) => {
        if(err) return res.json({message: "Erro ao conectar com o banco de dados"});

        if(!tipoProduto) return res.json({message: "Nenhum produto foi selecionado!"});

        conn.query(query, [tipoProduto], (err, result) => {
            conn.release();

            if(err) return res.json({message: "Erro ao conectar com o banco de dados!!" });

            if( result.length == 0) return res.json({message: "Produto não localizado em nosso sistema!"});

            const response = {
                quantidade: result.length,
                produto: result.map(prod => {
                    return {
                        cod_Prd: prod.cod_Prd,
                        qtd_Prd: prod.qtd_TotProduto
                    }
                })
            }

            return res.json(response);
            
        })
    })

}

exports.atualizandoProdutoPreco = (req, res, next) => {

    const { nome, codigo, valor } = req.body;

    mysql.getConnection((err, conn) => {
        if (err) return res.json({ message: "Erro ao conectar ao banco de dados" });

        if(!valor){
            return res.json({message: "Por favor o campo de valor!"});  
        }

        const query = `SELECT * FROM tbl_Produto WHERE cod_Prd = ?;`

        conn.query(query, [codigo], (err, result) => {
            conn.release();

            if(err) return res.json({message: "Erro ao conectar com o banco de dados" });

            if (result.length == 0) return res.json({ message: "Produto não localizado em nosso sistema!" });
            
            const query = ` UPDATE tbl_Produto
            SET vlr_Unit = ?
            WHERE cod_Prd = ?;
            `
            mysql.getConnection((err, conn) => {
                if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

                conn.query(query, [valor, codigo] , (err, result) => {

                    if (err) return res.json({message: "Erro ao tentar atualizar o produto!"});

                    if(result.affectedRows == 0) return res.json({message: "nenhum produto sofreu atualização!"});

                    return res.json({message: "Produto atualizado com sucesso!"})

                })
            })

        })

    })
}

exports.realizandoCompra = (req, res, next) => {

    const tipoProduto = req.body.tipoProduto; 
    const qtd_produto = req.body.qtd_Prd; 

    mysql.getConnection((err, conn) => {

        if (err) return res.json({ message: "Erro ao conectar ao banco de dados" });

        if(!tipoProduto){
            return res.json({message: "Error campo invalido!"});  
        }

        const query = `SELECT * FROM tbl_Produto WHERE nome_Prd = ?;`

        conn.query(query, [tipoProduto], (err, result) => {
            conn.release();

            if(err) return res.json({message: "Erro ao conectar com o banco de dados" });

            if (result.length == 0) return res.json({ message: "Produto não localizado em nosso sistema!" });
            
            const query = ` UPDATE tbl_Produto
            SET qtd_TotProduto = qtd_TotProduto - ?
            WHERE nome_Prd = ?;`

            mysql.getConnection((err, conn) => {
                if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

                conn.query(query, [qtd_produto, tipoProduto] , (err, result) => {

                    if (err) return res.json({message: "Erro ao tentar atualizar o produto!"});

                    if(result.affectedRows == 0) return res.json({message: "nenhum produto sofreu atualização!"});

                    return res.json({message: "Produto atualizado com sucesso!"})

                })
            })
        })

    })
}

exports.cadastrandoPedidoRealizado = (req, res, next) => {

    const {nome, email, tipo_pagamento, valor_compra, produtos_solicitados} = req.body.request  

    mysql.getConnection((err, conn) => {

        if(err) return res.json({message: "Erro ao conectar com o banco de dados"});

        const query = `SELECT MAX(id) AS last_id FROM pedidos_realizados;`

        conn.query(query, (err, result) => {

            if(err) return res.json({message: "Erro ao conectar com o banco de dados!!" });

            let codigo_pedido = result[0].last_id

            for(let i=0; i<produtos_solicitados.length; i++){

                let tipoProduto = produtos_solicitados[i].nome_produto;
                let qtd_comprada = produtos_solicitados[i].qtd_comprada;

                const query = `SELECT * FROM tbl_Produto WHERE nome_Prd = ?;`
            
                conn.query(query, [tipoProduto], (err, result) => {
                    conn.release();

                    if(err) return res.json({message: "Erro ao conectar com o banco de dados!!" });
                    
                    if( result.length == 0) return res.json({message: "Produto não localizado em nosso sistema!"});

                    let codigo_produto = result[0].cod_Prd;
                    let preco_produto = result[0].vlr_Unit;

                    let calculando_vlr_total_prod = preco_produto * produtos_solicitados[i].qtd_comprada;

                    const query = `INSERT INTO tbl_saida (codigo_pedido, codigo_produto, data_saida, forma_pagamento ,funcionario, qtd_comprada, valor_compra, nome_produto) VALUES(?,?,?,?,?,?,?,?);`
                    
                    conn.query(query, [codigo_pedido, codigo_produto, data, tipo_pagamento, nome, qtd_comprada, calculando_vlr_total_prod, tipoProduto], (err, result) => {
                        conn.release();

                        if(err) return res.json({message: "Erro ao conectar com o banco de dados!!" });

                    })
                    
                })
            }

        })

    })
}

