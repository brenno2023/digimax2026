let usuarioLogado = false;
let tipoUsuario = "";
let clienteLogadoId = null;
let clienteLogadoNome = "";
let clienteLogadoEmail = "";
let pedidoAtualId = null;
let funcionarioLogadoId = null;

console.log("Front-end carregado com sucesso!");
let servicoAtual = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarServicosDoBanco();
    const formCadastro = document.getElementById("formCadastro");

    const cepInput = document.getElementById("cep");

    if (cepInput) {
        cepInput.addEventListener("blur", buscarCep);
    }

    if (formCadastro) {
        formCadastro.addEventListener("submit", function (e) {
            e.preventDefault();

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const confirmSenha = document.getElementById("confirmSenha").value;
            const cep = document.getElementById("cep").value;
            const rua = document.getElementById("rua").value;
            const bairro = document.getElementById("bairro").value;
            const cidade = document.getElementById("cidade").value;
            const cpfCnpj = document.getElementById("cpf").value;
            const telefone = document.getElementById("telefone").value;
            const numero = document.getElementById("numero").value;
            const complemento = document.getElementById("complemento").value;

            if (
                !nome.trim() ||
                !cpfCnpj.trim() ||
                !email.trim() ||
                !telefone.trim() ||
                !cep.trim() ||
                !rua.trim() ||
                !numero.trim() ||
                !bairro.trim() ||
                !cidade.trim() ||
                !senha.trim() ||
                !confirmSenha.trim()
            ) {
                alert("Preencha todos os campos obrigatórios!");
                return;
            }

            // ===== VALIDAÇÃO CPF / CNPJ =====
const cpfCnpjNumeros = cpfCnpj.replace(/\D/g, "");

if (cpfCnpjNumeros.length !== 11 && cpfCnpjNumeros.length !== 14) {
    alert("CPF/CNPJ inválido. Digite 11 números para CPF ou 14 números para CNPJ.");
    return;
}

// ===== VALIDAÇÃO TELEFONE / WHATSAPP =====
const telefoneNumeros = telefone.replace(/\D/g, "");

if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
    alert("Telefone inválido. Digite 10 ou 11 números, incluindo o DDD.");
    return;
}

            // ===== VALIDAÇÃO DO ESTADO (AGORA NO LUGAR CERTO) =====
            let estado = document.getElementById("estado").value || "";
            estado = estado.trim().toUpperCase().replace(/[^A-Z]/g, "");

            if (estado.length !== 2) {
                alert("Estado deve ter 2 letras (ex: SP, RJ, MG).");
                return;
            }

            // ===== VALIDAÇÃO DE SENHA =====
            if (senha.length < 8) {
                alert("A senha deve ter no mínimo 8 caracteres!");
                return;
            }

            if (senha !== confirmSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            const cliente = {
                pessoa: {
                    nome: nome,
                    email: email,
                    senha: senha
                },
                cpfCnpj: cpfCnpj,
                telefone: telefone,
                cep: cep,
                rua: rua,
                numero: numero,
                complemento: complemento,
                bairro: bairro,
                cidade: cidade,
                estado: estado
            };

            fetch("http://localhost:8080/clientes/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            })
                .then(async (response) => {
                    const texto = await response.text();
                    if (!response.ok) {
                        throw new Error(texto || "Erro HTTP " + response.status);
                    }
                    return texto;
                })
                .then((mensagem) => {
    alert(mensagem);
    formCadastro.reset();

    if (usuarioLogado && tipoUsuario === "admin") {
        mostrarTela("clientes-funcionario");
    } else if (usuarioLogado && tipoUsuario === "funcionario") {
        mostrarTela("clientes-funcionario");
    } else {
        mostrarTela("login");
        document.getElementById("login").classList.remove("tela-escondida");
        mostrarLogin("cliente");
    }
})
                .catch((error) => {
                    console.error("Erro ao cadastrar:", error);
                    alert("Erro ao cadastrar: " + error.message);
                });
        });

        const formCadastroFuncionario = document.getElementById("formCadastroFuncionario");

        if (formCadastroFuncionario) {
            formCadastroFuncionario.addEventListener("submit", function (e) {
                e.preventDefault();

                if (tipoUsuario !== "admin") {
                    alert("Apenas o administrador pode cadastrar funcionários.");
                    return;
                }

               const nome = document.getElementById("funcNome").value.trim();
const email = document.getElementById("funcEmail").value.trim();
const usuario = document.getElementById("funcUsuario").value.trim().toLowerCase();
const cargo = document.getElementById("funcCargo").value;
const senha = document.getElementById("funcSenha").value;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!nome || !email || !usuario || !cargo || !senha) {
    alert("Preencha todos os campos do funcionário!");
    return;
}

if (nome.length < 3) {
    alert("O nome deve ter no mínimo 3 caracteres.");
    return;
}

if (!emailRegex.test(email)) {
    alert("Digite um e-mail válido.");
    return;
}

if (usuario.length < 4) {
    alert("O usuário deve ter no mínimo 4 caracteres.");
    return;
}

if (!/^[a-zA-Z0-9._-]+$/.test(usuario)) {
    alert("O usuário deve conter apenas letras, números, ponto, traço ou underline.");
    return;
}

if (senha.length < 8) {
    alert("A senha deve ter no mínimo 8 caracteres.");
    return;
}

if (isNaN(parseInt(cargo))) {
    alert("Selecione um cargo válido.");
    return;
}

                const funcionario = {
    pessoa: {
        nome: nome,
        email: email,
        senha: senha
    },
    usuario: usuario,
    cargo: {
        id: parseInt(cargo)
    }
};

                fetch("http://localhost:8080/funcionarios/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(funcionario)
                })
                    .then(async (response) => {
                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error("Erro ao cadastrar funcionário");
                        }

                        return data;
                    })
                    .then((funcionario) => {
                        alert("Funcionário cadastrado com sucesso!");
                        formCadastroFuncionario.reset();
                        mostrarTela("home-funcionario");
                    })
                    .catch((error) => {
                        console.error("Erro ao cadastrar funcionário:", error);
                        alert("Erro ao cadastrar funcionário: " + error.message);
                    });
            });
        }
    }

    const formPedido = document.getElementById("formPedido");

    if (formPedido) {
        formPedido.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!clienteLogadoId) {
                alert("Não foi possível identificar o cliente logado.");
                return;
            }

            if (!servicoAtual) {
                alert("Nenhum serviço selecionado.");
                return;
            }

            const quantidade = document.getElementById("pedidoQuantidade").value;
            const medida = document.getElementById("pedidoMedida").value;
            const prazo = document.getElementById("pedidoPrazo").value;
            const material = document.getElementById("pedidoMaterial").value;
            const observacoes = document.getElementById("pedidoObservacoes").value;
            const frenteVerso = document.getElementById("pedidoFrenteVerso")?.value || "";
            const furo = document.getElementById("pedidoFuro")?.value || "";

            const pedido = {
    cliente: { 
        id: clienteLogadoId 
    },

    servico: {
        id: servicosIds[servicoAtual]
    },

    descricao: "Pedido feito pelo cliente no site",
    servicoNome: servicos[servicoAtual].titulo,
    quantidade: quantidade,
    medida: medida,
    prazo: prazo,
    material: material,
    observacoesCliente: observacoes,
    frenteVerso: frenteVerso,
    furo: furo
};

            fetch("http://localhost:8080/orcamentos/solicitar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            })
                .then(async response => {
                    const texto = await response.text();

                    if (!response.ok) {
                        throw new Error(texto || "Erro ao enviar pedido");
                    }

                    return texto;
                })
                .then(() => {
                    alert("Pedido enviado com sucesso!");
                    formPedido.reset();
                    mostrarTela("meus-pedidos");
                })
                .catch(error => {
                    console.error("Erro ao enviar pedido:", error);
                    alert("Erro ao enviar pedido: " + error.message);
                });
        });
    }
    // Navegação da navbar (deixa aqui pra garantir que só roda depois do DOM carregar)
    const links = document.querySelectorAll(".navbar nav a");
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const telaId = this.getAttribute("data-tela");
            mostrarTela(telaId);
        });
    });
});

