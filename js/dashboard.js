/* =========================================================
   DASHBOARD.JS
   Dashboard Financeiro
========================================================= */


async function verificarUsuario() {

    if (!supabaseClient) {
        console.error("Supabase não está configurado.");
        return;
    }


    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {
        console.error("Erro ao verificar sessão:", error);
        return;
    }


    if (!session) {

        window.location.href = "login.html";

        return;
    }


    console.log(
        "Usuário autenticado:",
        session.user.email
    );


    /* =====================================================
       NOME DO USUÁRIO
    ===================================================== */

    const nomeUsuario =
        document.getElementById("nome-usuario");


    if (nomeUsuario) {

        const nome =
            session.user.user_metadata?.nome;


        if (nome) {

            nomeUsuario.textContent = nome;

        } else {

            nomeUsuario.textContent =
                session.user.email;

        }

    }

}


/* =========================================================
   INICIAR DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        verificarUsuario();

    }
);