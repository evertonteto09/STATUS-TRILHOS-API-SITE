/* =========================================================
   API STATUS METROPOLITANO
   JavaScript principal do site
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const SITE_API_STATUS_URL =
    "https://status-metropolitano-api.squareweb.app/site/api-status";

const API_STATUS_INTERVAL =
    30000;


/* =========================================================
   ESTADO
========================================================= */

let apiStatusTimer = null;


/* =========================================================
   MENU MOBILE
========================================================= */

function inicializarMenuMobile() {

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );

    const mainNavigation =
        document.querySelector(
            ".main-navigation"
        );


    if (
        !menuToggle ||
        !mainNavigation
    ) {
        return;
    }


    function fecharMenu() {

        mainNavigation.classList.remove(
            "open"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    }


    function alternarMenu() {

        const aberto =
            mainNavigation.classList.toggle(
                "open"
            );


        menuToggle.setAttribute(
            "aria-expanded",
            String(aberto)
        );


        menuToggle.setAttribute(
            "aria-label",
            aberto
                ? "Fechar menu"
                : "Abrir menu"
        );

    }


    menuToggle.addEventListener(
        "click",
        alternarMenu
    );


    /*
     * Fecha o menu depois que um link
     * é selecionado.
     */

    mainNavigation
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                fecharMenu
            );

        });


    /*
     * ESC fecha o menu.
     */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                fecharMenu();

            }

        }
    );


    /*
     * Ao voltar para desktop,
     * garantimos que o menu esteja fechado.
     */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 720
            ) {

                fecharMenu();

            }

        }
    );

}


/* =========================================================
   ANIMAÇÃO DOS CARDS
========================================================= */