// Função para simular clique no botão
function solicitarOrcamento() {
    alert("Você clicou em 'Solicitar Orçamento'. Em breve conectaremos ao formulário!");
}


function mostrarTela(id) {
    const telasPublicas = ["login", "orcamento", "cadastro"];

    const telasCliente = [
        "home",
        "servicos",
        "detalhe-servico",
        "form-pedido",
        "meus-pedidos",
        "detalhe-pedido-cliente",
        "sobre",
        "feedbacks",
        "atendimento",
        "orcamento",
        "enviar-feedback"
    ];

    const telasFuncionario = [
        "home-funcionario",
        "cadastro",
        "clientes-funcionario",
        "pedidos-funcionario",
        "detalhe-pedido-funcionario",
        "feedbacks-internos"
    ];

    const telasAdmin = [
        "home-funcionario",
        "cadastro",
        "clientes-funcionario",
        "cadastro-funcionario",
        "funcionarios-admin",
        "pedidos-funcionario",
        "detalhe-pedido-funcionario",
        "feedbacks-internos"
    ];


    if (usuarioLogado) {
        if (tipoUsuario === "cliente" && !telasCliente.includes(id)) {
            alert("Tela não permitida para cliente.");
            return;
        }

        if (tipoUsuario === "funcionario" && !telasFuncionario.includes(id)) {
            alert("Tela não permitida para funcionário.");
            return;
        }

        if (tipoUsuario === "admin" && !telasAdmin.includes(id)) {
            alert("Tela não permitida para administrador.");
            return;
        }
    }

    const telas = document.querySelectorAll(".tela");
    telas.forEach(tela => tela.classList.remove("tela-ativa"));

    if (id === "home-funcionario") {
        atualizarTituloPainelStaff();
    }

    const telaMostrar = document.getElementById(id);
    if (telaMostrar) {
        telaMostrar.classList.add("tela-ativa");
    }


    if (id === "clientes-funcionario") {
        carregarClientesFuncionario();
    }

    if (id === "meus-pedidos") {
        carregarMeusPedidos();
    }

    if (id === "funcionarios-admin") {
        carregarFuncionariosAdmin();
    }

    if (id === "pedidos-funcionario") {
        carregarPedidosFuncionario();
    }

    if (id === "feedbacks-internos") {
        carregarFeedbacksInternos();
    }


    // Atualiza menu ativo
    const links = document.querySelectorAll(".navbar nav a");

    links.forEach(link => {
        link.classList.remove("ativo");

        if (link.getAttribute("data-tela") === id) {
            link.classList.add("ativo");
        }
    });
    atualizarBadgesNavbar();
}

const servicos = {

    impressao: {
        titulo: "Impressão Comum",
        descricao: "Impressões rápidas em preto e branco ou coloridas, ideais para documentos, trabalhos e materiais do dia a dia.\nAlta qualidade e ótimo custo-benefício para pequenas e grandes quantidades."
    },

    adesivo: {
        titulo: "Adesivo",
        descricao: "Produzimos adesivo comum e adesivo de vinil, ideais para uso interno e externo.\nÓtimos para divulgação, identificação de produtos e personalização em geral."
    },

    tag: {
        titulo: "Tag",
        descricao: "Tags personalizadas para roupas, brindes, lembranças e produtos comerciais.\nProduzidas com acabamento profissional para valorizar sua marca."
    },

    panfleto: {
        titulo: "Panfleto",
        descricao: "Panfletos promocionais ideais para divulgação de eventos, campanhas e negócios locais.\nImpressão de qualidade para chamar atenção e gerar resultados."
    },

    cartao: {
        titulo: "Cartão de Visita",
        descricao: "Cartões de visita profissionais com acabamento de alta qualidade e design moderno.\nA melhor forma de apresentar sua marca com credibilidade."
    },

    convite: {
        titulo: "Convite",
        descricao: "Convites personalizados para aniversários, casamentos, eventos e datas especiais.\nModelos criativos que deixam seu momento ainda mais especial."
    },

    etiqueta: {
        titulo: "Etiqueta Escolar",
        descricao: "Etiquetas personalizadas com nome e tema para materiais escolares e objetos pessoais.\nPráticas, resistentes e ideais para organização no dia a dia."
    },

    arte: {
        titulo: "Criar Arte",
        descricao: "Criação de artes personalizadas para impressos, redes sociais e materiais promocionais.\nDesign profissional pensado para destacar sua ideia ou negócio."
    },

    bolo: {
        titulo: "Topo de Bolo",
        descricao: "Topos de bolo personalizados para aniversários, festas e comemorações especiais.\nProduzidos com alta qualidade para deixar sua festa única."
    },

    encadernacao: {
        titulo: "Encadernação",
        descricao: "Encadernação de trabalhos, apostilas e documentos com acabamento profissional.\nMais organização, proteção e durabilidade para seus materiais."
    },

    plastificacao: {
        titulo: "Plastificação",
        descricao: "Plastificação para documentos, cardápios e materiais impressos, aumentando a durabilidade.\nProteção contra água, desgaste e sujeira."
    },

    online: {
        titulo: "Serviço Online",
        descricao: "Realização de serviços digitais como emissão de boleto da CPFL, licenciamento de veículo e certidões.\nAtendimento rápido para resolver serviços online com praticidade e segurança."
    }
};

let servicosIds = {
    impressao: 1,
    adesivo: 2,
    tag: 3,
    panfleto: 4,
    cartao: 5,
    convite: 6,
    etiqueta: 7,
    arte: 8,
    bolo: 9,
    encadernacao: 10,
    plastificacao: 11,
    online: 12
};

function abrirServico(tipo) {

    servicoAtual = tipo; // guarda o serviço atual

    document.getElementById("detalheTitulo").innerText =
        servicos[tipo].titulo;

    document.getElementById("detalheDescricao").innerText =
        servicos[tipo].descricao;

    mostrarTela("detalhe-servico");
}

function abrirFormularioPedido() {
    if (!servicoAtual) {
        alert("Selecione um serviço primeiro.");
        return;
    }

    document.getElementById("pedido-servico-nome").innerText =
        "Serviço selecionado: " + servicos[servicoAtual].titulo;

    mostrarTela("form-pedido");

    const campoFrenteVerso = document.getElementById("campo-frente-verso");

    const campoFuro = document.getElementById("campo-furo");

    const frenteVerso = document.getElementById("pedidoFrenteVerso")?.value || "";
    const furo = document.getElementById("pedidoFuro")?.value || "";

    if (servicoAtual === "tag") {
        campoFuro.style.display = "block";
    } else {
        campoFuro.style.display = "none";
    }

    if (servicoAtual === "panfleto" || servicoAtual === "cartao") {
        campoFrenteVerso.style.display = "block";
    } else {
        campoFrenteVerso.style.display = "none";
    }

    if (
        servicoAtual === "panfleto" ||
        servicoAtual === "cartao" ||
        servicoAtual === "tag" ||
        servicoAtual === "impressao"
    ) {
        campoFrenteVerso.style.display = "block";
    } else {
        campoFrenteVerso.style.display = "none";
    }

    const campoMedida = document.getElementById("pedidoMedida").parentElement;
    const campoPrazo = document.getElementById("pedidoPrazo").parentElement;
    const campoMaterial = document.getElementById("pedidoMaterial").parentElement;

    if (servicoAtual === "impressao") {
        document.getElementById("pedidoMedida").value = "";
        document.getElementById("pedidoPrazo").value = "";
        document.getElementById("pedidoMaterial").value = "";
    } else {
        campoMedida.style.display = "block";
        campoPrazo.style.display = "block";
        campoMaterial.style.display = "block";
    }

}

