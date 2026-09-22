/* =========================================================
   API STATUS METROPOLITANO
   JavaScript principal do site
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
     * =====================================================
     * MENU MOBILE
     * =====================================================
     */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNavigation = document.querySelector(".main-navigation");

    if (menuToggle && mainNavigation) {

        /*
         * Abre / fecha o menu
         */

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNavigation.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Fechar menu"
                    : "Abrir menu"
            );

        });


        /*
         * Fecha o menu quando um link é selecionado
         */

        const navigationLinks =
            mainNavigation.querySelectorAll("a");

        navigationLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mainNavigation.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            });

        });


        /*
         * Fecha o menu usando a tecla ESC
         */

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                mainNavigation.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            }

        });


        /*
         * Fecha o menu caso a tela volte para desktop
         */

        window.addEventListener("resize", () => {

            if (window.innerWidth > 720) {

                mainNavigation.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            }

        });

    }


    /*
     * =====================================================
     * NAVEGAÇÃO
     * =====================================================
     */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    const navigationLinks =
        document.querySelectorAll(
            ".main-navigation .nav-link"
        );


    navigationLinks.forEach((link) => {

        const linkPage =
            link.getAttribute("href");


        if (linkPage === currentPage) {

            navigationLinks.forEach((item) => {

                item.classList.remove("active");

            });

            link.classList.add("active");

        }

    });


    /*
     * =====================================================
     * ANIMAÇÃO DE ENTRADA
     * =====================================================
     *
     * Pequeno efeito para elementos principais.
     *
     * Não utilizamos bibliotecas externas.
     */

    const animatedElements =
        document.querySelectorAll(
            ".feature-card, .system-card"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observerInstance.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach((element) => {

            observer.observe(element);

        });

    }

   /* =========================================================
   STATUS DA API
========================================================= */

const SITE_API_STATUS_URL =
    "https://status-metropolitano-api.squareweb.app/site/api-status";


let apiStatusTimer = null;


/* =========================================================
   FORMATAÇÃO DA DATA
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
   ATUALIZA INDICADOR DA HOME
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


    if (!container) {
        return;
    }


    container.dataset.apiState =
        estado;


    if (indicator) {

        indicator.classList.remove(
            "api-online",
            "api-offline",
            "api-loading"
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
   ATUALIZA CARTÃO
========================================================= */

function atualizarCartaoApi(
    estado,
    dados = null
) {

    const card =
        document.getElementById(
            "api-monitor-card"
        );

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


    if (!card) {
        return;
    }


    card.dataset.apiState =
        estado;


    if (statusDot) {

        statusDot.classList.remove(
            "api-online",
            "api-offline",
            "api-loading"
        );

        statusDot.classList.add(
            `api-${estado}`
        );

    }


    /* =====================================
       ONLINE
    ====================================== */

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


    /* =====================================
       OFFLINE
    ====================================== */

    if (
        estado === "offline"
    ) {

        if (statusText) {
            statusText.textContent =
                "Indisponível";
        }


        if (cpu) {
            cpu.textContent =
                "—";
        }


        if (ram) {
            ram.textContent =
                "—";
        }


        if (ping) {
            ping.textContent =
                "—";
        }


        if (updated) {

            updated.textContent =
                formatarAtualizacaoApi();

        }

        return;
    }


    /* =====================================
       ERRO / CARREGANDO
    ====================================== */

    if (statusText) {

        statusText.textContent =
            estado === "loading"
                ? "Verificando..."
                : "Não foi possível consultar";

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

                    cache: "no-store"
                }
            );


        if (!response.ok) {

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


        /* =====================================
           API ONLINE
        ====================================== */

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


        } else {

            /* =================================
               API OFFLINE
            ================================== */

            atualizarIndicadorHero(
                "offline",
                "API indisponível"
            );


            atualizarCartaoApi(
                "offline",
                dados
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao consultar status da API:",
            erro
        );


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
   INICIALIZAR MONITORAMENTO
========================================================= */

function iniciarMonitoramentoApi() {

    consultarStatusApi();


    /*
     * Atualiza a cada 30 segundos.
     *
     * A API possui seu próprio cache, então não há
     * necessidade de ficar consultando constantemente.
     */

    if (apiStatusTimer) {

        clearInterval(
            apiStatusTimer
        );

    }


    apiStatusTimer =
        setInterval(
            consultarStatusApi,
            30000
        );

}


    /*
     * =====================================================
     * ANO AUTOMÁTICO
     * =====================================================
     *
     * Se encontrarmos elementos com .current-year,
     * colocamos automaticamente o ano atual.
     */

    const currentYear =
        new Date().getFullYear();


    document
        .querySelectorAll(".current-year")
        .forEach((element) => {

            element.textContent = currentYear;

        });


    /*
     * =====================================================
     * INICIALIZAÇÃO
     * =====================================================
     */

    console.log(
        "%c🚇 API Status Metropolitano",
        "color:#67f5ff;font-size:16px;font-weight:bold;"
    );

    console.log(
       "Frontend inicializado com sucesso."
       );

    console.log(
        "Frontend inicializado com sucesso."
    );

});

/* =========================================================
   ANIMAÇÃO DE ENTRADA DA PÁGINA
========================================================= */

function iniciarAnimacaoPagina() {

    const elementosAnimados =
        document.querySelectorAll(
            ".page-reveal"
        );

    elementosAnimados.forEach(
        (elemento) => {

            /*
             * Pequeno atraso para garantir que
             * o navegador registre o estado inicial
             * antes de iniciar a animação.
             */

            requestAnimationFrame(() => {

                elemento.classList.add(
                    "page-ready"
                );

            });

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarAnimacaoPagina();

    }
);
