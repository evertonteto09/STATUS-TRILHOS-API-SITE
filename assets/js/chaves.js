/* =========================================
   CONFIGURAÇÕES
========================================= */

const API_BASE_URL =
    "https://status-metropolitano-api.squareweb.app";

const ENDPOINTS = {
    solicitar: "/api/v1/keys/solicitar",
    verificar: "/api/v1/keys/verificar",
    reenviar: "/api/v1/keys/reenviar",

    // Painel da API-Key
    painel: "/api/v1/keys/painel",

    // Exclusão da própria API-Key
    revogar: "/api/v1/keys/revogar"
};


/*
    Configurações do processo de verificação.
*/

const CODIGO_EXPIRACAO_SEGUNDOS = 15 * 60;
const INTERVALO_REENVIO_SEGUNDOS = 60;


/* =========================================
   ELEMENTOS DO HTML
========================================= */

const elements = {

    // Mensagem geral
    message:
        document.getElementById("message"),

    // Etapas
    stepRequest:
        document.getElementById("step-request"),

    stepVerification:
        document.getElementById(
            "step-verification"
        ),

    stepSuccess:
        document.getElementById("step-success"),

    stepManage:
        document.getElementById("step-manage"),


    // Entrada do painel
    openPanelButton:
        document.getElementById(
            "open-panel-button"
        ),


    // Formulário de solicitação
    requestForm:
        document.getElementById("request-form"),

    nameInput:
        document.getElementById("name"),

    emailInput:
        document.getElementById("email"),

    motivoUsoInput:
        document.getElementById("motivo-uso"),

    requestButton:
        document.getElementById("request-button"),

    requestButtonText:
        document.getElementById(
            "request-button-text"
        ),

    requestLoading:
        document.getElementById(
            "request-loading"
        ),


    // Verificação
    verificationForm:
        document.getElementById(
            "verification-form"
        ),

    verificationEmail:
        document.getElementById(
            "verification-email"
        ),

    verificationCode:
        document.getElementById(
            "verification-code"
        ),

    expirationContainer:
        document.getElementById(
            "expiration-container"
        ),

    expirationCounter:
        document.getElementById(
            "expiration-counter"
        ),

    codeError:
        document.getElementById(
            "code-error"
        ),

    verifyButton:
        document.getElementById(
            "verify-button"
        ),

    verifyButtonText:
        document.getElementById(
            "verify-button-text"
        ),

    verifyLoading:
        document.getElementById(
            "verify-loading"
        ),

    resendButton:
        document.getElementById(
            "resend-button"
        ),

    resendCounter:
        document.getElementById(
            "resend-counter"
        ),

    backButton:
        document.getElementById(
            "back-button"
        ),


    // API-Key recém criada
    apiKeyInput:
        document.getElementById("api-key"),

    toggleKeyButton:
        document.getElementById(
            "toggle-key-button"
        ),

    copyKeyButton:
        document.getElementById(
            "copy-key-button"
        ),

    copySuccess:
        document.getElementById(
            "copy-success"
        ),

    newRequestButton:
        document.getElementById(
            "new-request-button"
        ),


    // =====================================
    // PAINEL
    // =====================================

    manageKeyForm:
        document.getElementById(
            "manage-key-form"
        ),

    manageApiKeyInput:
        document.getElementById(
            "manage-api-key"
        ),

    toggleManageKeyButton:
        document.getElementById(
            "toggle-manage-key-button"
        ),

    manageKeyButton:
        document.getElementById(
            "manage-key-button"
        ),

    manageKeyButtonText:
        document.getElementById(
            "manage-key-button-text"
        ),

    manageKeyLoading:
        document.getElementById(
            "manage-key-loading"
        ),

    managePanel:
        document.getElementById(
            "manage-panel"
        ),

    manageKeyId:
        document.getElementById(
            "manage-key-id"
        ),

    manageCreatedAt:
        document.getElementById(
            "manage-created-at"
        ),

    manageUsed:
        document.getElementById(
            "manage-used"
        ),

    manageRemaining:
        document.getElementById(
            "manage-remaining"
        ),

    manageLimit:
        document.getElementById(
            "manage-limit"
        ),

    manageUsagePercent:
        document.getElementById(
            "manage-usage-percent"
        ),

    manageUsageProgress:
        document.getElementById(
            "manage-usage-progress"
        ),

    manageReset:
        document.getElementById(
            "manage-reset"
        ),

    refreshManageButton:
        document.getElementById(
            "refresh-manage-button"
        ),

    manageBackButton:
        document.getElementById(
            "manage-back-button"
        ),

    deleteKeyButton:
        document.getElementById(
            "delete-key-button"
        ),


    // =====================================
    // MODAL DE EXCLUSÃO
    // =====================================

    deleteModal:
        document.getElementById(
            "delete-modal"
        ),

    cancelDeleteButton:
        document.getElementById(
            "cancel-delete-button"
        ),

    confirmDeleteButton:
        document.getElementById(
            "confirm-delete-button"
        )
};


/* =========================================
   ESTADO
========================================= */

const state = {

    nome: "",
    email: "",
    motivoUso: "",

    verificacaoId: null,

    expiracaoTimestamp: null,
    expiracaoTimer: null,

    reenvioTimer: null,
    reenvioRestante: 0,

    requisicaoEnviando: false,
    codigoExpirado: false,

    apiKeyCriada: "",

    // API-Key utilizada no painel
    painelApiKey: "",

    // Dados retornados pelo painel
    painelDados: null,

    // Exclusão em andamento
    excluindoChave: false,

    // Foco anterior ao modal
    focoAntesModal: null
};