// ===== TELA DE LOGIN =====

function mostrarLogin(tipo) {
    document.getElementById("login-cliente").classList.add("hidden");
    document.getElementById("login-funcionario").classList.add("hidden");
    document.getElementById("login-admin").classList.add("hidden");

    if (tipo === "cliente") {
        document.getElementById("login-cliente").classList.remove("hidden");
    } else if (tipo === "funcionario") {
        document.getElementById("login-funcionario").classList.remove("hidden");
    } else if (tipo === "admin") {
        document.getElementById("login-admin").classList.remove("hidden");
    }
}

function entrarCliente() {
    const email = document.getElementById("emailCliente").value;
    const senha = document.getElementById("senhaCliente").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("http://localhost:8080/clientes/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
        .then(async response => {
            const texto = await response.text();

            if (!response.ok) {
                throw new Error(texto || "Login inválido");
            }

            return JSON.parse(texto);
        })
        .then(cliente => {
            usuarioLogado = true;
            tipoUsuario = "cliente";

            clienteLogadoId = cliente.id;
            clienteLogadoNome = cliente.nome;
            clienteLogadoEmail = cliente.email;

            document.querySelector(".navbar").style.display = "flex";

            ajustarNavbar();

            document.getElementById("link-orcamento").style.display = "inline";
            document.getElementById("login").classList.add("tela-escondida");
            mostrarTela("home");
            atualizarBadgesNavbar();
        })
        .catch(error => {
            console.error("Erro no login do cliente:", error);
            alert("E-mail ou senha incorretos!");
        });
}

function entrarFuncionario() {
    const usuario = document.getElementById("usuarioFunc").value.trim().toLowerCase();
    const senha = document.getElementById("senhaFunc").value.trim();

    if (!usuario || !senha) {
        alert("Preencha usuário e senha!");
        return;
    }

    fetch("http://localhost:8080/funcionarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario: usuario, senha: senha })
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error("Usuário ou senha inválidos!");
            }

            return response.json();
        })
        .then(funcionario => {
            usuarioLogado = true;
            tipoUsuario = "funcionario";
            funcionarioLogadoId = funcionario.id;

            console.log("FUNCIONÁRIO LOGADO:", funcionarioLogadoId);

            document.querySelector(".navbar").style.display = "flex";
            ajustarNavbar();
            document.getElementById("login").classList.add("tela-escondida");

            mostrarTela("home-funcionario");
            atualizarBadgesNavbar();
        })
        .catch(error => {
            console.error("Erro ao fazer login do funcionário:", error);
            alert(error.message);
        });
}

function entrarAdmin() {
    const usuario = document.getElementById("usuarioAdmin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaAdmin").value.trim();

    if (!usuario || !senha) {
        alert("Preencha usuário e senha!");
        return;
    }

    fetch("http://localhost:8080/administradores/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario: usuario, senha: senha })
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error("Usuário ou senha inválidos!");
            }

            const logado = await response.json();

            if (logado !== true) {
                throw new Error("Usuário ou senha inválidos!");
            }

            return logado;
        })
        .then(() => {
            usuarioLogado = true;
            tipoUsuario = "admin";

            document.querySelector(".navbar").style.display = "flex";
            ajustarNavbar();
            document.getElementById("login").classList.add("tela-escondida");

            mostrarTela("home-funcionario");
            atualizarBadgesNavbar();
        })
        .catch(error => {
            console.error("Erro no login admin:", error);
            alert(error.message);
        });
}

function primeiroAcesso() {
    // some a tela de login
    document.getElementById("login").classList.add("tela-escondida");

    // ainda não está logado
    usuarioLogado = false;

    // leva direto para a tela de cadastro de clientes
    mostrarTela("cadastro");
}

function ajustarNavbar() {
    const links = document.querySelectorAll(".navbar nav a");

    links.forEach(link => link.style.display = "none");

    if (tipoUsuario === "cliente") {
        document.querySelector('[data-tela="home"]').style.display = "inline";
        document.querySelector('[data-tela="servicos"]').style.display = "inline";
        document.querySelector('[data-tela="meus-pedidos"]').style.display = "inline";
        document.querySelector('[data-tela="sobre"]').style.display = "inline";
        document.querySelector('[data-tela="feedbacks"]').style.display = "inline";
        document.querySelector('[data-tela="atendimento"]').style.display = "inline";
        document.querySelector('[data-tela="orcamento"]').style.display = "inline";
        document.querySelector('[data-tela="enviar-feedback"]').style.display = "inline";
    }

    if (tipoUsuario === "funcionario") {
        document.querySelector('[data-tela="home-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="cadastro"]').style.display = "inline";
        document.querySelector('[data-tela="clientes-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="pedidos-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="feedbacks-internos"]').style.display = "inline";
    }

    if (tipoUsuario === "admin") {
        document.querySelector('[data-tela="home-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="cadastro"]').style.display = "inline";
        document.querySelector('[data-tela="clientes-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="cadastro-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="funcionarios-admin"]').style.display = "inline";
        document.querySelector('[data-tela="pedidos-funcionario"]').style.display = "inline";
        document.querySelector('[data-tela="feedbacks-internos"]').style.display = "inline";
    }
}

