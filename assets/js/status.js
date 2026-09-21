/* =========================================================
   API STATUS METROPOLITANO
   Controle da página de status operacional
========================================================= */


/*
 * =========================================================
 * CONFIGURAÇÕES
 * =========================================================
 */

const STATUS_API_URL =
    "https://status-metropolitano-api.squareweb.app/site/status";

/*
 * =========================================================
 * ELEMENTOS DO HTML
 * =========================================================
 */

const globalStatusIndicator =
    document.getElementById("global-status-indicator");

const globalStatusTitle =
    document.getElementById("global-status-title");

const globalStatusDescription =
    document.getElementById("global-status-description");

const refreshButton =
    document.getElementById("refresh-status");

const refreshIcon =
    document.getElementById("refresh-icon");

const lastUpdateElement =
    document.getElementById("last-update");

const totalLinesElement =
    document.getElementById("total-lines");

const statusSourceElement =
    document.getElementById("status-source");

const loadingMessage =
    document.getElementById("status-loading");

const errorMessage =
    document.getElementById("status-error");

const errorDescription =
    document.getElementById("status-error-description");

const retryButton =
    document.getElementById("retry-status");

const emptyMessage =
    document.getElementById("status-empty");

const linesContainer =
    document.getElementById("lines-container");

const filterButtons =
    document.querySelectorAll(".filter-button");


/*
 * =========================================================
 * ESTADO DA PÁGINA
 * =========================================================
 */

let allLines = [];

let currentFilter = "todos";

let isLoading = false;


/*
 * =========================================================
 * CLASSIFICAÇÃO DAS LINHAS
 * =========================================================
 *
 * Metrô:
 * 1, 2, 3, 15 e 17
 *
 * CPTM:
 * 7, 8, 9, 10, 11, 12 e 13
 *
 * Linhas metropolitanas:
 * 4, 5 e 6
 *
 * A classificação usa o número da linha retornado
 * pela API.
 */

const METRO_LINES = [
    "1",
    "2",
    "3",
    "15",
    "17"
];

const CPTM_LINES = [
    "10",
    "11",
    "12",
    "13"
];

const PRIVATE_LINES = [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];


/*
 * =========================================================
 * CONSULTA À API
 * =========================================================
 */

async function consultarStatus() {

    const response = await fetch(STATUS_API_URL, {

        method: "GET",
    });


    if (!response.ok) {

        throw new Error(
            `Erro HTTP ${response.status}`
        );

    }


    return await response.json();

}


/*
 * =========================================================
 * CONTROLE DOS ESTADOS VISUAIS
 * =========================================================
 */

function mostrarCarregamento() {

    loadingMessage.classList.remove("hidden");

    errorMessage.classList.add("hidden");

    emptyMessage.classList.add("hidden");

    linesContainer.innerHTML = "";

    globalStatusTitle.textContent =
        "Consultando status...";

    globalStatusDescription.textContent =
        "Aguarde enquanto buscamos os dados.";

    globalStatusIndicator.classList.remove(
        "status-success",
        "status-warning",
        "status-error"
    );

    globalStatusIndicator.classList.add(
        "status-loading"
    );

}


function esconderCarregamento() {

    loadingMessage.classList.add("hidden");

}


function mostrarErro(erro) {

    loadingMessage.classList.add("hidden");

    emptyMessage.classList.add("hidden");

    errorMessage.classList.remove("hidden");

    errorDescription.textContent =
        erro?.message ||
        "Verifique sua conexão e tente novamente.";

    globalStatusTitle.textContent =
        "Falha na consulta";

    globalStatusDescription.textContent =
        "Não foi possível obter os dados da API.";

    globalStatusIndicator.classList.remove(
        "status-loading",
        "status-success",
        "status-warning"
    );

    globalStatusIndicator.classList.add(
        "status-error"
    );

}


function mostrarVazio() {

    emptyMessage.classList.remove("hidden");

}


/*
 * =========================================================
 * NORMALIZAÇÃO DOS DADOS
 * =========================================================
 */

function extrairDadosResposta(resposta) {

    /*
     * Estrutura esperada:

     resposta
     └── dados
         └── dados
             ├── atualizado_em
             ├── fonte
             └── linhas
    */

    if (!resposta || typeof resposta !== "object") {

        throw new Error(
            "A API retornou uma resposta inválida."
        );

    }


    if (resposta.ok === false) {

        throw new Error(
            resposta.erro ||
            resposta.mensagem ||
            "A API informou que a consulta falhou."
        );

    }


    const envelope =
        resposta.dados || resposta;

    const dados =
        envelope.dados || envelope;


    const linhas =
        Array.isArray(dados.linhas)
            ? dados.linhas
            : [];


    return {
        linhas,
        atualizadoEm:
            dados.atualizado_em ||
            envelope.atualizado_em ||
            resposta.atualizado_em ||
            null,

        fonte:
            dados.fonte ||
            envelope.fonte ||
            resposta.fonte ||
            null
    };

}


