create database banco_inter_4sem_digimax;
go

use master
go

use banco_inter_4sem_digimax;
go

create table pessoa (
  id int primary key identity(1,1),
  nome varchar(100) not null,
  email varchar(100) unique,
  senha varchar(255) not null,
  tipo varchar(20) not null,
  status int default 1,
  data_cadastro datetime default getdate()
);

create table cliente (
  id int primary key,
  cpf_cnpj varchar(20) not null,
  telefone varchar(20) not null,
  cep varchar(8) not null,
  rua varchar(100) not null,
  numero varchar(10) not null,
  complemento varchar(100),
  bairro varchar(100) not null,
  cidade varchar(100) not null,
  estado varchar(2) not null,

  constraint fk_cliente_pessoa
  foreign key (id) references pessoa(id)
);
go

create table cargo (
  id int primary key identity(1,1),
  nome varchar(50) not null,
  descricao varchar(200)
);
go

create table funcionario (
  id int primary key,
  usuario varchar(50) unique not null,
  cargo_id int not null,

  constraint fk_funcionario_pessoa
  foreign key (id) references pessoa(id),

  constraint fk_funcionario_cargo
  foreign key (cargo_id) references cargo(id)
);
go

create table administrador (
  id int primary key,
  usuario varchar(50) unique not null,

  constraint fk_administrador_pessoa
  foreign key (id) references pessoa(id)
);
go

create table servico (
  id int primary key identity(1,1),
  nome varchar(100) not null,
  descricao varchar(max),
  preco_base decimal(10,2),
  tempo_estimado varchar(50)
);
go

create table orcamento (
  id int primary key identity(1,1),
  cliente_id int not null,
  funcionario_id int,
  servico_id int,
  descricao varchar(max) not null,
  valor_estimado decimal(10,2),
  data_solicitacao datetime default getdate(),
  status varchar(20) default 'pendente',

  constraint fk_orc_cliente
  foreign key (cliente_id) references cliente(id),

  constraint fk_orc_func
  foreign key (funcionario_id) references funcionario(id),

  constraint fk_orc_servico
  foreign key (servico_id) references servico(id)
);
go

create table atendimento (
  id int primary key identity(1,1),
  cliente_id int not null,
  funcionario_id int,
  mensagem varchar(max) not null,
  data_hora datetime default getdate(),
  tipo varchar(15) check (tipo in ('cliente','funcionario')),

  constraint fk_at_cliente
  foreign key (cliente_id) references cliente(id),

  constraint fk_at_func
  foreign key (funcionario_id) references funcionario(id)
);
go

create table feedback (
  id int primary key identity(1,1),
  cliente_id int,
  comentario varchar(max) not null,
  nota int check (nota between 1 and 5),
  data datetime default getdate(),

  constraint fk_fb_cliente
  foreign key (cliente_id) references cliente(id)
);
go

create table login_historico (
  id int primary key identity(1,1),
  pessoa_id int,
  data_hora datetime default getdate(),
  ip_acesso varchar(50),

  constraint fk_lh_pessoa
  foreign key (pessoa_id) references pessoa(id)
);
go



-- INSERTS

--============================================================
-- PESSOAS
--============================================================
insert into pessoa (nome,email,senha,tipo,status) values
('João Silva','joao@gmail.com','123456','cliente',1),
('Maria Oliveira','maria@gmail.com','234567','cliente',1),
('Carlos Souza','carlos@gmail.com','345678','cliente',1),
('Ana Paula','ana@gmail.com','456789','cliente',1),
('Pedro Henrique','pedro@gmail.com','567890','cliente',1),
('Ricardo Alves','ricardo@gmail.com','789012','cliente',1),
('Marcos Vinicius','marcos@gmail.com','11112222','funcionario',1),
('Lucas Ferreira','lucas@gmail.com','22223333','funcionario',1),
('Bruna Carvalho','bruna@gmail.com','33334444','funcionario',1),
('Roberto Almeida','roberto@gmail.com','66667777','admin',1),
('Camila Mendes','camila@gmail.com','77778888','admin',1);
go


