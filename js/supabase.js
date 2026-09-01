/* =========================================================
   SUPABASE
   Dashboard Financeiro
========================================================= */


/*
   IMPORTANTE:

   A chave publicável pode ser usada no frontend.

   NUNCA coloque aqui:
   - chave secreta
   - service_role key
   - senha do banco
   - qualquer secret
*/


const SUPABASE_URL =
    "https://lfkvxgbqkhtzessigeku.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable_mF1QfSuC3EUasQmlTwzHDg_IELTaUDS";


/* =========================================================
   CLIENTE SUPABASE
========================================================= */

let supabaseClient = null;


if (
    typeof window.supabase !== "undefined" &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

}


/* =========================================================
   VERIFICAÇÃO
========================================================= */

if (!supabaseClient) {

    console.warn(
        "Supabase ainda não configurado. " +
        "Verifique SUPABASE_URL e SUPABASE_ANON_KEY."
    );

}