/*
 * =========================================================
 * IDENTIFICAÇÃO DO SISTEMA
 * =========================================================
 */

function obterSistema(numero) {

    const numeroLinha =
        String(numero || "").trim();


    if (METRO_LINES.includes(numeroLinha)) {
        return "metro";
    }


    if (CPTM_LINES.includes(numeroLinha)) {
        return "cptm";
    }


    if (PRIVATE_LINES.includes(numeroLinha)) {
        return "privadas";
    }


    return "outros";

}


/*
 * =========================================================
 * STATUS DA LINHA
 * =========================================================
 */

function obterInformacoesStatus(linha) {

    const status =
        linha?.status;


    /*
     * O status pode ser objeto ou array,
     * dependendo da fonte consultada.
     */

    if (Array.isArray(status)) {

        const primeiroStatus =
            status[0];

        if (typeof primeiroStatus === "object") {

            return {
                situacao:
                    primeiroStatus.situacao ||
                    primeiroStatus.status ||
                    "Indisponível",

                descricao:
                    primeiroStatus.descricao ||
                    primeiroStatus.mensagem ||
                    ""
            };

        }

        return {
            situacao:
                primeiroStatus ||
                "Indisponível",

            descricao: ""
        };

    }


    if (status && typeof status === "object") {

        return {
            situacao:
                status.situacao ||
                status.status ||
                "Indisponível",

            descricao:
                status.descricao ||
                status.mensagem ||
                ""
        };

    }


    return {
        situacao:
            linha?.situacao ||
            linha?.status_texto ||
            "Indisponível",

        descricao:
            linha?.descricao ||
            ""
    };

}


/*
 * =========================================================
 * NORMALIZAÇÃO DO NOME DO STATUS
 * =========================================================
 */

function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}

function obterClasseStatus(situacao) {
    const texto =
        normalizarTexto(situacao);

    /*
     * ESTADOS NORMAIS
     */
    if (
        texto.includes("operacao normal") ||
        texto === "normal" ||
        texto.includes("regular") ||
        texto.includes("operacao transitoria") ||
        texto.includes("transitoria") ||
        texto.includes("operacao especial") ||
        texto.includes("especial")
    ) {
        return "normal";
    }

    /*
     * OPERAÇÃO ENCERRADA
     *
     * Somente Operação encerrada será vermelha.
     */
    if (
        texto.includes("operacao encerrada") ||
        texto === "encerrada"
    ) {
        return "critical";
    }

    /*
     * DEMAIS SITUAÇÕES:
     * todas serão consideradas anormalidades.
     */
    return "warning";
}

function obterTextoStatus(situacao) {
    const textoOriginal =
        String(situacao || "").trim();

    const texto =
        normalizarTexto(textoOriginal);

    const classe =
        obterClasseStatus(textoOriginal);

    if (classe === "normal") {
        if (texto.includes("transitoria")) {
            return "Operação Transitória";
        }

        if (texto.includes("especial")) {
            return "Operação Especial";
        }

        return "Operação normal";
    }

    if (classe === "critical") {
        return "Operação encerrada";
    }

    return textoOriginal || "Operação alterada";
}

/*
 * =========================================================
 * FORMATAÇÃO DE DATA
 * =========================================================
 */