function carregarClientesFuncionario() {
    const lista = document.getElementById("lista-clientes-funcionario");

    if (!lista) return;

    lista.innerHTML = `
        <div class="painel-card">
            <h3>Carregando...</h3>
            <p>Buscando clientes cadastrados.</p>
        </div>
    `;

    fetch("http://localhost:8080/clientes")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar clientes");
            }
            return response.json();
        })
        .then(clientes => {
            lista.innerHTML = "";

            if (!clientes || clientes.length === 0) {
                lista.innerHTML = `
                    <div class="painel-card">
                        <h3>Nenhum cliente encontrado</h3>
                        <p>Não há clientes cadastrados no sistema.</p>
                    </div>
                `;
                return;
            }

            clientes
    .filter(cliente => cliente.pessoa?.status === 1)
    .forEach(cliente => {
                lista.innerHTML += `
<div class="painel-card">
    <h3>${cliente.pessoa?.nome}</h3>
    <p><strong>ID:</strong> ${cliente.id}</p>
    <p><strong>E-mail:</strong> ${cliente.pessoa?.email}</p>
    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
    <p><strong>Cidade:</strong> ${cliente.cidade}</p>
    <p><strong>Bairro:</strong> ${cliente.bairro}</p>

    ${tipoUsuario === "admin" ? `
    <div class="cliente-acoes">
        <button class="btn-editar" onclick='editarCliente(${JSON.stringify(cliente)})'>Editar cliente</button>
        <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">Excluir cliente</button>
    </div>
    ` : ""}
</div>
`;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar clientes:", error);
            lista.innerHTML = `
                <div class="painel-card">
                    <h3>Erro ao carregar</h3>
                    <p>Não foi possível buscar os clientes cadastrados.</p>
                </div>
            `;
        });
}

function carregarFuncionariosAdmin() {
    const lista = document.getElementById("lista-funcionarios-admin");

    if (!lista) return;

    lista.innerHTML = `
        <div class="painel-card">
            <h3>Carregando...</h3>
            <p>Buscando funcionários cadastrados.</p>
        </div>
    `;

    fetch("http://localhost:8080/funcionarios")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar funcionários");
            }
            return response.json();
        })
        .then(funcionarios => {
            lista.innerHTML = "";

            if (!funcionarios || funcionarios.length === 0) {
                lista.innerHTML = `
                    <div class="painel-card">
                        <h3>Nenhum funcionário encontrado</h3>
                        <p>Não há funcionários cadastrados no sistema.</p>
                    </div>
                `;
                return;
            }

            funcionarios
    .filter(funcionario => funcionario.pessoa?.status === 1)
    .forEach(funcionario => {
                lista.innerHTML += `
                    <div class="painel-card">
                        <h3>${funcionario.pessoa?.nome || "Sem nome"}</h3>
                        <p><strong>ID:</strong> ${funcionario.id}</p>
                        <p><strong>Usuário:</strong> ${funcionario.usuario}</p>
                       <p><strong>Cargo:</strong> ${funcionario.cargo?.nome || "Não informado"}</p>

                        <div class="cliente-acoes">
                            <button class="btn-editar" onclick='editarFuncionario(${JSON.stringify(funcionario)})'>Editar funcionário</button>
                            <button class="btn-excluir" onclick="excluirFuncionario(${funcionario.id})">Excluir funcionário</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar funcionários:", error);
            lista.innerHTML = `
                <div class="painel-card">
                    <h3>Erro ao carregar</h3>
                    <p>Não foi possível buscar os funcionários cadastrados.</p>
                </div>
            `;
        });
}

function carregarPedidosFuncionario() {
    const lista = document.getElementById("lista-pedidos-funcionario");

    if (!lista) return;

    lista.innerHTML = `
        <div class="painel-card">
            <h3>Carregando...</h3>
            <p>Buscando pedidos novos.</p>
        </div>
    `;

    fetch("http://localhost:8080/orcamentos/novos")
        .then(async response => {
            if (!response.ok) {
                const texto = await response.text();
                throw new Error(texto || "Erro ao buscar pedidos");
            }
            return response.json();
        })
        .then(pedidos => {
            console.log("PEDIDOS NOVOS FUNCIONÁRIO:", pedidos);

            lista.innerHTML = "";

            if (!pedidos || pedidos.length === 0) {
                lista.innerHTML = `
                    <div class="painel-card">
                        <h3>Nenhum pedido novo</h3>
                        <p>No momento não há novos pedidos aguardando resposta.</p>
                    </div>
                `;
                return;
            }

            pedidos.forEach(pedido => {
    lista.innerHTML += `
        <div class="painel-card">
            <span class="badge-novo">🔔 Novo pedido</span>

            <h3>${pedido.servicoNome || "Serviço não informado"}</h3>
            <p><strong>Cliente:</strong> ${pedido.cliente?.pessoa?.nome || "Não informado"}</p>
            <p><strong>Status:</strong> ${pedido.status || "PENDENTE"}</p>
            <p><strong>Quantidade:</strong> ${pedido.quantidade || "-"}</p>
            <p><strong>Prazo:</strong> ${pedido.prazo || "-"}</p>
            <p><strong>Observações:</strong> ${pedido.observacoesCliente || "-"}</p>

            <div class="cliente-acoes">
                <button class="btn-editar" onclick="abrirDetalhePedidoFuncionario(${pedido.id})">
                    Abrir pedido
                </button>
            </div>
        </div>
    `;
});
        })
        .catch(error => {
            console.error("Erro ao carregar pedidos do funcionário:", error);
            lista.innerHTML = `
                <div class="painel-card">
                    <h3>Erro ao carregar</h3>
                    <p>${error.message}</p>
                </div>
            `;
        });
}

function editarFuncionario(funcionario) {
    if (tipoUsuario !== "admin") {
        alert("Apenas o administrador pode editar funcionários.");
        return;
    }

    document.getElementById("form-editar-funcionario").classList.remove("hidden");

    document.getElementById("edit-func-id").value = funcionario.id;
    document.getElementById("edit-func-nome").value = funcionario.pessoa?.nome || "";
    document.getElementById("edit-func-usuario").value = funcionario.usuario || "";
    document.getElementById("edit-func-cargo").value = funcionario.cargo?.id || "";
    document.getElementById("edit-func-senha").value = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelarEdicaoFuncionario() {
    document.getElementById("form-editar-funcionario").classList.add("hidden");

    document.getElementById("edit-func-id").value = "";
    document.getElementById("edit-func-nome").value = "";
    document.getElementById("edit-func-usuario").value = "";
    document.getElementById("edit-func-cargo").value = "";
    document.getElementById("edit-func-senha").value = "";
}

function salvarEdicaoFuncionario() {
    if (tipoUsuario !== "admin") {
        alert("Apenas o administrador pode atualizar funcionários.");
        return;
    }

    const id = document.getElementById("edit-func-id").value;
    const senha = document.getElementById("edit-func-senha").value;

    const funcionarioAtualizado = {
    pessoa: {
        nome: document.getElementById("edit-func-nome").value
    },
    cargo: {
        id: parseInt(document.getElementById("edit-func-cargo").value)
    }
};

    if (!senha.trim()) {
        delete funcionarioAtualizado.pessoa.senha;
    }

    fetch(`http://localhost:8080/funcionarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(funcionarioAtualizado)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao atualizar funcionário");
            }
            return response.json();
        })
        .then(() => {
            alert("Funcionário atualizado com sucesso!");
            cancelarEdicaoFuncionario();
            carregarFuncionariosAdmin();
        })
        .catch(error => {
            console.error("Erro ao atualizar funcionário:", error);
            alert("Erro ao atualizar funcionário.");
        });
}

