/* =========================================================
   AUTENTICAÇÃO
   Dashboard Financeiro
========================================================= */

/* =========================================================
   CLIENTE SUPABASE

   O cliente é criado pelo supabase.js.

   Este arquivo apenas utiliza:
   supabaseClient
========================================================= */


/* =========================================================
   ELEMENTOS DO LOGIN
========================================================= */

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const btnEntrar = document.getElementById("btn-entrar");
const mensagemLogin = document.getElementById("mensagem-login");
const mostrarSenha = document.getElementById("mostrar-senha");


/* =========================================================
   ELEMENTOS DO CADASTRO
========================================================= */

const cadastroForm = document.getElementById("cadastro-form");
const nomeInput = document.getElementById("nome");
const confirmarSenhaInput = document.getElementById("confirmar-senha");
const btnCadastrar = document.getElementById("btn-cadastrar");
const mensagemCadastro = document.getElementById("mensagem-cadastro");


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

if (mostrarSenha && senhaInput) {

    mostrarSenha.addEventListener("click", () => {

        const senhaVisivel =
            senhaInput.type === "text";

        senhaInput.type =
            senhaVisivel ? "password" : "text";


        const icone =
            mostrarSenha.querySelector("i");

        if (icone) {

            icone.textContent =
                senhaVisivel
                    ? "visibility"
                    : "visibility_off";

        }

    });

}


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagem(elemento, mensagem, tipo = "erro") {

    if (!elemento) {
        return;
    }

    elemento.textContent = mensagem;

    elemento.className =
        `mensagem-login ${tipo}`;

}


function limparMensagem(elemento) {

    if (!elemento) {
        return;
    }

    elemento.textContent = "";

    elemento.className =
        "mensagem-login";

}


/* =========================================================
   ESTADO DO BOTÃO
========================================================= */

function alterarEstadoBotao(botao, carregando) {

    if (!botao) {
        return;
    }

    const texto =
        botao.querySelector(".texto-btn");

    const loading =
        botao.querySelector(".loading-login");


    botao.disabled = carregando;


    if (texto) {

        texto.style.display =
            carregando ? "none" : "inline";

    }


    if (loading) {

        loading.style.display =
            carregando ? "inline-flex" : "none";

    }

}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        limparMensagem(mensagemLogin);


        /* -----------------------------------------
           VERIFICAÇÃO DO SUPABASE
        ----------------------------------------- */

        if (!supabaseClient) {

            mostrarMensagem(
                mensagemLogin,
                "O sistema de autenticação ainda não foi configurado."
            );

            return;

        }


        /* -----------------------------------------
           DADOS DO FORMULÁRIO
        ----------------------------------------- */

        const email =
            emailInput.value.trim();

        const senha =
            senhaInput.value;


        /* -----------------------------------------
           VALIDAÇÃO
        ----------------------------------------- */

        if (!email || !senha) {

            mostrarMensagem(
                mensagemLogin,
                "Preencha o e-mail e a senha."
            );

            return;

        }


        alterarEstadoBotao(
            btnEntrar,
            true
        );


        try {

            /* -------------------------------------
               AUTENTICAÇÃO REAL
            ------------------------------------- */

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,
                    password: senha

                });


            if (error) {

                throw error;

            }


            /* -------------------------------------
               LOGIN REALIZADO
            ------------------------------------- */

            if (!data.session) {

                throw new Error(
                    "Não foi possível criar a sessão."
                );

            }


            mostrarMensagem(
                mensagemLogin,
                "Login realizado com sucesso!",
                "sucesso"
            );


            /* -------------------------------------
               REDIRECIONAMENTO
            ------------------------------------- */

            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Erro no login:",
                error
            );


            mostrarMensagem(
                mensagemLogin,
                traduzirErroAuth(error)
            );


        } finally {

            alterarEstadoBotao(
                btnEntrar,
                false
            );

        }

    });

}


/* =========================================================
   CADASTRO
========================================================= */

if (cadastroForm) {

    cadastroForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        limparMensagem(
            mensagemCadastro
        );


        /* -----------------------------------------
           VERIFICAÇÃO DO SUPABASE
        ----------------------------------------- */

        if (!supabaseClient) {

            mostrarMensagem(
                mensagemCadastro,
                "O sistema de autenticação ainda não foi configurado."
            );

            return;

        }


        /* -----------------------------------------
           DADOS
        ----------------------------------------- */

        const nome =
            nomeInput.value.trim();

        const email =
            emailInput.value.trim();

        const senha =
            senhaInput.value;

        const confirmarSenha =
            confirmarSenhaInput.value;


        /* -----------------------------------------
           VALIDAÇÃO DO NOME
        ----------------------------------------- */

        if (nome.length < 2) {

            mostrarMensagem(
                mensagemCadastro,
                "Digite seu nome completo."
            );

            return;

        }


        /* -----------------------------------------
           VALIDAÇÃO DA SENHA
        ----------------------------------------- */

        if (senha.length < 6) {

            mostrarMensagem(
                mensagemCadastro,
                "A senha precisa ter pelo menos 6 caracteres."
            );

            return;

        }


        /* -----------------------------------------
           CONFIRMAÇÃO
        ----------------------------------------- */

        if (senha !== confirmarSenha) {

            mostrarMensagem(
                mensagemCadastro,
                "As senhas não são iguais."
            );

            return;

        }


        alterarEstadoBotao(
            btnCadastrar,
            true
        );


        try {

            /* -------------------------------------
               CRIA USUÁRIO NO SUPABASE AUTH
            ------------------------------------- */

            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: senha,

                    options: {

                        data: {
                            nome: nome
                        }

                    }

                });


            if (error) {

                throw error;

            }


            /* -------------------------------------
               VERIFICA CONFIRMAÇÃO DE E-MAIL
            ------------------------------------- */

            if (
                data.user &&
                !data.session
            ) {

                mostrarMensagem(
                    mensagemCadastro,
                    "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
                    "sucesso"
                );

                cadastroForm.reset();

                return;

            }


            /* -------------------------------------
               CASO O SUPABASE JÁ CRIE A SESSÃO
            ------------------------------------- */

            if (data.session) {

                mostrarMensagem(
                    mensagemCadastro,
                    "Conta criada com sucesso!",
                    "sucesso"
                );


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            }


        } catch (error) {

            console.error(
                "Erro no cadastro:",
                error
            );


            mostrarMensagem(
                mensagemCadastro,
                traduzirErroAuth(error)
            );


        } finally {

            alterarEstadoBotao(
                btnCadastrar,
                false
            );

        }

    });

}


/* =========================================================
   TRADUZIR ERROS DO SUPABASE
========================================================= */

function traduzirErroAuth(error) {

    if (!error) {

        return "Ocorreu um erro. Tente novamente.";

    }


    const mensagem =
        String(
            error.message || ""
        ).toLowerCase();


    if (
        mensagem.includes("invalid login credentials")
    ) {

        return "E-mail ou senha incorretos.";

    }


    if (
        mensagem.includes("email not confirmed")
    ) {

        return "Confirme seu e-mail antes de entrar.";

    }


    if (
        mensagem.includes("user already registered")
    ) {

        return "Este e-mail já possui uma conta.";

    }


    if (
        mensagem.includes("password")
    ) {

        return "A senha informada não atende aos requisitos.";

    }


    if (
        mensagem.includes("email")
    ) {

        return "Verifique se o e-mail foi digitado corretamente.";

    }


    return "Não foi possível concluir a operação. Tente novamente.";

}

