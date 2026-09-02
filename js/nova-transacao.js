let tipoSelecionado = "receita";

// RECEITA / DESPESA

document.addEventListener("DOMContentLoaded", function () {

```
const botoesTipo =
    document.querySelectorAll(".tipo-btn");

botoesTipo.forEach(function (botao) {

    botao.addEventListener("click", function () {

        botoesTipo.forEach(function (item) {

            item.classList.remove("ativo");

        });

        botao.classList.add("ativo");

        tipoSelecionado =
            botao.dataset.tipo;

    });

});


// COLOCAR DATA ATUAL

const campoData =
    document.getElementById("data");

if (campoData) {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    campoData.value =
        ano + "-" + mes + "-" + dia;

}
```

});

// SALVAR TRANSAÇÃO

async function salvarTransacao() {

```
const botao =
    document.getElementById("btn-salvar");


botao.innerHTML =
    "Salvando...";


botao.disabled = true;


if (!supabaseClient) {

    alert(
        "Supabase não está conectado."
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


// USUÁRIO

const resultadoUsuario =
    await supabaseClient.auth.getUser();


if (resultadoUsuario.error) {

    alert(
        "Erro ao verificar usuário:\n\n" +
        resultadoUsuario.error.message
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


const usuario =
    resultadoUsuario.data.user;


if (!usuario) {

    alert(
        "Você precisa estar logado."
    );

    window.location.href =
        "login.html";

    return;

}


// CAMPOS

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


// VALIDAÇÃO

if (!descricao) {

    alert(
        "Digite uma descrição."
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


if (!valor || valor <= 0) {

    alert(
        "Digite um valor válido."
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


if (!categoria) {

    alert(
        "Selecione uma categoria."
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


if (!data) {

    alert(
        "Selecione uma data."
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


// TRANSAÇÃO

const novaTransacao = {

    usuario_id:
        usuario.id,

    tipo:
        tipoSelecionado,

    descricao:
        descricao,

    valor:
        valor,

    categoria:
        categoria,

    data:
        data

};


console.log(
    "Salvando:",
    novaTransacao
);


// SUPABASE

const resultado =
    await supabaseClient
        .from("transacoes")
        .insert([
            novaTransacao
        ]);


// ERRO

if (resultado.error) {

    console.error(
        "Erro Supabase:",
        resultado.error
    );

    alert(
        "ERRO AO SALVAR:\n\n" +
        resultado.error.message
    );

    botao.disabled = false;

    botao.innerHTML =
        '<i class="fa-solid fa-check"></i> Salvar Transação';

    return;

}


// SUCESSO

alert(
    "Transação salva com sucesso!"
);


window.location.href =
    "index.html";
```

}