--============================================================
-- CLIENTES
--============================================================
insert into cliente
(id,cpf_cnpj,telefone,cep,rua,numero,complemento,bairro,cidade,estado)
values
(1,'11111111111','17990000001','15000000','Rua A','10','Casa','Centro','São José do Rio Preto','SP'),
(2,'22222222222','17990000002','15000001','Rua B','20','Casa','Centro','São José do Rio Preto','SP'),
(3,'33333333333','17990000003','15000002','Rua C','30','Casa','Boa Vista','São José do Rio Preto','SP'),
(4,'44444444444','17990000004','15000003','Rua D','40','Casa','Jardim Primavera','São José do Rio Preto','SP'),
(5,'55555555555','17990000005','15000004','Rua E','50','Casa','Solo Sagrado','São José do Rio Preto','SP'),
(6,'66666666666','17990000006','15000005','Rua F','60','Casa','Centro','São José do Rio Preto','SP');
go



--============================================================
-- CARGOS
--============================================================
insert into cargo(nome,descricao)
values
('Designer','Criação de artes'),
('Atendente','Atendimento ao cliente'),
('Impressor','Produção gráfica');
go



--============================================================
-- FUNCIONÁRIOS
--============================================================
insert into funcionario
(id,usuario,cargo_id)
values
(7,'marcosv',1),
(8,'lucasf',2),
(9,'brunac',3);
go


--============================================================
-- ADMINISTRADORES
--============================================================
insert into administrador
(id,usuario)
values
(10,'admin01'),
(11,'admin02');
go


--============================================================
-- SERVIÇOS OFERECIDOS PELA DIGIMAX
--============================================================

insert into servico (nome, descricao, preco_base, tempo_estimado) values
('Impressão Comum', 'Impressões rápidas em preto e branco ou coloridas.', 0.00, 'A combinar'),
('Adesivo', 'Adesivo comum e vinil personalizado.', 0.00, 'A combinar'),
('Tag', 'Tags personalizadas para produtos, brindes e lembranças.', 0.00, 'A combinar'),
('Panfleto', 'Panfletos promocionais para divulgação.', 0.00, 'A combinar'),
('Cartão de Visita', 'Cartões de visita profissionais personalizados.', 0.00, 'A combinar'),
('Convite', 'Convites personalizados para eventos.', 0.00, 'A combinar'),
('Etiqueta Escolar', 'Etiquetas personalizadas para materiais escolares.', 0.00, 'A combinar'),
('Criar Arte', 'Criação de artes personalizadas para impressos e redes sociais.', 0.00, 'A combinar'),
('Topo de Bolo', 'Topos de bolo personalizados para festas.', 0.00, 'A combinar'),
('Encadernação', 'Encadernação de trabalhos, apostilas e documentos.', 0.00, 'A combinar'),
('Plastificação', 'Plastificação de documentos e materiais impressos.', 0.00, 'A combinar'),
('Serviço Online', 'Emissão de boletos, certidões, licenciamento e serviços digitais.', 0.00, 'A combinar')
go



--============================================================
-- ORÇAMENTOS 
--============================================================
insert into orcamento (cliente_id, funcionario_id, servico_id, descricao, valor_estimado, status) values
(1, 7, 1, 'Pedido de 500 cartões de visita coloridos', 80.00, 'aprovado'),
(2, 8, 2, 'Produção de 200 adesivos personalizados para vitrine da loja', 150.00, 'pendente'),
(3, 9, 3, 'Impressão de 5000 panfletos para divulgação de evento', 120.00, 'concluido');
go


--============================================================
-- FEEDBACKS DE CLIENTES DA DIGIMAX
--============================================================

insert into feedback (cliente_id, comentario, nota) values
(1, 'Atendimento excelente e entrega rápida. Recomendo a Digimax.', 5),
(2, 'Fiquei muito satisfeito com a qualidade da impressão.', 5),
(3, 'Serviço muito bom, mas o prazo poderia ser um pouco menor.', 4),
(4, 'Equipe atenciosa e arte desenvolvida exatamente como solicitado.', 5)
go


--============================================================
-- CONSULTAS DAS TABELAS COM DADOS INICIAIS
--============================================================

select * from pessoa
go

select * from cliente;
go

select * from funcionario;
go

select * from administrador;
go

select * from cargo;
go

select * from servico;
go

select * from orcamento;
go

select * from feedback;
go



-- INICIANDO ABAIXO A PARTE DE ADMINISTRAÇÃO DE BANCO DE DADOS:

--============================================================
-- VIEW: relatório completo dos orçamentos da Digimax
--
-- Objetivo:
-- Facilitar a consulta dos orçamentos realizados no sistema,
-- reunindo em uma única consulta os dados do cliente,
-- endereço, serviço solicitado, funcionário responsável,
-- valor estimado e situação do orçamento.
--============================================================