function inicializarAnimacaoCards() {

    const animatedElements =
        document.querySelectorAll(
            ".feature-card, .system-card"
        );


    if (
        animatedElements.length === 0
    ) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

        animatedElements.forEach(
            (element) => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (
                entries,
                observerInstance
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observerInstance.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    animatedElements.forEach(
        (element) => {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   ANIMAÇÃO DE ENTRADA DA PÁGINA
========================================================= */

function iniciarAnimacaoPagina() {

    const elementosAnimados =
        document.querySelectorAll(
            ".page-reveal"
        );


    if (
        elementosAnimados.length === 0
    ) {
        return;
    }


    /*
     * requestAnimationFrame garante
     * que o navegador registre primeiro
     * o estado inicial antes da animação.
     */

    requestAnimationFrame(
        () => {

            elementosAnimados.forEach(
                (elemento) => {

                    elemento.classList.add(
                        "page-ready"
                    );

                }
            );

        }
    );

}


/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

function atualizarAno() {

    const currentYear =
        new Date().getFullYear();


    document
        .querySelectorAll(
            ".current-year"
        )
        .forEach((element) => {

            element.textContent =
                currentYear;

        });

}


/* =========================================================
   FORMATA DATA/HORA
========================================================= */

function formatarAtualizacaoApi() {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "medium"
        }
    ).format(
        new Date()
    );

}


/* =========================================================
   ATUALIZA INDICADOR DA HERO
========================================================= */

function atualizarIndicadorHero(
    estado,
    texto
) {

    const container =
        document.getElementById(
            "hero-api-status"
        );

    const indicator =
        document.getElementById(
            "hero-api-indicator"
        );

    const statusText =
        document.getElementById(
            "hero-api-status-text"
        );


    /*
     * Algumas páginas não possuem
     * o indicador da Hero.
     */

    if (!container) {
        return;
    }


    container.dataset.apiState =
        estado;


    if (indicator) {

        indicator.classList.remove(
            "api-online",
            "api-offline",
            "api-loading",
            "api-error"
        );


        indicator.classList.add(
            `api-${estado}`
        );

    }


    if (statusText) {

        statusText.textContent =
            texto;

    }

}


/* =========================================================
   ATUALIZA CARTÃO DA API
========================================================= */

function atualizarCartaoApi(
    estado,
    dados = null
) {

    const card =
        document.getElementById(
            "api-monitor-card"
        );

    if (!card) {
        return;
    }


    const statusText =
        document.getElementById(
            "api-monitor-status-text"
        );

    const statusDot =
        document.getElementById(
            "api-monitor-status-dot"
        );

    const cpu =
        document.getElementById(
            "api-monitor-cpu"
        );

    const ram =
        document.getElementById(
            "api-monitor-ram"
        );

    const ping =
        document.getElementById(
            "api-monitor-ping"
        );

    const updated =
        document.getElementById(
            "api-monitor-updated"
        );


    /*
     * Estado geral do cartão.
     */

    card.dataset.apiState =
        estado;


    /*
     * Estado visual do indicador.
     */

    if (statusDot) {

        statusDot.classList.remove(
            "api-online",
            "api-offline",
            "api-loading",
            "api-error"
        );


        statusDot.classList.add(
            `api-${estado}`
        );

    }


    /* =====================================================
       ONLINE
    ===================================================== */

    if (
        estado === "online" &&
        dados
    ) {

        if (statusText) {

            statusText.textContent =
                "Operacional";

        }


        if (cpu) {

            cpu.textContent =
                dados.cpu ?? "—";

        }


        if (ram) {

            ram.textContent =
                dados.ram ?? "—";

        }


        if (ping) {

            ping.textContent =
                dados.ping_ms !== undefined
                    ? `${dados.ping_ms} ms`
                    : "—";

        }


        if (updated) {

            updated.textContent =
                formatarAtualizacaoApi();

        }


        return;
    }


    /* =====================================================
       OFFLINE
    ===================================================== */

    if (
        estado === "offline"
    ) {

        if (statusText) {

            statusText.textContent =
                "Indisponível";

        }


        if (cpu) {
            cpu.textContent = "—";
        }


        if (ram) {
            ram.textContent = "—";
        }


        if (ping) {
            ping.textContent = "—";
        }


        if (updated) {

            updated.textContent =
                formatarAtualizacaoApi();

        }


        return;
    }


    /* =====================================================
       CARREGANDO
    ===================================================== */

    if (
        estado === "loading"
    ) {

        if (statusText) {

            statusText.textContent =
                "Verificando...";

        }


        return;
    }


    /* =====================================================
       ERRO
    ===================================================== */

    if (
        estado === "error"
    ) {

        if (statusText) {

            statusText.textContent =
                "Não foi possível verificar";

        }


        if (cpu) {
            cpu.textContent = "—";
        }


        if (ram) {
            ram.textContent = "—";
        }


        if (ping) {
            ping.textContent = "—";
        }


        if (updated) {

            updated.textContent =
                formatarAtualizacaoApi();

        }

    }

}


/* =========================================================
   CONSULTAR STATUS DA API
========================================================= */

async function consultarStatusApi() {

    atualizarIndicadorHero(
        "loading",
        "Verificando status da API..."
    );


    atualizarCartaoApi(
        "loading"
    );


    try {

        const response =
            await fetch(
                SITE_API_STATUS_URL,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    /*
                     * Impede o navegador de
                     * reutilizar uma resposta HTTP
                     * antiga.
                     *
                     * Nosso backend continua
                     * controlando o cache real.
                     */

                    cache: "no-store"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const resultado =
            await response.json();


        if (
            !resultado.ok ||
            !resultado.dados
        ) {

            throw new Error(
                "Resposta inválida da API."
            );

        }


        const dados =
            resultado.dados;


        /*
         * A API declarou que está online.
         */

        if (
            dados.online === true
        ) {

            atualizarIndicadorHero(
                "online",
                "API operacional"
            );


            atualizarCartaoApi(
                "online",
                dados
            );


            return;
        }


        /*
         * A API respondeu, mas declarou
         * que a aplicação está offline.
         */

        atualizarIndicadorHero(
            "offline",
            "API indisponível"
        );


        atualizarCartaoApi(
            "offline",
            dados
        );

    } catch (erro) {

        console.error(
            "Erro ao consultar status da API:",
            erro
        );


        /*
         * Erro de consulta não significa
         * necessariamente que a API esteja offline.
         */

        atualizarIndicadorHero(
            "error",
            "Não foi possível verificar a API"
        );


        atualizarCartaoApi(
            "error"
        );

    }

}


/* =========================================================
   INICIAR MONITORAMENTO DA API
========================================================= */

function iniciarMonitoramentoApi() {

    /*
     * Só iniciamos o monitoramento em páginas
     * que realmente possuem nosso cartão/indicador.
     */

    const possuiMonitoramento =
        document.getElementById(
            "api-monitor-card"
        ) ||
        document.getElementById(
            "hero-api-status"
        );


    if (
        !possuiMonitoramento
    ) {
        return;
    }


    /*
     * Primeira consulta imediatamente.
     */

    consultarStatusApi();


    /*
     * Evita criar múltiplos timers.
     */

    if (
        apiStatusTimer
    ) {

        clearInterval(
            apiStatusTimer
        );

    }


    apiStatusTimer =
        setInterval(
            consultarStatusApi,
            API_STATUS_INTERVAL
        );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Menu
         */

        inicializarMenuMobile();


        /*
         * Cards com IntersectionObserver
         */

        inicializarAnimacaoCards();


        /*
         * Animação geral das páginas
         */

        iniciarAnimacaoPagina();


        /*
         * Ano automático
         */

        atualizarAno();


        /*
         * Monitoramento da API.
         *
         * Só funciona em páginas que possuem
         * os elementos do monitoramento.
         */

        iniciarMonitoramentoApi();


        /*
         * Log único de inicialização.
         */

        console.log(
            "%c🚇 API Status Metropolitano",
            "color:#67f5ff;font-size:16px;font-weight:bold;"
        );

        console.log(
            "Frontend inicializado com sucesso."
        );

    }
);