function formatarData(data) {

    if (!data) {
        return "—";
    }


    const dataConvertida =
        new Date(data);


    if (Number.isNaN(dataConvertida.getTime())) {

        return data;

    }


    return dataConvertida.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


/*
 * =========================================================
 * CRIAÇÃO DOS CARDS
 * =========================================================
 */

function criarCardLinha(linha) {

    const numero =
        linha.numero ||
        linha.codigo ||
        "—";


    const nome =
        linha.nome ||
        `Linha ${numero}`;


    const sistema =
        obterSistema(numero);


    const status =
        obterInformacoesStatus(linha);


    const classeStatus =
        obterClasseStatus(status.situacao);


    const textoStatus =
        obterTextoStatus(status.situacao);


    const card =
        document.createElement("article");


    card.className =
    `line-status-card line-status-${classeStatus} is-visible`;


    card.dataset.system =
        sistema;


    card.dataset.lineNumber =
        numero;


    const colorElement =
        document.createElement("div");


    colorElement.className =
        "line-status-color";


    colorElement.dataset.line =
        numero;


    const content =
        document.createElement("div");


    content.className =
        "line-status-content";


    const lineNumber =
        document.createElement("span");


    lineNumber.className =
        "line-number";


    lineNumber.textContent =
        `LINHA ${numero}`;


    const title =
        document.createElement("h3");


    title.textContent =
        nome;


    const description =
        document.createElement("p");


    description.textContent =
        sistema === "metro"
            ? "Metrô de São Paulo"
            : sistema === "cptm"
                ? "Companhia Paulista de Trens Metropolitanos"
                : sistema === "privadas"
                    ? "Linhas metropolitanas"
                    : "Transporte metropolitano";


    content.appendChild(lineNumber);

    content.appendChild(title);

    content.appendChild(description);


    const badge =
        document.createElement("span");


    badge.className =
        `operation-badge ${classeStatus}`;


    badge.textContent =
        textoStatus;


    card.appendChild(colorElement);

    card.appendChild(content);

    card.appendChild(badge);


    if (status.descricao) {

        const detail =
            document.createElement("p");


        detail.className =
            "line-status-description";


        detail.textContent =
            status.descricao;


        content.appendChild(detail);

    }


    return card;

}


/*
 * =========================================================
 * RENDERIZAÇÃO DAS LINHAS
 * =========================================================
 */

function renderizarLinhas() {

    linesContainer.innerHTML = "";

    emptyMessage.classList.add("hidden");


    const linhasFiltradas =
        allLines.filter((linha) => {

            if (currentFilter === "todos") {
                return true;
            }


            const numero =
                linha.numero ||
                linha.codigo;


            return obterSistema(numero) === currentFilter;

        });


    if (linhasFiltradas.length === 0) {

        mostrarVazio();

        return;

    }


    linhasFiltradas.forEach((linha) => {

        const card =
            criarCardLinha(linha);


        linesContainer.appendChild(card);

    });

}


/*
 * =========================================================
 * ATUALIZAÇÃO DO RESUMO
 * =========================================================
 */

function atualizarResumo(dados) {

    const linhas =
        dados.linhas;


    lastUpdateElement.textContent =
        formatarData(dados.atualizadoEm);


    totalLinesElement.textContent =
        linhas.length;


    if (dados.fonte) {

        if (typeof dados.fonte === "object") {

            statusSourceElement.textContent =
                dados.fonte.nome ||
                "API Status Metropolitano";

        } else {

            statusSourceElement.textContent =
                dados.fonte;

        }

    } else {

        statusSourceElement.textContent =
            "API Status Metropolitano";

    }


    globalStatusTitle.textContent =
        "Status consultado";


    globalStatusDescription.textContent =
        "Dados operacionais carregados com sucesso.";

        const classesGlobais = [
            "status-loading",
            "status-error",
            "status-warning",
            "status-success"
            ];

            globalStatusIndicator.classList.remove(
                ...classesGlobais
            );

            const existeOperacaoEncerrada =
            linhas.some((linha) => {
                const status =
                obterInformacoesStatus(linha);

                return obterClasseStatus(status.situacao) === "critical";
            });

        const existeAnormalidade =
        linhas.some((linha) => {
            const status =
            obterInformacoesStatus(linha);

            return obterClasseStatus(status.situacao) === "warning";
        });

        if (existeOperacaoEncerrada) {
            globalStatusIndicator.classList.add(
                "status-error"
            );

            globalStatusTitle.textContent =
            "Operação com interrupções";

            globalStatusDescription.textContent =
            "Uma ou mais linhas estão com a operação encerrada.";
            } else if (existeAnormalidade) {
                globalStatusIndicator.classList.add(
                    "status-warning"
                );

                globalStatusTitle.textContent =
                "Operação com alterações";

                globalStatusDescription.textContent =
                "Uma ou mais linhas apresentam anormalidades operacionais.";
            } else {

                globalStatusIndicator.classList.add(
                    "status-success"
                );

                globalStatusTitle.textContent =
                "Status consultado";

                globalStatusDescription.textContent =
                "Dados operacionais carregados com sucesso.";

        }
}


/*
 * =========================================================
 * CONSULTA COMPLETA
 * =========================================================
 */

async function carregarStatus() {

    if (isLoading) {
        return;
    }


    isLoading = true;


    if (refreshButton) {
        refreshButton.disabled = true;
    }


    if (refreshIcon) {

        refreshIcon.classList.add(
            "is-spinning"
        );

    }


    mostrarCarregamento();


    try {

        const resposta =
            await consultarStatus();


        console.log(
            "Resposta recebida da API:",
            resposta
        );


        const dados =
            extrairDadosResposta(resposta);


        allLines =
            dados.linhas;


        atualizarResumo(dados);

        renderizarLinhas();


        esconderCarregamento();


    } catch (erro) {

        console.error(
            "Erro ao consultar a API:",
            erro
        );


        mostrarErro(erro);


    } finally {

        isLoading = false;


        if (refreshButton) {
            refreshButton.disabled = false;
        }


        if (refreshIcon) {

            refreshIcon.classList.remove(
                "is-spinning"
            );

        }

    }

}


/*
 * =========================================================
 * FILTROS
 * =========================================================
 */

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach((item) => {

            item.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter =
            button.dataset.filter ||
            "todos";


        renderizarLinhas();

    });

});


/*
 * =========================================================
 * BOTÕES DE ATUALIZAÇÃO
 * =========================================================
 */

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        carregarStatus
    );

}


if (retryButton) {

    retryButton.addEventListener(
        "click",
        carregarStatus
    );

}


/*
 * =========================================================
 * INICIALIZAÇÃO
 * =========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarStatus();

    }
);