function excluirFuncionario(id) {
    if (tipoUsuario !== "admin") {
        alert("Apenas o administrador pode excluir funcionários.");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir este funcionário?");

    if (!confirmar) return;

    fetch(`http://localhost:8080/funcionarios/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir funcionário");
            }
            return response.text();
        })
        .then(() => {
            alert("Funcionário excluído com sucesso!");
            carregarFuncionariosAdmin();
        })
        .catch(error => {
            console.error("Erro ao excluir funcionário:", error);
            alert("Erro ao excluir funcionário.");
        });
}

function buscarCep() {
    const cepInput = document.getElementById("cep");
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                return;
            }

            document.getElementById("rua").value = data.logradouro || "";
            document.getElementById("bairro").value = data.bairro || "";
            document.getElementById("cidade").value = data.localidade || "";
            document.getElementById("estado").value = data.uf || "";
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error);
            alert("Erro ao buscar CEP.");
        });
}

function solicitarOrcamentoServico() {
    if (!servicoAtual) {
        mostrarTela("orcamento");
        return;
    }

    const nomeServico = servicos[servicoAtual].titulo;
    const mensagem = `Olá! Quero solicitar um orçamento para: ${nomeServico}`;
    const url = `https://wa.me/5517981410402?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}

function carregarMeusPedidos() {
    const lista = document.getElementById("lista-meus-pedidos");

    if (!lista) return;

    if (!clienteLogadoId) {
        lista.innerHTML = `
            <div class="card-pedido-cliente">
                <h3>Cliente não identificado</h3>
                <p>Faça login novamente para visualizar seus pedidos.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = `
        <div class="card-pedido-cliente">
            <h3>Carregando...</h3>
            <p>Buscando seus pedidos.</p>
        </div>
    `;

    fetch(`http://localhost:8080/orcamentos/cliente/${clienteLogadoId}`)
        .then(async response => {
            if (!response.ok) {
                const texto = await response.text();
                throw new Error(texto || "Erro ao buscar pedidos");
            }
            return response.json();
        })
        .then(pedidos => {
            console.log("PEDIDOS DO CLIENTE:", pedidos);
            console.log("clienteLogadoId:", clienteLogadoId);

            lista.innerHTML = "";

            if (!pedidos || pedidos.length === 0) {
                lista.innerHTML = `
                    <div class="card-pedido-cliente">
                        <h3>Nenhum pedido encontrado</h3>
                        <p>Você ainda não fez nenhum pedido pelo sistema.</p>
                    </div>
                `;
                return;
            }

            pedidos.forEach(pedido => {
    const temRespostaNova = pedido.respostaFuncionario && pedido.visualizadoCliente === false;

    lista.innerHTML += `
        <div class="card-pedido-cliente">
            ${temRespostaNova ? `<span class="badge-novo">🔔 Nova resposta da Digimax</span>` : ""}

            <h3>${pedido.servicoNome || "Serviço não informado"}</h3>
            <p><strong>Status:</strong> ${pedido.status || "Sem status"}</p>
            <p><strong>Quantidade:</strong> ${pedido.quantidade || "-"}</p>
            <p><strong>Medida:</strong> ${pedido.medida || "-"}</p>
            <p><strong>Prazo:</strong> ${pedido.prazo || "-"}</p>
            <p><strong>Material:</strong> ${pedido.material || "-"}</p>
            <p><strong>Observações:</strong> ${pedido.observacoesCliente || "-"}</p>
            <p><strong>Valor estimado:</strong> ${pedido.valorEstimado ? "R$ " + pedido.valorEstimado : "Aguardando"}</p>
            <p><strong>Resposta da Digimax:</strong> ${pedido.respostaFuncionario || "Aguardando retorno."}</p>

            <div class="cliente-acoes">
                <button class="btn-editar" onclick="abrirDetalhePedidoCliente(${pedido.id})">
                    Ver pedido
                </button>
            </div>
        </div>
    `;
});
        })
        .catch(error => {
            console.error("Erro ao carregar pedidos:", error);
            lista.innerHTML = `
                <div class="card-pedido-cliente">
                    <h3>Erro ao carregar</h3>
                    <p>${error.message}</p>
                </div>
            `;
        });
}

function abrirDetalhePedidoCliente(id) {
    fetch(`http://localhost:8080/orcamentos/${id}`)
        .then(async response => {
            if (!response.ok) {
                const texto = await response.text();
                throw new Error(texto || "Erro ao buscar pedido");
            }
            return response.json();
        })
        .then(pedido => {
            const conteudo = document.getElementById("conteudo-detalhe-pedido-cliente");

            conteudo.innerHTML = `
                <p><strong>Serviço:</strong> ${pedido.servicoNome || "-"}</p>
                <p><strong>Status:</strong> ${pedido.status || "-"}</p>
                <p><strong>Quantidade:</strong> ${pedido.quantidade || "-"}</p>
                <p><strong>Medida:</strong> ${pedido.medida || "-"}</p>
                <p><strong>Prazo:</strong> ${pedido.prazo || "-"}</p>
                <p><strong>Material:</strong> ${pedido.material || "-"}</p>
                <p><strong>Observações do pedido:</strong> ${pedido.observacoesCliente || "-"}</p>
                <p><strong>Valor estimado:</strong> ${pedido.valorEstimado ? "R$ " + pedido.valorEstimado : "Aguardando"}</p>
                <p><strong>Resposta da Digimax:</strong> ${pedido.respostaFuncionario || "Aguardando retorno."}</p>
            `;

            if (pedido.respostaFuncionario && pedido.visualizadoCliente === false) {
                fetch(`http://localhost:8080/orcamentos/${id}/visualizado-cliente`, {
                    method: "PUT"
                }).catch(error => console.error("Erro ao marcar pedido como visualizado pelo cliente:", error));
            }

            mostrarTela("detalhe-pedido-cliente");
        })
        .catch(error => {
            console.error("Erro ao abrir detalhe do pedido:", error);
            alert("Erro ao abrir pedido: " + error.message);
        });
}

function abrirWhatsPedido(servico) {
    const mensagem = `Olá! Estou enviando a arte do pedido de ${servico}.`;
    const url = `https://wa.me/5517981410402?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}

function editarCliente(cliente) {

    if (tipoUsuario !== "admin") {
        alert("Apenas o administrador pode editar clientes.");
        return;
    }

    document.getElementById("form-editar-cliente").classList.remove("hidden");

    document.getElementById("edit-id").value = cliente.id;
    document.getElementById("edit-nome").value = cliente.pessoa?.nome || "";
    document.getElementById("edit-cpfCnpj").value = cliente.cpfCnpj || "";
    document.getElementById("edit-email").value = cliente.pessoa?.email || "";
    document.getElementById("edit-telefone").value = cliente.telefone || "";
    document.getElementById("edit-cep").value = cliente.cep || "";
    document.getElementById("edit-rua").value = cliente.rua || "";
    document.getElementById("edit-numero").value = cliente.numero || "";
    document.getElementById("edit-complemento").value = cliente.complemento || "";
    document.getElementById("edit-bairro").value = cliente.bairro || "";
    document.getElementById("edit-cidade").value = cliente.cidade || "";
    document.getElementById("edit-estado").value = cliente.estado || "";
    document.getElementById("edit-senha").value = cliente.pessoa?.senha || "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelarEdicaoCliente() {
    document.getElementById("form-editar-cliente").classList.add("hidden");

    document.getElementById("edit-id").value = "";
    document.getElementById("edit-nome").value = "";
    document.getElementById("edit-cpfCnpj").value = "";
    document.getElementById("edit-email").value = "";
    document.getElementById("edit-telefone").value = "";
    document.getElementById("edit-cep").value = "";
    document.getElementById("edit-rua").value = "";
    document.getElementById("edit-numero").value = "";
    document.getElementById("edit-complemento").value = "";
    document.getElementById("edit-bairro").value = "";
    document.getElementById("edit-cidade").value = "";
    document.getElementById("edit-estado").value = "";
    document.getElementById("edit-senha").value = "";
}

function salvarEdicaoCliente() {

    if (tipoUsuario !== "admin") {
        alert("Apenas o administrador pode atualizar clientes.");
        return;
    }

    const id = document.getElementById("edit-id").value;

    let estado = document.getElementById("edit-estado").value || "";
    estado = estado.trim().toUpperCase().replace(/[^A-Z]/g, "");

    const clienteAtualizado = {
    pessoa: {
        nome: document.getElementById("edit-nome").value,
        email: document.getElementById("edit-email").value,
        senha: document.getElementById("edit-senha").value
    },

    cpfCnpj: document.getElementById("edit-cpfCnpj").value,
    telefone: document.getElementById("edit-telefone").value,
    cep: document.getElementById("edit-cep").value,
    rua: document.getElementById("edit-rua").value,
    numero: document.getElementById("edit-numero").value,
    complemento: document.getElementById("edit-complemento").value,
    bairro: document.getElementById("edit-bairro").value,
    cidade: document.getElementById("edit-cidade").value,
    estado: estado
};

    fetch(`http://localhost:8080/clientes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clienteAtualizado)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao atualizar cliente");
            }
            return response.json();
        })
        .then(() => {
            alert("Cliente atualizado com sucesso!");
            cancelarEdicaoCliente();
            carregarClientesFuncionario();
        })
        .catch(error => {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar cliente.");
        });
}

function excluirCliente(id) {

    if (tipoUsuario !== "admin") {
        alert("Apenas o administrador pode excluir clientes.");
        return;
    }


    const confirmar = confirm("Tem certeza que deseja excluir este cliente?");

    if (!confirmar) return;

    fetch(`http://localhost:8080/clientes/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir cliente");
            }
            return response.text();
        })
        .then(() => {
            alert("Cliente excluído com sucesso!");
            carregarClientesFuncionario();
        })
        .catch(error => {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir cliente.");
        });
}

function abrirDetalhePedidoFuncionario(id) {
    fetch(`http://localhost:8080/orcamentos/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar pedido");
            }
            return response.json();
        })
        .then(pedido => {
            document.getElementById("id-pedido-resposta").value = pedido.id;

            document.getElementById("info-pedido-funcionario").innerHTML = `
                <p><strong>Cliente:</strong> ${pedido.cliente?.pessoa?.nome|| "Não informado"}</p>
                <p><strong>Serviço:</strong> ${pedido.servicoNome || "-"}</p>
                <p><strong>Quantidade:</strong> ${pedido.quantidade || "-"}</p>
                <p><strong>Medida:</strong> ${pedido.medida || "-"}</p>
                <p><strong>Prazo:</strong> ${pedido.prazo || "-"}</p>
                <p><strong>Material:</strong> ${pedido.material || "-"}</p>
                <p><strong>Observações:</strong> ${pedido.observacoesCliente || "-"}</p>
                <p><strong>Status:</strong> ${pedido.status || "-"}</p>
            `;


            mostrarTela("detalhe-pedido-funcionario");
        })
        .catch(error => {
            console.error("Erro ao abrir pedido:", error);
            alert("Erro ao abrir pedido.");
        });
}