create view v_Relatorio_Orcamentos_Digimax
as
	select
		-- Dados principais do orçamento
		O.id               as No_Orcamento,
		O.data_solicitacao as Data_Orcamento,
		O.descricao        as Descricao_Orcamento,
		O.valor_estimado   as Valor_Estimado,

		-- Dados do cliente
		P.nome             as Cliente,
		P.email            as Email_Cliente,
		C.telefone         as Telefone,
		C.cidade           as Cidade,
		C.bairro           as Bairro,
		C.rua              as Rua,
		C.numero           as Numero,
		C.estado           as Estado,

		-- Dados do serviço solicitado
		S.nome             as Servico,
		S.preco_base       as Preco_Base_Servico,
		S.tempo_estimado   as Tempo_Estimado,

		-- Dados do funcionário responsável
		PF.nome            as Funcionario,
		F.usuario          as Usuario_Funcionario,

		-- Situação do orçamento traduzida para melhor entendimento
		case O.status
			when 'pendente' then 'Aguardando Resposta'
			when 'PENDENTE' then 'Aguardando Resposta'
			when 'respondido' then 'Respondido'
			when 'RESPONDIDO' then 'Respondido'
			else 'Sem Status'
		end as Situacao_Orcamento,

		-- Situação do cliente traduzida para melhor entendimento
		case P.status
			when 1 then 'Ativo'
			when 2 then 'Inativo'
			else 'Bloqueado'
		end as Situacao_Cliente

	from pessoa as P

	-- Relaciona a pessoa com seus dados de cliente
	inner join cliente as C
		on P.id = C.id

	-- Relaciona o cliente aos seus orçamentos
	inner join orcamento as O
		on C.id = O.cliente_id

	-- Relaciona o orçamento ao serviço solicitado
	left join servico as S
		on O.servico_id = S.id

	-- Relaciona o orçamento ao funcionário responsável
	left join funcionario as F
		on O.funcionario_id = F.id

	-- Busca o nome do funcionário na tabela pessoa
	left join pessoa as PF
		on F.id = PF.id
go


-- Testando a view
select * from v_Relatorio_Orcamentos_Digimax
go





--============================================================
-- PROCEDURE: Cadastrar um novo funcionário no sistema digimax
--
-- Objetivo:
-- Realizar o cadastro completo de um funcionário.
--
-- Observação:
-- todo funcionário também é uma pessoa,
-- portanto os dados serão gravados nas tabelas
-- pessoa e funcionario.
--============================================================


create procedure sp_CadFuncionario_Digimax
(
    @nomeFunc varchar(100),
    @emailFunc varchar(100),
    @senhaFunc varchar(255),
    @usuarioFunc varchar(50),
    @cargoId int
)
as
begin

    begin try

        begin tran

        insert into pessoa
        (
            nome,
            email,
            senha,
            tipo,
            status
        )
        values
        (
            @nomeFunc,
            @emailFunc,
            @senhaFunc,
            'funcionario',
            1
        )

        declare @idFunc int

        set @idFunc = scope_identity()

        insert into funcionario
        (
            id,
            usuario,
            cargo_id
        )
        values
        (
            @idFunc,
            @usuarioFunc,
            @cargoId
        )

        select
            p.id,
            p.nome,
            p.email,
            f.usuario,
            f.cargo_id
        from pessoa p
        inner join funcionario f
            on p.id = f.id
        where p.id = @idFunc

        commit tran

    end try

    begin catch

        if @@trancount > 0
            rollback tran

        select
            error_number() as NumeroErro,
            error_message() as MensagemErro

    end catch

end
go




--============================================================
-- testando a procedure
--============================================================

exec sp_CadFuncionario_Digimax
    'miguel lourenco',
    'miguel.lourenco@digimax.com',
    '123456',
    'miguelfunc',
    1
go



--============================================================
-- FUNCTION: Relatório detalhado de orçamentos da Digimax
-- TIPO: MULTI-STATEMENT TABLE VALUED FUNCTION
-- OBJETIVO:
-- Retornar uma tabela com dados completos dos orçamentos,
-- incluindo cliente, serviço, funcionário, status e cálculo
-- de valor com acréscimo.
--============================================================