/* =========================================
   FUNÇÕES AUXILIARES
========================================= */

function obterUrl(endpoint) {

    return (
        `${API_BASE_URL}${endpoint}`
    );
}


function elementoExiste(elemento) {

    return (
        elemento instanceof HTMLElement
    );
}


/* =========================================
   MENSAGENS
========================================= */

function mostrarMensagem(
    texto,
    tipo = "info"
) {

    if (
        !elementoExiste(
            elements.message
        )
    ) {
        return;
    }

    elements.message.textContent =
        texto;

    elements.message.className =
        "form-message";

    elements.message.classList.add(
        tipo
    );

    elements.message.hidden = false;
}


function esconderMensagem() {

    if (
        !elementoExiste(
            elements.message
        )
    ) {
        return;
    }

    elements.message.hidden = true;

    elements.message.textContent =
        "";

    elements.message.className =
        "form-message";
}


/* =========================================
   ERRO DO CÓDIGO
========================================= */

function mostrarErroCodigo(
    texto,
    tipo = "invalid"
) {

    if (
        !elementoExiste(
            elements.codeError
        )
    ) {
        return;
    }

    elements.codeError.textContent =
        texto;

    elements.codeError.className =
        "code-error";

    elements.codeError.classList.add(
        tipo
    );

    elements.codeError.hidden =
        false;
}


function esconderErroCodigo() {

    if (
        !elementoExiste(
            elements.codeError
        )
    ) {
        return;
    }

    elements.codeError.hidden =
        true;

    elements.codeError.textContent =
        "";

    elements.codeError.className =
        "code-error";
}


/* =========================================
   TROCAR ETAPA
========================================= */

function trocarEtapa(etapa) {

    if (
        elementoExiste(
            elements.stepRequest
        )
    ) {
        elements.stepRequest.hidden =
            etapa !== "request";
    }

    if (
        elementoExiste(
            elements.stepVerification
        )
    ) {
        elements.stepVerification.hidden =
            etapa !== "verification";
    }

    if (
        elementoExiste(
            elements.stepSuccess
        )
    ) {
        elements.stepSuccess.hidden =
            etapa !== "success";
    }

    if (
        elementoExiste(
            elements.stepManage
        )
    ) {
        elements.stepManage.hidden =
            etapa !== "manage";
    }
}


/* =========================================
   FORMATAÇÃO
========================================= */