function responderPedidoFuncionario() {
    const id = document.getElementById("id-pedido-resposta").value;
    const valorEstimado = document.getElementById("valorEstimadoResposta").value;
    const status = document.getElementById("statusRespostaFuncionario").value;
    const respostaFuncionario = document.getElementById("textoRespostaFuncionario").value;

    if (!id) {
        alert("Nenhum pedido selecionado.");
        return;
    }

    if (!respostaFuncionario.trim()) {
        alert("Digite uma resposta para o cliente.");
        return;
    }

    const dadosResposta = {
    funcionario: {
        id: funcionarioLogadoId
    },
    respostaFuncionario: respostaFuncionario,
    status: status,
    valorEstimado: valorEstimado ? parseFloat(valorEstimado) : null
};

    fetch(`http://localhost:8080/orcamentos/${id}/responder`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosResposta)
    })
        .then(async response => {
            const texto = await response.text();

            if (!response.ok) {
                throw new Error(texto || "Erro ao responder pedido");
            }

            return texto;
        })
        .then((mensagem) => {
            alert(mensagem);
            mostrarTela("pedidos-funcionario");
        })
        .catch(error => {
            console.error("Erro ao responder pedido:", error);
            alert("Erro ao responder pedido: " + error.message);
        });
}

function carregarMensagensPedidoFuncionario(idPedido) {
    const chat = document.getElementById("chat-pedido-funcionario");

    if (!chat) return;

    chat.innerHTML = `
        <div class="card-pedido-cliente">
            <p>Carregando conversa...</p>
        </div>
    `;

    fetch(`http://localhost:8080/orcamentos/${idPedido}/mensagens`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar mensagens");
            }
            return response.json();
        })
        .then(mensagens => {
            chat.innerHTML = "";

            if (!mensagens || mensagens.length === 0) {
                chat.innerHTML = `
                    <div class="card-pedido-cliente">
                        <p>Ainda não há mensagens nesta conversa.</p>
                    </div>
                `;
                return;
            }

            mensagens.forEach(msg => {
                chat.innerHTML += `
                    <div class="card-pedido-cliente">
                        <p><strong>${msg.remetenteTipo}:</strong> ${msg.mensagem}</p>
                        <p><strong>Data:</strong> ${msg.dataHora || "-"}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar mensagens:", error);
            chat.innerHTML = `
                <div class="card-pedido-cliente">
                    <p>Erro ao carregar conversa.</p>
                </div>
            `;
        });
}

function enviarRespostaFuncionario() {
    const texto = document.getElementById("respostaFuncionarioTexto").value;

    if (!pedidoAtualId) {
        alert("Nenhum pedido selecionado.");
        return;
    }

    if (!texto.trim()) {
        alert("Digite uma mensagem.");
        return;
    }

    fetch(`http://localhost:8080/orcamentos/${pedidoAtualId}/mensagens`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            remetenteTipo: "FUNCIONARIO",
            mensagem: texto
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao enviar resposta");
            }
            return response.json();
        })
        .then(() => {
            document.getElementById("respostaFuncionarioTexto").value = "";
            carregarMensagensPedidoFuncionario(pedidoAtualId);
            alert("Resposta enviada com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao responder:", error);
            alert("Erro ao enviar resposta.");
        });
}