create function fc_RelatorioOrcamentos_Digimax
(
	@StatusOrcamento varchar(20),
	@ValorMinimo decimal(10,2),
	@PercentualAcrescimo decimal(10,2)
)
returns @tb_RelatorioOrcamentos table
(
	No_Orcamento int,
	Data_Orcamento datetime,
	Cliente varchar(100),
	Telefone varchar(20),
	Cidade varchar(100),
	Bairro varchar(100),
	Servico varchar(100),
	Funcionario varchar(100),
	Valor_Original decimal(10,2),
	Valor_Com_Acrescimo decimal(10,2),
	Status_Orcamento varchar(30),
	Situacao_Cliente varchar(20)
)
as
begin

	insert into @tb_RelatorioOrcamentos
	(
		No_Orcamento,
		Data_Orcamento,
		Cliente,
		Telefone,
		Cidade,
		Bairro,
		Servico,
		Funcionario,
		Valor_Original,
		Valor_Com_Acrescimo,
		Status_Orcamento,
		Situacao_Cliente
	)

	select
		O.id,
		O.data_solicitacao,
		P.nome,
		C.telefone,
		C.cidade,
		C.bairro,
		S.nome,
		PF.nome,

		-- Valor original do orçamento
		O.valor_estimado,

		-- Valor calculado com acréscimo recebido por parâmetro
		O.valor_estimado + (O.valor_estimado * (@PercentualAcrescimo / 100.0)),

		-- Tradução do status do orçamento
		case O.status
			when 'pendente' then 'Aguardando Resposta'
			when 'respondido' then 'Respondido'
			else 'Sem Status'
		end,

		-- Tradução do status do cliente
		case P.status
			when 1 then 'Ativo'
			when 2 then 'Inativo'
			else 'Bloqueado'
		end

	from orcamento as O

	inner join cliente as C
		on O.cliente_id = C.id

	inner join pessoa as P
		on C.id = P.id

	left join servico as S
		on O.servico_id = S.id

	left join funcionario as F
		on O.funcionario_id = F.id

	left join pessoa as PF
		on F.id = PF.id

	where O.status = @StatusOrcamento
	and O.valor_estimado > @ValorMinimo

	return

end
go


--============================================================
-- TESTANDO A FUNCTION
--============================================================

select *
from fc_RelatorioOrcamentos_Digimax
(
    'pendente',
    0,
    10
)
go








--============================================================
-- TRIGGER: histórico de novos orçamentos cadastrados
--
-- Objetivo:
-- Criar um registro de log sempre que um novo orçamento
-- for cadastrado no sistema Digimax.
--============================================================


-- 1) Criar uma tabela de LOG para armazenar o histórico
-- de novos orçamentos cadastrados no sistema

create table LOG_HistoricoNovoOrcamento
(
	idOrcamento int          not null primary key references orcamento(id),
	idCliente   int          not null,
	idServico   int,
	descricao   varchar(max) not null,
	valor        decimal(10,2),
	status      varchar(20),
	data        datetime     not null,
	usuario     varchar(100) not null
)
go


-- 2) Criar uma trigger para cadastrar os dados na tabela
-- LOG_HistoricoNovoOrcamento sempre que um novo orçamento
-- for cadastrado
--
-- Tabela: orcamento
-- Operação/evento: insert
-- Tipo: AFTER

create trigger tg_HistNovoOrcamento
on    orcamento
after insert
as
begin
	-- cadastrar no log os dados do novo orçamento inserido
	insert into LOG_HistoricoNovoOrcamento
	(
		idOrcamento,
		idCliente,
		idServico,
		descricao,
		valor,
		status,
		data,
		usuario
	)
	select
		I.id,
		I.cliente_id,
		I.servico_id,
		I.descricao,
		I.valor_estimado,
		I.status,
		GETDATE(),
		SYSTEM_USER
	from inserted as I
end
go


-- 3) Testar a trigger
-- Cadastrar um novo orçamento para disparar a trigger

insert into orcamento
(
	cliente_id,
	funcionario_id,
	servico_id,
	descricao,
	valor_estimado,
	status
)
values
(
	1,
	null,
	1,
	'Orçamento para criação de cartão de visita frente e verso em papel couchê 300g',
	150.00,
	'pendente'
)
go


-- 4) Consultar a tabela de LOG para verificar
-- se a trigger registrou o novo orçamento

select * from LOG_HistoricoNovoOrcamento
go




