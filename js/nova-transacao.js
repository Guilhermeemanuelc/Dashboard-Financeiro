let tipoSelecionado = "receita";


// RECEITA / DESPESA

document.addEventListener("DOMContentLoaded", function () {

    const botoesTipo = document.querySelectorAll(".tipo-btn");

    botoesTipo.forEach(function (botao) {

        botao.addEventListener("click", function () {

            botoesTipo.forEach(function (item) {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            tipoSelecionado = botao.dataset.tipo;

        });

    });


    // DATA ATUAL

    const campoData = document.getElementById("data");

    if (campoData) {

        const hoje = new Date();

        const ano = hoje.getFullYear();

        const mes = String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            hoje.getDate()
        ).padStart(2, "0");

        campoData.value =
            ano + "-" + mes + "-" + dia;

    }

});


// SALVAR TRANSAÇÃO

async function salvarTransacao() {

    const botao =
        document.getElementById("btn-salvar");


    if (!botao) {
        console.error("Botão salvar não encontrado.");
        return;
    }


    botao.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    botao.disabled = true;


    if (!supabaseClient) {

        alert("Supabase não está conectado.");

        restaurarBotao(botao);

        return;
    }


    const resultadoUsuario =
        await supabaseClient.auth.getUser();


    if (resultadoUsuario.error) {

        alert(
            "Erro ao verificar usuário:\n\n" +
            resultadoUsuario.error.message
        );

        restaurarBotao(botao);

        return;
    }


    const usuario =
        resultadoUsuario.data.user;


    if (!usuario) {

        alert("Você precisa estar logado.");

        window.location.href = "login.html";

        return;
    }


    const descricao =
        document
            .getElementById("descricao")
            .value
            .trim();


    const valor =
        Number(
            document
                .getElementById("valor")
                .value
        );


    const categoria =
        document
            .getElementById("categoria")
            .value;


    const data =
        document
            .getElementById("data")
            .value;


    if (!descricao) {

        alert("Digite uma descrição.");

        restaurarBotao(botao);

        return;
    }


    if (!valor || valor <= 0) {

        alert("Digite um valor válido.");

        restaurarBotao(botao);

        return;
    }


    if (!categoria) {

        alert("Selecione uma categoria.");

        restaurarBotao(botao);

        return;
    }


    if (!data) {

        alert("Selecione uma data.");

        restaurarBotao(botao);

        return;
    }


    const novaTransacao = {

        usuario_id: usuario.id,

        tipo: tipoSelecionado,

        descricao: descricao,

        valor: valor,

        categoria: categoria,

        data: data

    };


    console.log(
        "Enviando transação:",
        novaTransacao
    );


    const resultado =
        await supabaseClient
            .from("transacoes")
            .insert([novaTransacao]);


    if (resultado.error) {

        console.error(
            "Erro ao salvar:",
            resultado.error
        );

        alert(
            "ERRO AO SALVAR:\n\n" +
            resultado.error.message
        );

        restaurarBotao(botao);

        return;
    }


    console.log(
        "Transação salva com sucesso!"
    );


    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvo com sucesso!';


    setTimeout(function () {

        window.location.href =
            "../index.html";

    }, 1000);

}


function restaurarBotao(botao) {

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

}

