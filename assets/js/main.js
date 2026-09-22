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