function abrirDetalhePedidoCliente(id) {
    console.log("ID DO PEDIDO CLICADO:", id);

    mostrarTela("detalhe-pedido-cliente");

    const conteudo = document.getElementById("conteudo-detalhe-pedido-cliente");

    if (conteudo) {
        conteudo.innerHTML = `<p>Carregando detalhes do pedido...</p>`;
    }

    fetch(`http://localhost:8080/orcamentos/${id}`)
        .then(async response => {
            console.log("STATUS DA RESPOSTA:", response.status);

            if (!response.ok) {
                const texto = await response.text();
                throw new Error(texto || "Erro ao buscar pedido");
            }

            return response.json();
        })
        .then(pedido => {
            console.log("PEDIDO RETORNADO:", pedido);

            const mensagemWhats = `Olá! Realizei um pedido pelo site da Digimax e recebi o retorno sobre a minha solicitação. Gostaria de dar andamento ao atendimento, por favor.`;

            const linkWhats = `https://wa.me/5517981410402?text=${encodeURIComponent(mensagemWhats)}`;

            conteudo.innerHTML = `
                <p><strong>Serviço:</strong> ${pedido.servicoNome || "-"}</p>
                <p><strong>Status:</strong> ${pedido.status || "-"}</p>
                <p><strong>Quantidade:</strong> ${pedido.quantidade || "-"}</p>
                <p><strong>Medida:</strong> ${pedido.medida || "-"}</p>
                <p><strong>Prazo:</strong> ${pedido.prazo || "-"}</p>
                <p><strong>Material:</strong> ${pedido.material || "-"}</p>
                <p><strong>Observações do pedido:</strong> ${pedido.observacoesCliente || "-"}</p>
                <p><strong>Valor estimado:</strong> ${pedido.valorEstimado ? "R$ " + pedido.valorEstimado : "Aguardando"}</p>
                <p><strong>Resposta da Digimax:</strong> ${pedido.respostaFuncionario || "Aguardando retorno."}</p>

${pedido.respostaFuncionario ? `
    <button type="button" class="btn-whats-andamento" onclick='gerarProtocoloPDF(${JSON.stringify(pedido)})'>
        📄 Baixar protocolo em PDF
    </button>
` : ""}

${pedido.respostaFuncionario ? `
    <a href="${linkWhats}" target="_blank" class="btn-whats-andamento">
        💬 Continuar atendimento pelo WhatsApp
    </a>
` : ""}
            `;

            if (pedido.respostaFuncionario && pedido.visualizadoCliente === false) {
                fetch(`http://localhost:8080/orcamentos/${id}/visualizado-cliente`, {
                    method: "PUT"
                }).catch(error => console.error("Erro ao marcar visualização do cliente:", error));
            }
        })
        .catch(error => {
            console.error("ERRO AO ABRIR DETALHE DO PEDIDO:", error);

            conteudo.innerHTML = `
                <p style="color:red;"><strong>Erro ao carregar pedido:</strong> ${error.message}</p>
            `;
        });
}
function carregarMensagensPedidoCliente(idPedido) {
    const chat = document.getElementById("chat-pedido-cliente");

    if (!chat) return;

    chat.innerHTML = `
        <div class="card-pedido-cliente">
            <p>Carregando conversa...</p>
        </div>
    `;

    fetch(`http://localhost:8080/orcamentos/${idPedido}/mensagens`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar mensagens");
            }
            return response.json();
        })
        .then(mensagens => {
            chat.innerHTML = "";

            if (!mensagens || mensagens.length === 0) {
                chat.innerHTML = `
                    <div class="card-pedido-cliente">
                        <p>Ainda não há mensagens nesta conversa.</p>
                    </div>
                `;
                return;
            }

            mensagens.forEach(msg => {
                chat.innerHTML += `
                    <div class="card-pedido-cliente">
                        <p><strong>${msg.remetenteTipo}:</strong> ${msg.mensagem}</p>
                        <p><strong>Data:</strong> ${msg.dataHora || "-"}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar mensagens do cliente:", error);
            chat.innerHTML = `
                <div class="card-pedido-cliente">
                    <p>Erro ao carregar conversa.</p>
                </div>
            `;
        });
}

function enviarRespostaCliente() {
    const texto = document.getElementById("respostaClienteTexto").value;

    if (!pedidoAtualId) {
        alert("Nenhum pedido selecionado.");
        return;
    }

    if (!texto.trim()) {
        alert("Digite uma mensagem.");
        return;
    }

    fetch(`http://localhost:8080/orcamentos/${pedidoAtualId}/mensagens`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            remetenteTipo: "CLIENTE",
            mensagem: texto
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao enviar mensagem");
            }
            return response.json();
        })
        .then(() => {
            document.getElementById("respostaClienteTexto").value = "";
            carregarMensagensPedidoCliente(pedidoAtualId);
            alert("Mensagem enviada com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao responder como cliente:", error);
            alert("Erro ao enviar mensagem.");
        });
}

function carregarPedidosNovosFuncionario() {
    const lista = document.getElementById("lista-pedidos-funcionario");

    if (!lista) return;

    lista.innerHTML = `
        <div class="painel-card">
            <h3>Carregando...</h3>
            <p>Buscando pedidos novos.</p>
        </div>
    `;

    fetch("http://localhost:8080/orcamentos/novos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar pedidos novos");
            }
            return response.json();
        })
        .then(pedidos => {
            lista.innerHTML = "";

            if (!pedidos || pedidos.length === 0) {
                lista.innerHTML = `
                    <div class="painel-card">
                        <h3>Nenhum pedido novo</h3>
                        <p>No momento não há novos pedidos aguardando atendimento.</p>
                    </div>
                `;
                return;
            }

            pedidos.forEach(pedido => {
                lista.innerHTML += `
                    <div class="painel-card">
                        <h3>${pedido.servicoNome || "Serviço não informado"}</h3>
                        <p><strong>Cliente:</strong> ${pedido.cliente?.pessoa?.nome || "Não informado"}</p>
                        <p><strong>Status:</strong> ${pedido.status || "PENDENTE"}</p>
                        <p><strong>Quantidade:</strong> ${pedido.quantidade || "-"}</p>
                        <p><strong>Prazo:</strong> ${pedido.prazo || "-"}</p>
                        <p><strong>Observações:</strong> ${pedido.observacoesCliente || "-"}</p>

                        <div class="cliente-acoes">
                            <button class="btn-editar" onclick="abrirDetalhePedidoFuncionario(${pedido.id})">
                                Abrir pedido
                            </button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar pedidos novos:", error);
            lista.innerHTML = `
                <div class="painel-card">
                    <h3>Erro ao carregar</h3>
                    <p>Não foi possível buscar os pedidos novos.</p>
                </div>
            `;
        });
}

function carregarHistoricoPedidosFuncionario() {
    const lista = document.getElementById("lista-historico-pedidos-funcionario");

    if (!lista) return;

    lista.innerHTML = `
        <div class="painel-card">
            <h3>Carregando...</h3>
            <p>Buscando histórico de pedidos.</p>
        </div>
    `;

    fetch("http://localhost:8080/orcamentos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar histórico");
            }
            return response.json();
        })
        .then(pedidos => {
            console.log("HISTÓRICO PEDIDOS FUNCIONÁRIO:", pedidos);

            lista.innerHTML = "";

            if (!pedidos || pedidos.length === 0) {
                lista.innerHTML = `
                    <div class="painel-card">
                        <h3>Nenhum pedido encontrado</h3>
                        <p>Não há pedidos cadastrados.</p>
                    </div>
                `;
                return;
            }

            pedidos.forEach(pedido => {
                lista.innerHTML += `
                    <div class="painel-card">
                        <h3>${pedido.servicoNome || "Serviço não informado"}</h3>
                        <p><strong>Cliente:</strong> ${pedido.cliente?.pessoa?.nome || "Não informado"}</p>
                        <p><strong>Status:</strong> ${pedido.status || "-"}</p>
                        <p><strong>Valor:</strong> ${pedido.valorEstimado ? "R$ " + pedido.valorEstimado : "-"}</p>
                        <p><strong>Resposta:</strong> ${pedido.respostaFuncionario || "Sem resposta"}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar histórico:", error);
            lista.innerHTML = `
                <div class="painel-card">
                    <h3>Erro ao carregar</h3>
                    <p>Não foi possível buscar o histórico.</p>
                </div>
            `;
        });
}

function atualizarTituloPainelStaff() {
    const titulo = document.querySelector("#home-funcionario .staff-topo-esquerda h1");

    if (!titulo) return;

    if (tipoUsuario === "admin") {
        titulo.innerText = "Painel do Administrador";
    } else {
        titulo.innerText = "Painel do Funcionário";
    }
}

function filtrarServicos(categoria) {
    const cards = document.querySelectorAll(".card-servico");
    const botoes = document.querySelectorAll(".filtro");

    // controla botão ativo
    botoes.forEach(btn => btn.classList.remove("ativo"));
    event.target.classList.add("ativo");

    cards.forEach(card => {
        const cat = card.getAttribute("data-categoria");

        if (categoria === "todos" || cat === categoria) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const formEnviarFeedback = document.getElementById("formEnviarFeedback");

    if (formEnviarFeedback) {
        formEnviarFeedback.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!clienteLogadoId) {
                alert("Faça login como cliente para enviar feedback.");
                return;
            }

            const nota = document.getElementById("feedbackNota").value;
            const comentario = document.getElementById("feedbackComentario").value;

            if (!nota || !comentario.trim()) {
                alert("Preencha a nota e o comentário.");
                return;
            }

            const feedback = {
                cliente: { id: clienteLogadoId },
                nota: parseInt(nota),
                comentario: comentario
            };

            fetch("http://localhost:8080/feedbacks/enviar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(feedback)
            })
                .then(async response => {
                    const texto = await response.text();

                    if (!response.ok) {
                        throw new Error(texto || "Erro ao enviar feedback");
                    }

                    return texto;
                })
                .then(() => {
                    alert("Feedback enviado com sucesso!");
                    formEnviarFeedback.reset();
                    mostrarTela("home");
                })
                .catch(error => {
                    console.error("Erro ao enviar feedback:", error);
                    alert("Erro ao enviar feedback: " + error.message);
                });
        });
    }
});