function formatarTempo(segundos) {

    const minutos =
        Math.floor(
            segundos / 60
        );

    const segundosRestantes =
        segundos % 60;

    return (
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundosRestantes).padStart(2, "0")}`
    );
}


function formatarDataHora(valor) {

    if (!valor) {
        return "—";
    }

    const data =
        new Date(valor);

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "medium"
        }
    ).format(data);
}


function obterNumero(
    valor,
    valorPadrao = 0
) {

    const numero =
        Number(valor);

    if (
        Number.isFinite(numero)
    ) {
        return numero;
    }

    return valorPadrao;
}

/* =========================================
   TRATAMENTO DE ERROS HTTP
========================================= */

function extrairMensagemErro(
    resposta,
    dados
) {

    if (
        dados &&
        dados.erro &&
        typeof dados.erro.mensagem ===
            "string"
    ) {
        return dados.erro.mensagem;
    }

    if (
        dados &&
        typeof dados.mensagem ===
            "string"
    ) {
        return dados.mensagem;
    }

    switch (
        resposta.status
    ) {

        case 400:
            return (
                "Os dados enviados são inválidos."
            );

        case 401:
            return (
                "A API-Key informada é inválida ou foi revogada."
            );

        case 403:
            return (
                "A solicitação foi bloqueada por segurança."
            );

        case 404:
            return (
                "A informação solicitada não foi encontrada."
            );

        case 409:
            return (
                "Esta solicitação já foi utilizada."
            );

        case 429:
            return (
                "Muitas tentativas. Aguarde um pouco e tente novamente."
            );

        default:

            if (
                resposta.status >= 500
            ) {
                return (
                    "O servidor apresentou um problema. Tente novamente mais tarde."
                );
            }

            return (
                "Não foi possível concluir a operação."
            );
    }
}


/* =========================================
   REQUISIÇÃO HTTP
========================================= */

async function fazerRequisicao(
    endpoint,
    opcoes = {}
) {

    const configuracao = {
        method:
            opcoes.method || "POST",

        headers: {
            ...(opcoes.headers || {})
        }
    };


    if (
        opcoes.body !== undefined &&
        opcoes.body !== null
    ) {

        configuracao.headers[
            "Content-Type"
        ] = "application/json";

        configuracao.body =
            JSON.stringify(
                opcoes.body
            );
    }


    const resposta =
        await fetch(
            obterUrl(endpoint),
            configuracao
        );


    let dados = {};

    try {

        dados =
            await resposta.json();

    } catch {

        dados = {};
    }


    if (!resposta.ok) {

        const erro =
            new Error(
                extrairMensagemErro(
                    resposta,
                    dados
                )
            );

        erro.status =
            resposta.status;

        erro.codigo =
            dados?.erro?.codigo ||
            null;

        erro.dados =
            dados;

        throw erro;
    }


    return dados;
}


/* =========================================
   LOADING
========================================= */

function definirLoadingSolicitacao(
    ativo
) {

    elements.requestButton.disabled =
        ativo;

    elements.requestButtonText.hidden =
        ativo;

    elements.requestLoading.hidden =
        !ativo;
}


function definirLoadingVerificacao(
    ativo
) {

    elements.verifyButton.disabled =
        ativo;

    elements.verifyButtonText.hidden =
        ativo;

    elements.verifyLoading.hidden =
        !ativo;
}


function definirLoadingPainel(
    ativo
) {

    if (
        !elementoExiste(
            elements.manageKeyButton
        )
    ) {
        return;
    }

    elements.manageKeyButton.disabled =
        ativo;

    elements.manageKeyButtonText.hidden =
        ativo;

    elements.manageKeyLoading.hidden =
        !ativo;
}


/* =========================================
   CONTADOR DE EXPIRAÇÃO
========================================= */

function pararContadorExpiracao() {

    if (
        state.expiracaoTimer
    ) {

        clearInterval(
            state.expiracaoTimer
        );

        state.expiracaoTimer =
            null;
    }

    state.expiracaoTimestamp =
        null;
}


function iniciarContadorExpiracao(
    expiraEm = null
) {

    pararContadorExpiracao();

    state.codigoExpirado =
        false;


    if (
        elementoExiste(
            elements.expirationContainer
        )
    ) {

        elements.expirationContainer
            .classList
            .remove("expired");
    }


    let timestamp =
        null;


    if (expiraEm) {

        const data =
            new Date(expiraEm);

        if (
            !Number.isNaN(
                data.getTime()
            )
        ) {

            timestamp =
                data.getTime();
        }
    }


    if (!timestamp) {

        timestamp =
            Date.now() +
            (
                CODIGO_EXPIRACAO_SEGUNDOS *
                1000
            );
    }


    state.expiracaoTimestamp =
        timestamp;


    elements.verificationCode.disabled =
        false;

    elements.verifyButton.disabled =
        false;


    atualizarContadorExpiracao();


    state.expiracaoTimer =
        setInterval(
            atualizarContadorExpiracao,
            1000
        );
}


function atualizarContadorExpiracao() {

    if (
        !state.expiracaoTimestamp
    ) {
        return;
    }


    const restante =
        Math.max(
            0,
            Math.ceil(
                (
                    state.expiracaoTimestamp -
                    Date.now()
                ) / 1000
            )
        );


    elements.expirationCounter.textContent =
        formatarTempo(restante);


    if (
        restante <= 0
    ) {

        expirarCodigo();
    }
}


function expirarCodigo() {

    if (
        state.codigoExpirado
    ) {
        return;
    }


    state.codigoExpirado =
        true;

    pararContadorExpiracao();


    elements.expirationCounter.textContent =
        "00:00";


    elements.expirationContainer
        .classList
        .add("expired");


    elements.verificationCode.disabled =
        true;

    elements.verifyButton.disabled =
        true;


    mostrarErroCodigo(
        "Este código expirou. Solicite um novo código.",
        "expired"
    );
}


/* =========================================
   CONTADOR DE REENVIO
========================================= */

function iniciarContadorReenvio() {

    pararContadorReenvio();

    state.reenvioRestante =
        INTERVALO_REENVIO_SEGUNDOS;


    elements.resendButton.disabled =
        true;


    atualizarContadorReenvio();


    state.reenvioTimer =
        setInterval(
            atualizarContadorReenvio,
            1000
        );
}


function atualizarContadorReenvio() {

    if (
        state.reenvioRestante > 0
    ) {

        elements.resendCounter.textContent =
            `(aguarde ${state.reenvioRestante}s)`;

    } else {

        elements.resendCounter.textContent =
            "";
    }


    if (
        state.reenvioRestante <= 0
    ) {

        pararContadorReenvio();

        elements.resendButton.disabled =
            false;

        return;
    }


    state.reenvioRestante--;
}


function pararContadorReenvio() {

    if (
        state.reenvioTimer
    ) {

        clearInterval(
            state.reenvioTimer
        );

        state.reenvioTimer =
            null;
    }

    state.reenvioRestante =
        0;

    if (
        elementoExiste(
            elements.resendCounter
        )
    ) {

        elements.resendCounter.textContent =
            "";
    }
}


/* =========================================
   SOLICITAR API-KEY
========================================= */

async function solicitarCodigo(
    event
) {

    event.preventDefault();


    if (
        state.requisicaoEnviando
    ) {
        return;
    }


    const nome =
        elements.nameInput
            .value
            .trim();

    const email =
        elements.emailInput
            .value
            .trim();

    const motivoUso =
        elements.motivoUsoInput
            .value
            .trim();


    if (
        !nome ||
        !email ||
        !motivoUso
    ) {

        mostrarMensagem(
            "Preencha seu nome, e-mail e motivo de utilização para continuar.",
            "warning"
        );

        return;
    }


    if (
        motivoUso.length < 10
    ) {

        mostrarMensagem(
            "Explique melhor o motivo de utilização. Informe pelo menos 10 caracteres.",
            "warning"
        );

        elements.motivoUsoInput.focus();

        return;
    }


    if (
        motivoUso.length > 1000
    ) {

        mostrarMensagem(
            "O motivo de utilização não pode ultrapassar 1000 caracteres.",
            "warning"
        );

        elements.motivoUsoInput.focus();

        return;
    }


    state.nome =
        nome;

    state.email =
        email;

    state.motivoUso =
        motivoUso;


    state.requisicaoEnviando =
        true;


    esconderMensagem();

    definirLoadingSolicitacao(
        true
    );


    try {

        const resposta =
            await fazerRequisicao(
                ENDPOINTS.solicitar,
                {
                    method: "POST",

                    body: {
                        nome:
                            state.nome,

                        email:
                            state.email,

                        motivo_uso:
                            state.motivoUso
                    }
                }
            );


        const dados =
            resposta.dados || {};


        state.verificacaoId =
            dados.verificacao_id ??
            dados.id_verificacao ??
            resposta.verificacao_id ??
            resposta.id_verificacao ??
            null;


        if (
            !state.verificacaoId
        ) {

            throw new Error(
                "O servidor não retornou o identificador da verificação."
            );
        }


        elements.verificationEmail.textContent =
            state.email;


        elements.verificationCode.value =
            "";


        elements.verificationCode.disabled =
            false;

        elements.verifyButton.disabled =
            false;


        esconderErroCodigo();


        trocarEtapa(
            "verification"
        );


        iniciarContadorExpiracao(
            dados.expira_em ||
            resposta.expira_em ||
            null
        );


        iniciarContadorReenvio();


        mostrarMensagem(
            "Código de verificação enviado para seu e-mail.",
            "success"
        );


        elements.verificationCode.focus();

    } catch (erro) {

        console.error(
            "Erro ao solicitar API-Key:",
            erro
        );


        mostrarMensagem(
            erro.message ||
            "Não foi possível enviar o código de verificação.",
            "error"
        );

    } finally {

        state.requisicaoEnviando =
            false;

        definirLoadingSolicitacao(
            false
        );
    }
}


/* =========================================
   VERIFICAR CÓDIGO
========================================= */

async function verificarCodigo(
    event
) {

    event.preventDefault();


    if (
        state.requisicaoEnviando
    ) {
        return;
    }


    if (
        state.codigoExpirado
    ) {

        mostrarErroCodigo(
            "Este código expirou. Solicite um novo código.",
            "expired"
        );

        return;
    }


    const codigo =
        elements.verificationCode
            .value
            .trim();


    if (
        !/^\d{6}$/.test(codigo)
    ) {

        mostrarErroCodigo(
            "Digite um código válido com 6 números.",
            "invalid"
        );

        return;
    }


    if (
        !state.verificacaoId
    ) {

        mostrarErroCodigo(
            "A solicitação de verificação não foi encontrada.",
            "invalid"
        );

        return;
    }


    state.requisicaoEnviando =
        true;


    esconderMensagem();

    esconderErroCodigo();

    definirLoadingVerificacao(
        true
    );


    try {

        const resposta =
            await fazerRequisicao(
                ENDPOINTS.verificar,
                {
                    method: "POST",

                    body: {
                        verificacao_id:
                            state.verificacaoId,

                        codigo:
                            codigo
                    }
                }
            );


        const dados =
            resposta.dados || {};


        const apiKey =
            dados.api_key ||
            null;


        if (!apiKey) {

            throw new Error(
                "O servidor não retornou a API-Key gerada."
            );
        }


        state.apiKeyCriada =
            apiKey;


        elements.apiKeyInput.value =
            apiKey;


        elements.apiKeyInput.type =
            "password";


        elements.toggleKeyButton.textContent =
            "👁️";


        elements.toggleKeyButton.setAttribute(
            "aria-label",
            "Revelar API-Key"
        );


        elements.toggleKeyButton.setAttribute(
            "title",
            "Revelar API-Key"
        );


        elements.copySuccess.hidden =
            true;


        pararContadorExpiracao();
        pararContadorReenvio();


        trocarEtapa(
            "success"
        );


        mostrarMensagem(
            resposta.aviso ||
            "Sua API-Key foi criada com sucesso!",
            "success"
        );

    } catch (erro) {

        console.error(
            "Erro ao verificar código:",
            erro
        );


        switch (
            erro.codigo
        ) {

            case "CODIGO_INCORRETO":

                mostrarErroCodigo(
                    "Código inválido. Confira os números enviados por e-mail.",
                    "invalid"
                );

                break;


            case "CODIGO_EXPIRADO":

                expirarCodigo();

                mostrarErroCodigo(
                    "Este código expirou. Solicite um novo código.",
                    "expired"
                );

                break;


            case "LIMITE_TENTATIVAS_EXCEDIDO":

                mostrarErroCodigo(
                    "O limite de tentativas foi excedido. Solicite um novo código.",
                    "expired"
                );

                elements.verificationCode.disabled =
                    true;

                elements.verifyButton.disabled =
                    true;

                break;


            case "VERIFICACAO_NAO_ENCONTRADA":

                mostrarErroCodigo(
                    "A solicitação de verificação não foi encontrada.",
                    "invalid"
                );

                break;


            case "VERIFICACAO_JA_UTILIZADA":

                mostrarErroCodigo(
                    "Esta solicitação já foi utilizada. Comece novamente.",
                    "invalid"
                );

                break;


            default:

                mostrarMensagem(
                    erro.message ||
                    "Não foi possível verificar o código.",
                    "error"
                );
        }

    } finally {

        state.requisicaoEnviando =
            false;

        definirLoadingVerificacao(
            false
        );
    }
}

/* =========================================
   REENVIAR CÓDIGO
========================================= */

async function reenviarCodigo() {

    if (
        state.requisicaoEnviando
    ) {
        return;
    }


    if (
        state.reenvioRestante > 0
    ) {
        return;
    }


    if (
        !state.email
    ) {

        mostrarMensagem(
            "O e-mail da solicitação não foi encontrado.",
            "error"
        );

        return;
    }


    state.requisicaoEnviando =
        true;


    elements.resendButton.disabled =
        true;


    esconderMensagem();
    esconderErroCodigo();


    try {

        const resposta =
            await fazerRequisicao(
                ENDPOINTS.reenviar,
                {
                    method: "POST",

                    body: {
                        email:
                            state.email
                    }
                }
            );


        const dados =
            resposta.dados || {};


        state.verificacaoId =
            dados.id_verificacao ??
            dados.verificacao_id ??
            state.verificacaoId;


        elements.verificationCode.value =
            "";


        elements.verificationCode.disabled =
            false;


        elements.verifyButton.disabled =
            false;


        iniciarContadorExpiracao(
            dados.expira_em ||
            null
        );


        iniciarContadorReenvio();


        mostrarMensagem(
            resposta.mensagem ||
            "Um novo código foi enviado para seu e-mail.",
            "success"
        );


        elements.verificationCode.focus();

    } catch (erro) {

        console.error(
            "Erro ao reenviar código:",
            erro
        );


        if (
            erro.codigo ===
            "REENVIO_MUITO_RAPIDO"
        ) {

            mostrarMensagem(
                "Aguarde um pouco antes de solicitar outro código.",
                "warning"
            );

            iniciarContadorReenvio();

        } else if (

            erro.codigo ===
                "LIMITE_REENVIOS_EXCEDIDO" ||

            erro.codigo ===
                "LIMITE_REENVIOS_IP_EXCEDIDO"

        ) {

            mostrarMensagem(
                "O limite de reenvios foi excedido. Tente novamente mais tarde.",
                "error"
            );

        } else if (

            erro.codigo ===
            "VERIFICACAO_NAO_ENCONTRADA"

        ) {

            mostrarMensagem(
                "A solicitação de verificação não foi encontrada. Comece novamente.",
                "error"
            );

            voltarParaSolicitacao();

        } else {

            mostrarMensagem(
                erro.message ||
                "Não foi possível reenviar o código.",
                "error"
            );
        }


        elements.resendButton.disabled =
            false;

    } finally {

        state.requisicaoEnviando =
            false;
    }
}


/* =========================================
   VOLTAR PARA SOLICITAÇÃO
========================================= */

function voltarParaSolicitacao() {

    pararContadorExpiracao();

    pararContadorReenvio();


    state.verificacaoId =
        null;

    state.codigoExpirado =
        false;


    elements.verificationCode.value =
        "";


    elements.resendButton.disabled =
        true;


    esconderErroCodigo();
    esconderMensagem();


    trocarEtapa(
        "request"
    );


    elements.nameInput.focus();
}


/* =========================================
   REVELAR / OCULTAR CHAVE GERADA
========================================= */

function alternarVisibilidadeChave() {

    const ocultando =
        elements.apiKeyInput.type ===
        "password";


    elements.apiKeyInput.type =
        ocultando
            ? "text"
            : "password";


    elements.toggleKeyButton.textContent =
        ocultando
            ? "🙈"
            : "👁️";


    elements.toggleKeyButton.setAttribute(
        "aria-label",
        ocultando
            ? "Ocultar API-Key"
            : "Revelar API-Key"
    );


    elements.toggleKeyButton.setAttribute(
        "title",
        ocultando
            ? "Ocultar API-Key"
            : "Revelar API-Key"
    );
}


/* =========================================
   COPIAR CHAVE GERADA
========================================= */

async function copiarApiKey() {

    const apiKey =
        elements.apiKeyInput
            .value
            .trim();


    if (!apiKey) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            apiKey
        );


        elements.copySuccess.textContent =
            "✓ API-Key copiada para a área de transferência!";


        elements.copySuccess.hidden =
            false;

    } catch (erro) {

        console.error(
            "Erro ao copiar API-Key:",
            erro
        );


        elements.apiKeyInput.type =
            "text";


        elements.apiKeyInput.select();


        let copiou =
            false;


        try {

            copiou =
                document.execCommand(
                    "copy"
                );

        } catch {

            copiou =
                false;
        }


        elements.apiKeyInput.setSelectionRange(
            0,
            0
        );


        elements.apiKeyInput.type =
            "password";


        if (copiou) {

            elements.copySuccess.textContent =
                "✓ API-Key copiada para a área de transferência!";

        } else {

            elements.copySuccess.textContent =
                "Não foi possível copiar automaticamente. Copie a chave manualmente.";
        }


        elements.copySuccess.hidden =
            false;
    }
}


/* =========================================
   ABRIR PAINEL
========================================= */

function abrirPainel() {

    esconderMensagem();
    esconderErroCodigo();


    elements.managePanel.hidden =
        true;


    /*
        A chave permanece apenas no estado
        da página. Não usamos localStorage.
    */

    elements.manageApiKeyInput.value =
        state.painelApiKey || "";


    trocarEtapa(
        "manage"
    );


    elements.manageApiKeyInput.focus();
}


/* =========================================
   FECHAR PAINEL
========================================= */

function fecharPainel() {

    esconderMensagem();


    elements.manageApiKeyInput.value =
        "";


    elements.managePanel.hidden =
        true;


    state.painelApiKey =
        "";

    state.painelDados =
        null;


    trocarEtapa(
        "request"
    );


    elements.nameInput.focus();
}


/* =========================================
   REVELAR / OCULTAR CHAVE DO PAINEL
========================================= */

function alternarVisibilidadeChavePainel() {

    const oculta =
        elements.manageApiKeyInput.type ===
        "password";


    elements.manageApiKeyInput.type =
        oculta
            ? "text"
            : "password";


    elements.toggleManageKeyButton.textContent =
        oculta
            ? "🙈"
            : "👁️";


    elements.toggleManageKeyButton.setAttribute(
        "aria-label",
        oculta
            ? "Ocultar API-Key"
            : "Revelar API-Key"
    );


    elements.toggleManageKeyButton.setAttribute(
        "title",
        oculta
            ? "Ocultar API-Key"
            : "Revelar API-Key"
    );
}


/* =========================================
   LIMPAR PAINEL
========================================= */

function limparPainelVisual() {

    elements.manageKeyId.textContent =
        "—";

    elements.manageCreatedAt.textContent =
        "—";

    elements.manageUsed.textContent =
        "0";

    elements.manageRemaining.textContent =
        "—";

    elements.manageLimit.textContent =
        "—";

    elements.manageUsagePercent.textContent =
        "0%";

    elements.manageUsageProgress.style.width =
        "0%";

    elements.manageReset.textContent =
        "—";
}


/* =========================================
   PREENCHER PAINEL
========================================= */

function preencherPainel(
    dados
) {

    const informacoes =
        dados || {};


    const uso =
        informacoes.rate_limit ||
        informacoes.uso ||
        {};


    const limite =
        obterNumero(
            uso.limite ??
            informacoes.limite,
            18
        );


    const usadas =
        obterNumero(
            uso.usadas ??
            uso.utilizadas ??
            informacoes.usadas,
            0
        );


    const restantes =
        obterNumero(
            uso.restantes ??
            informacoes.restantes,
            Math.max(
                0,
                limite - usadas
            )
        );


    const percentual =
        limite > 0
            ? Math.min(
                100,
                Math.max(
                    0,
                    (
                        usadas /
                        limite
                    ) * 100
                )
            )
            : 0;


    elements.manageKeyId.textContent =
        informacoes.id ??
        "—";


    elements.manageCreatedAt.textContent =
        formatarDataHora(
            informacoes.criada_em
        );


    elements.manageUsed.textContent =
        usadas;


    elements.manageRemaining.textContent =
        restantes;


    elements.manageLimit.textContent =
        limite;


    elements.manageUsagePercent.textContent =
        `${Math.round(percentual)}%`;


    elements.manageUsageProgress.style.width =
        `${percentual}%`;


    elements.manageReset.textContent =
        formatarDataHora(
            uso.reset_em ??
            informacoes.reset_em
        );


    elements.managePanel.hidden =
        false;
}


/* =========================================
   CONSULTAR PAINEL
========================================= */

async function consultarPainel(
    event
) {

    event.preventDefault();


    if (
        state.requisicaoEnviando
    ) {
        return;
    }


    const chave =
        elements.manageApiKeyInput
            .value
            .trim();


    if (!chave) {

        mostrarMensagem(
            "Informe sua API-Key para acessar o painel.",
            "warning"
        );

        elements.manageApiKeyInput.focus();

        return;
    }


    state.painelApiKey =
        chave;


    state.requisicaoEnviando =
        true;


    esconderMensagem();

    definirLoadingPainel(
        true
    );


    try {

        const resposta =
            await fazerRequisicao(
                ENDPOINTS.painel,
                {
                    method: "GET",

                    headers: {
                        "X-API-Key":
                            state.painelApiKey
                    }
                }
            );


        state.painelDados =
            resposta.dados ||
            {};


        preencherPainel(
            state.painelDados
        );


        mostrarMensagem(
            "Informações da API-Key atualizadas.",
            "success"
        );

    } catch (erro) {

        console.error(
            "Erro ao consultar painel:",
            erro
        );


        if (
            erro.codigo ===
            "API_KEY_INVALIDA"
        ) {

            state.painelApiKey =
                "";


            elements.manageApiKeyInput.value =
                "";


            elements.managePanel.hidden =
                true;


            mostrarMensagem(
                "A API-Key informada é inválida ou foi revogada.",
                "error"
            );


            elements.manageApiKeyInput.focus();

        } else {

            mostrarMensagem(
                erro.message ||
                "Não foi possível consultar os dados da API-Key.",
                "error"
            );
        }

    } finally {

        state.requisicaoEnviando =
            false;


        definirLoadingPainel(
            false
        );
    }
}

/* =========================================
   ATUALIZAR PAINEL
========================================= */

async function atualizarPainel() {

    if (
        state.requisicaoEnviando
    ) {
        return;
    }


    if (
        !state.painelApiKey
    ) {

        mostrarMensagem(
            "Informe sua API-Key para atualizar o painel.",
            "warning"
        );

        elements.manageApiKeyInput.focus();

        return;
    }


    state.requisicaoEnviando =
        true;


    elements.refreshManageButton.disabled =
        true;


    esconderMensagem();


    try {

        const resposta =
            await fazerRequisicao(
                ENDPOINTS.painel,
                {
                    method: "GET",

                    headers: {
                        "X-API-Key":
                            state.painelApiKey
                    }
                }
            );


        state.painelDados =
            resposta.dados ||
            {};


        preencherPainel(
            state.painelDados
        );


        mostrarMensagem(
            "Painel atualizado com sucesso.",
            "success"
        );

    } catch (erro) {

        console.error(
            "Erro ao atualizar painel:",
            erro
        );


        if (
            erro.codigo ===
            "API_KEY_INVALIDA"
        ) {

            state.painelApiKey =
                "";


            elements.manageApiKeyInput.value =
                "";


            elements.managePanel.hidden =
                true;


            mostrarMensagem(
                "A API-Key não é mais válida ou foi revogada.",
                "error"
            );

        } else {

            mostrarMensagem(
                erro.message ||
                "Não foi possível atualizar o painel.",
                "error"
            );
        }

    } finally {

        state.requisicaoEnviando =
            false;


        elements.refreshManageButton.disabled =
            false;
    }
}


/* =========================================
   ABRIR MODAL DE EXCLUSÃO
========================================= */

function abrirModalExclusao() {

    if (
        !state.painelApiKey
    ) {

        mostrarMensagem(
            "Consulte sua API-Key antes de solicitar a exclusão.",
            "warning"
        );

        return;
    }


    state.focoAntesModal =
        document.activeElement;


    elements.deleteModal.hidden =
        false;


    document.body.classList.add(
        "delete-modal-open"
    );


    elements.cancelDeleteButton.focus();
}


/* =========================================
   FECHAR MODAL
========================================= */

function fecharModalExclusao() {

    elements.deleteModal.hidden =
        true;


    document.body.classList.remove(
        "delete-modal-open"
    );


    if (
        state.focoAntesModal &&
        typeof state.focoAntesModal.focus ===
            "function"
    ) {

        state.focoAntesModal.focus();
    }


    state.focoAntesModal =
        null;
}


/* =========================================
   EXCLUIR API-KEY
========================================= */

async function deletarApiKey() {

    if (
        state.excluindoChave
    ) {
        return;
    }


    if (
        !state.painelApiKey
    ) {
        return;
    }


    state.excluindoChave =
        true;


    elements.confirmDeleteButton.disabled =
        true;


    elements.confirmDeleteButton.textContent =
        "Excluindo...";


    try {

        const resposta =
            await fazerRequisicao(
                ENDPOINTS.revogar,
                {
                    method: "POST",

                    headers: {
                        "X-API-Key":
                            state.painelApiKey
                    }
                }
            );


        /*
            Primeiro fechamos o modal.
        */

        fecharModalExclusao();


        /*
            Depois eliminamos tudo que
            estiver relacionado à chave
            da memória desta página.
        */

        state.painelApiKey =
            "";

        state.painelDados =
            null;

        state.apiKeyCriada =
            "";


        elements.manageApiKeyInput.value =
            "";

        elements.apiKeyInput.value =
            "";


        limparPainelVisual();


        elements.managePanel.hidden =
            true;


        /*
            A chave foi apagada.
            Voltamos ao começo.
        */

        trocarEtapa(
            "request"
        );


        mostrarMensagem(
            resposta.mensagem ||
            "Sua API-Key foi excluída com sucesso. Os dados relacionados também foram removidos.",
            "success"
        );


        elements.requestForm.reset();

        elements.nameInput.focus();

    } catch (erro) {

        console.error(
            "Erro ao excluir API-Key:",
            erro
        );


        if (
            erro.codigo ===
            "API_KEY_INVALIDA"
        ) {

            state.painelApiKey =
                "";


            elements.manageApiKeyInput.value =
                "";


            elements.managePanel.hidden =
                true;


            fecharModalExclusao();


            mostrarMensagem(
                "A API-Key não é mais válida ou já foi removida.",
                "error"
            );

        } else {

            mostrarMensagem(
                erro.message ||
                "Não foi possível excluir a API-Key.",
                "error"
            );
        }

    } finally {

        state.excluindoChave =
            false;


        elements.confirmDeleteButton.disabled =
            false;


        elements.confirmDeleteButton.textContent =
            "Sim, deletar chave";
    }
}


/* =========================================
   NOVA SOLICITAÇÃO
========================================= */

function iniciarNovaSolicitacao() {

    pararContadorExpiracao();

    pararContadorReenvio();


    state.nome =
        "";

    state.email =
        "";

    state.motivoUso =
        "";

    state.verificacaoId =
        null;

    state.codigoExpirado =
        false;

    state.requisicaoEnviando =
        false;

    state.apiKeyCriada =
        "";


    elements.requestForm.reset();

    elements.verificationForm.reset();


    elements.apiKeyInput.value =
        "";


    elements.apiKeyInput.type =
        "password";


    elements.toggleKeyButton.textContent =
        "👁️";


    elements.toggleKeyButton.setAttribute(
        "aria-label",
        "Revelar API-Key"
    );


    elements.toggleKeyButton.setAttribute(
        "title",
        "Revelar API-Key"
    );


    elements.copySuccess.hidden =
        true;


    elements.resendButton.disabled =
        true;


    esconderMensagem();
    esconderErroCodigo();


    definirLoadingSolicitacao(
        false
    );

    definirLoadingVerificacao(
        false
    );


    trocarEtapa(
        "request"
    );


    elements.nameInput.focus();
}


/* =========================================
   LIMPEZA AUTOMÁTICA DO CÓDIGO
========================================= */

function tratarEntradaCodigo() {

    elements.verificationCode.value =
        elements.verificationCode
            .value
            .replace(/\D/g, "")
            .slice(0, 6);


    esconderErroCodigo();
}


/* =========================================
   TECLA ESC
========================================= */

function tratarTeclaEscape(
    event
) {

    if (
        event.key === "Escape" &&
        !elements.deleteModal.hidden
    ) {

        fecharModalExclusao();
    }
}


/* =========================================
   EVENTOS — SOLICITAÇÃO
========================================= */

if (
    elementoExiste(
        elements.requestForm
    )
) {

    elements.requestForm.addEventListener(
        "submit",
        solicitarCodigo
    );
}


if (
    elementoExiste(
        elements.verificationForm
    )
) {

    elements.verificationForm.addEventListener(
        "submit",
        verificarCodigo
    );
}


if (
    elementoExiste(
        elements.resendButton
    )
) {

    elements.resendButton.addEventListener(
        "click",
        reenviarCodigo
    );
}


if (
    elementoExiste(
        elements.backButton
    )
) {

    elements.backButton.addEventListener(
        "click",
        voltarParaSolicitacao
    );
}


if (
    elementoExiste(
        elements.toggleKeyButton
    )
) {

    elements.toggleKeyButton.addEventListener(
        "click",
        alternarVisibilidadeChave
    );
}


if (
    elementoExiste(
        elements.copyKeyButton
    )
) {

    elements.copyKeyButton.addEventListener(
        "click",
        copiarApiKey
    );
}


if (
    elementoExiste(
        elements.newRequestButton
    )
) {

    elements.newRequestButton.addEventListener(
        "click",
        iniciarNovaSolicitacao
    );
}


/* =========================================
   EVENTOS — PAINEL
========================================= */

if (
    elementoExiste(
        elements.openPanelButton
    )
) {

    elements.openPanelButton.addEventListener(
        "click",
        abrirPainel
    );
}


if (
    elementoExiste(
        elements.manageKeyForm
    )
) {

    elements.manageKeyForm.addEventListener(
        "submit",
        consultarPainel
    );
}


if (
    elementoExiste(
        elements.toggleManageKeyButton
    )
) {

    elements.toggleManageKeyButton.addEventListener(
        "click",
        alternarVisibilidadeChavePainel
    );
}


if (
    elementoExiste(
        elements.refreshManageButton
    )
) {

    elements.refreshManageButton.addEventListener(
        "click",
        atualizarPainel
    );
}


if (
    elementoExiste(
        elements.manageBackButton
    )
) {

    elements.manageBackButton.addEventListener(
        "click",
        fecharPainel
    );
}


if (
    elementoExiste(
        elements.deleteKeyButton
    )
) {

    elements.deleteKeyButton.addEventListener(
        "click",
        abrirModalExclusao
    );
}


/* =========================================
   EVENTOS — MODAL
========================================= */

if (
    elementoExiste(
        elements.cancelDeleteButton
    )
) {

    elements.cancelDeleteButton.addEventListener(
        "click",
        fecharModalExclusao
    );
}


if (
    elementoExiste(
        elements.confirmDeleteButton
    )
) {

    elements.confirmDeleteButton.addEventListener(
        "click",
        deletarApiKey
    );
}


/*
    Clique no fundo escuro também fecha
    o modal.
*/

if (
    elementoExiste(
        elements.deleteModal
    )
) {

    elements.deleteModal.addEventListener(
        "click",
        event => {

            if (
                event.target.matches(
                    "[data-close-delete-modal]"
                )
            ) {

                fecharModalExclusao();
            }
        }
    );
}


/* =========================================
   EVENTOS — CÓDIGO
========================================= */

if (
    elementoExiste(
        elements.verificationCode
    )
) {

    elements.verificationCode.addEventListener(
        "input",
        tratarEntradaCodigo
    );
}


document.addEventListener(
    "keydown",
    tratarTeclaEscape
);


/* =========================================
   ESTADO INICIAL
========================================= */

trocarEtapa(
    "request"
);


if (
    elementoExiste(
        elements.requestLoading
    )
) {

    elements.requestLoading.hidden =
        true;
}


if (
    elementoExiste(
        elements.verifyLoading
    )
) {

    elements.verifyLoading.hidden =
        true;
}


if (
    elementoExiste(
        elements.manageKeyLoading
    )
) {

    elements.manageKeyLoading.hidden =
        true;
}


if (
    elementoExiste(
        elements.copySuccess
    )
) {

    elements.copySuccess.hidden =
        true;
}


if (
    elementoExiste(
        elements.message
    )
) {

    elements.message.hidden =
        true;
}


if (
    elementoExiste(
        elements.codeError
    )
) {

    elements.codeError.hidden =
        true;
}


if (
    elementoExiste(
        elements.resendButton
    )
) {

    elements.resendButton.disabled =
        true;
}


if (
    elementoExiste(
        elements.managePanel
    )
) {

    elements.managePanel.hidden =
        true;
}


if (
    elementoExiste(
        elements.deleteModal
    )
) {

    elements.deleteModal.hidden =
        true;
}


if (
    elementoExiste(
        elements.manageApiKeyInput
    )
) {

    elements.manageApiKeyInput.type =
        "password";
}


if (
    elementoExiste(
        elements.toggleManageKeyButton
    )
) {

    elements.toggleManageKeyButton
        .textContent = "👁️";


    elements.toggleManageKeyButton
        .setAttribute(
            "aria-label",
            "Revelar API-Key"
        );


    elements.toggleManageKeyButton
        .setAttribute(
            "title",
            "Revelar API-Key"
        );
}


if (
    elementoExiste(
        elements.apiKeyInput
    )
) {

    elements.apiKeyInput.type =
        "password";
}


if (
    elementoExiste(
        elements.nameInput
    )
) {

    elements.nameInput.focus();
}