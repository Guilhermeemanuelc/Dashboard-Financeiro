async function carregarDashboard() {


if (!supabaseClient) {

    console.error("Supabase nao configurado.");
    return;

}


// =========================================
// VERIFICAR SESSÃO DO USUÁRIO
// =========================================

const resultadoSessao =
    await supabaseClient.auth.getSession();


if (resultadoSessao.error) {

    console.error(
        "Erro ao verificar usuario:",
        resultadoSessao.error
    );

    return;

}


const session =
    resultadoSessao.data.session;


if (!session) {

    window.location.href = "paginas/login.html";

    return;

}


const usuario =
    session.user;


console.log(
    "Usuario conectado:",
    usuario.id
);


// =========================================
// BUSCAR TRANSAÇÕES DO USUÁRIO
// =========================================

const resultado =
    await supabaseClient
        .from("transacoes")
        .select("*")
        .eq("usuario_id", usuario.id)
        .order("data", {
            ascending: false
        });


if (resultado.error) {

    console.error(
        "Erro ao buscar transacoes:",
        resultado.error
    );

    return;

}


const transacoes =
    resultado.data || [];


console.log(
    "Transacoes encontradas:",
    transacoes
);


// =========================================
// CALCULAR RECEITAS E DESPESAS
// =========================================

let receitas = 0;

let despesas = 0;


transacoes.forEach(function(transacao) {

    const valor =
        Number(transacao.valor) || 0;


    if (transacao.tipo === "receita") {

        receitas += valor;

    }


    if (transacao.tipo === "despesa") {

        despesas += valor;

    }

});


// =========================================
// CALCULAR LUCRO E SALDO
// =========================================

const lucro =
    receitas - despesas;


const saldo =
    receitas - despesas;


// =========================================
// ELEMENTOS DOS CARDS
// =========================================

const receitasElemento =
    document.getElementById("total-receitas");


const despesasElemento =
    document.getElementById("total-despesas");


const lucroElemento =
    document.getElementById("total-lucro");


const saldoElemento =
    document.getElementById("total-saldo");


// =========================================
// ATUALIZAR CARDS
// =========================================

if (receitasElemento) {

    receitasElemento.textContent =
        formatarMoeda(receitas);

}


if (despesasElemento) {

    despesasElemento.textContent =
        formatarMoeda(despesas);

}


if (lucroElemento) {

    lucroElemento.textContent =
        formatarMoeda(lucro);

}


if (saldoElemento) {

    saldoElemento.textContent =
        formatarMoeda(saldo);

}


// =========================================
// MOSTRAR TRANSAÇÕES RECENTES
// =========================================

mostrarTransacoes(transacoes);


}

// =========================================
// FORMATAR VALOR EM REAL
// =========================================

function formatarMoeda(valor) {


return Number(valor || 0).toLocaleString(
    "pt-BR",
    {
        style: "currency",
        currency: "BRL"
    }
);


}

// =========================================
// MOSTRAR TRANSAÇÕES
// =========================================

function mostrarTransacoes(transacoes) {


const lista =
    document.getElementById(
        "lista-transacoes"
    );


if (!lista) {

    return;

}


lista.innerHTML = "";


// =========================================
// NENHUMA TRANSAÇÃO
// =========================================

if (transacoes.length === 0) {

    const mensagem =
        document.createElement("div");


    mensagem.className =
        "sem-transacoes";


    mensagem.textContent =
        "Nenhuma transacao encontrada.";


    lista.appendChild(
        mensagem
    );


    return;

}


// =========================================
// PEGAR AS 5 MAIS RECENTES
// =========================================

const recentes =
    transacoes.slice(0, 5);


recentes.forEach(function(transacao) {

    // =====================================
    // ITEM
    // =====================================

    const item =
        document.createElement("div");


    item.className =
        "transacao-item";


    // =====================================
    // INFORMAÇÕES
    // =====================================

    const info =
        document.createElement("div");


    info.className =
        "transacao-info";


    // =====================================
    // DESCRIÇÃO
    // =====================================

    const descricao =
        document.createElement("strong");


    descricao.textContent =
        transacao.descricao ||
        "Sem descricao";


    // =====================================
    // CATEGORIA
    // =====================================

    const categoria =
        document.createElement("span");


    categoria.textContent =
        transacao.categoria ||
        "Sem categoria";


    info.appendChild(
        descricao
    );


    info.appendChild(
        categoria
    );


    // =====================================
    // VALOR
    // =====================================

    const valorElemento =
        document.createElement("div");


    valorElemento.className =
        "transacao-valor " +
        transacao.tipo;


    const valor =
        Number(transacao.valor) || 0;


    const sinal =
        transacao.tipo === "receita"
            ? "+"
            : "-";


    valorElemento.textContent =
        sinal + " " +
        formatarMoeda(valor);


    // =====================================
    // MONTAR ITEM
    // =====================================

    item.appendChild(
        info
    );


    item.appendChild(
        valorElemento
    );


    lista.appendChild(
        item
    );

});


}

// =========================================
// INICIAR DASHBOARD
// =========================================

document.addEventListener(
"DOMContentLoaded",
function() {


    carregarDashboard();

}


);