function carregarFeedbacksInternos() {
    const lista = document.getElementById("lista-feedbacks-internos");

    if (!lista) return;

    lista.innerHTML = `
        <div class="painel-card">
            <h3>Carregando...</h3>
            <p>Buscando feedbacks enviados pelos clientes.</p>
        </div>
    `;

    fetch("http://localhost:8080/feedbacks")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar feedbacks");
            }

            return response.json();
        })
        .then(feedbacks => {
            lista.innerHTML = "";

            if (!feedbacks || feedbacks.length === 0) {
                lista.innerHTML = `
                    <div class="painel-card">
                        <h3>Nenhum feedback encontrado</h3>
                        <p>Ainda não há feedbacks enviados pelos clientes.</p>
                    </div>
                `;
                return;
            }

            feedbacks.forEach(feedback => {
                lista.innerHTML += `
                    <div class="painel-card">
                        <h3>${feedback.cliente?.pessoa?.nome || "Cliente não informado"}</h3>
                        <p><strong>E-mail:</strong> ${feedback.cliente?.pessoa?.email || "-"}</p>
                        <p><strong>Nota:</strong> ${"⭐".repeat(feedback.nota || 0)}</p>
                        <p><strong>Comentário:</strong> ${feedback.comentario || "-"}</p>
                        <p><strong>Data:</strong> ${feedback.data || "-"}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar feedbacks:", error);

            lista.innerHTML = `
                <div class="painel-card">
                    <h3>Erro ao carregar</h3>
                    <p>Não foi possível buscar os feedbacks.</p>
                </div>
            `;
        });
}

function atualizarBadgePedidosFuncionario() {
    const badge = document.getElementById("badge-pedidos-funcionario");

    if (!badge) return;

    fetch("http://localhost:8080/orcamentos/novos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar pedidos novos");
            }

            return response.json();
        })
        .then(pedidos => {
            const total = pedidos ? pedidos.length : 0;

            if (total > 0) {
                badge.innerText = total;
                badge.classList.remove("hidden");
            } else {
                badge.innerText = "0";
                badge.classList.add("hidden");
            }
        })
        .catch(error => {
            console.error("Erro ao atualizar badge de pedidos:", error);
        });
}

function atualizarBadgeMeusPedidos() {
    const badge = document.getElementById("badge-meus-pedidos");

    if (!badge || !clienteLogadoId) return;

    fetch(`http://localhost:8080/orcamentos/cliente/${clienteLogadoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar pedidos do cliente");
            }

            return response.json();
        })
        .then(pedidos => {
            const totalNovos = pedidos.filter(pedido =>
                pedido.respostaFuncionario && pedido.visualizadoCliente === false
            ).length;

            if (totalNovos > 0) {
                badge.innerText = totalNovos;
                badge.classList.remove("hidden");
            } else {
                badge.innerText = "0";
                badge.classList.add("hidden");
            }
        })
        .catch(error => {
            console.error("Erro ao atualizar badge do cliente:", error);
        });
}

function atualizarBadgesNavbar() {
    if (tipoUsuario === "cliente") {
        atualizarBadgeMeusPedidos();
    }

    if (tipoUsuario === "funcionario" || tipoUsuario === "admin") {
        atualizarBadgePedidosFuncionario();
    }
}

function gerarProtocoloPDF(pedido) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const protocolo = `DIGIMAX-${String(pedido.id).padStart(5, "0")}`;
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    // Fundo do cabeçalho
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, 210, 35, "F");

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Gráfica Digimax", 15, 15);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Protocolo de Pedido", 15, 24);

    // Protocolo
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Protocolo: ${protocolo}`, 15, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Emitido em: ${dataAtual}`, 15, 58);

    // Card dados principais
    doc.setFillColor(246, 246, 246);
    doc.roundedRect(15, 68, 180, 55, 4, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Dados do Pedido", 22, 80);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Cliente: ${pedido.cliente?.pessoa?.nome || "-"}`, 22, 91);
    doc.text(`Serviço: ${pedido.servicoNome || "-"}`, 22, 100);
    doc.text(`Status: ${pedido.status || "-"}`, 22, 109);
    doc.text(`Valor estimado: ${pedido.valorEstimado ? "R$ " + pedido.valorEstimado : "Aguardando"}`, 22, 118);

    // Detalhes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Detalhes da Solicitação", 15, 140);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    let y = 151;

    const linhas = [
        `Quantidade: ${pedido.quantidade || "-"}`,
        `Medida: ${pedido.medida || "-"}`,
        `Prazo: ${pedido.prazo || "-"}`,
        `Material: ${pedido.material || "-"}`,
        `Frente/Verso: ${pedido.frenteVerso || "-"}`,
        `Furo: ${pedido.furo || "-"}`
    ];

    linhas.forEach(linha => {
        doc.text(linha, 15, y);
        y += 9;
    });

    // Observações
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Observações do Cliente:", 15, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    const obs = doc.splitTextToSize(pedido.observacoesCliente || "-", 180);
    doc.text(obs, 15, y);

    y += obs.length * 7 + 8;

    // Resposta Digimax
    doc.setFont("helvetica", "bold");
    doc.text("Resposta da Digimax:", 15, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    const resposta = doc.splitTextToSize(pedido.respostaFuncionario || "Aguardando retorno.", 180);
    doc.text(resposta, 15, y);

    // Rodapé
    doc.setFillColor(0, 191, 255);
    doc.rect(0, 285, 210, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Documento gerado automaticamente pelo sistema da Gráfica Digimax.", 15, 293);

    doc.save(`${protocolo}.pdf`);
}

function carregarServicosDoBanco() {
    fetch("http://localhost:8080/servicos")
        .then(response => response.json())
        .then(lista => {
            lista.forEach(servico => {
                const chave = gerarChaveServico(servico.nome);
                servicosIds[chave] = servico.id;
            });

            console.log("Serviços carregados do banco:", servicosIds);
        })
        .catch(error => {
            console.error("Erro ao carregar serviços:", error);
        });
}

function gerarChaveServico(nome) {
    return nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace("impressao comum", "impressao")
        .replace("cartao de visita", "cartao")
        .replace("etiqueta escolar", "etiqueta")
        .replace("criar arte", "arte")
        .replace("topo de bolo", "bolo")
        .replace("servico online", "online")
        .replace(/\s+/g, "");
}

function alternarDaltonismo() {
    document.body.classList.toggle("daltonismo");
}












