create database banco_inter_4sem_digimax;
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




select * from pessoa;
select * from cliente;
select * from cargo;
select * from funcionario;
select * from administrador;
select * from orcamento;
select * from atendimento;
select * from servico;
select * from feedback;
select * from login_historico;
go



-- 1) VIEW: relatório geral dos orçamentos da Digimax
-- Objetivo: facilitar a consulta dos pedidos com dados do cliente, serviço e funcionário

create view v_Orcamentos_Digimax
as
	select
		O.id               as No_Orcamento,
		O.data_solicitacao as Data_Orcamento,
		P.nome             as Cliente,
		C.telefone         as Telefone,
		C.cidade           as Cidade,
		C.bairro           as Bairro,
		S.nome             as Servico,
		O.quantidade       as Quantidade,
		O.valor_estimado   as Valor_Estimado,
		PF.nome            as Funcionario,

		-- Ajusta o status do orçamento para uma descrição mais clara
		case O.status
			when 'pendente' then 'Aguardando Resposta'
			when 'PENDENTE' then 'Aguardando Resposta'
			when 'respondido' then 'Respondido'
			when 'RESPONDIDO' then 'Respondido'
			else 'Sem Status'
		end Situacao_Orcamento,

		-- Mostra a situação do cliente no sistema
		case P.status
			when 1 then 'Ativo'
			when 2 then 'Inativo'
			else 'Bloqueado'
		end Situacao_Cliente

	from pessoa as P
	inner join cliente as C
		on P.id = C.id

	inner join orcamento as O
		on C.id = O.cliente_id

	left join servico as S
		on O.servico_id = S.id

	left join funcionario as F
		on O.funcionario_id = F.id

	left join pessoa as PF
		on F.id = PF.id
go

-- Testando a view
select * from v_Orcamentos_Digimax
go




-- 2) PROCEDURE: cadastrar um novo cliente no sistema Digimax
-- Observação: todo cliente também é uma pessoa

create procedure sp_CadCliente_Digimax
(
	@nomeCli varchar(100),
	@emailCli varchar(100),
	@senhaCli varchar(255),
	@cpfCnpjCli varchar(20),
	@telefoneCli varchar(20),
	@cepCli varchar(8),
	@ruaCli varchar(100),
	@numeroCli varchar(10),
	@complementoCli varchar(100),
	@bairroCli varchar(100),
	@cidadeCli varchar(100),
	@estadoCli varchar(2)
)
as
begin
	begin try
		begin tran

			-- inserir os dados na tabela pessoa
			insert into pessoa (nome, email, senha, tipo, status)
			values (@nomeCli, @emailCli, @senhaCli, 'cliente', 1)

			-- declarar uma variável para armazenar o id gerado pelo banco de dados
			declare @idCli int

			-- recuperar o id gerado pelo banco de dados
			set @idCli = @@IDENTITY

			-- inserir os dados na tabela cliente
			insert into cliente
			(
				id,
				cpf_cnpj,
				telefone,
				cep,
				rua,
				numero,
				complemento,
				bairro,
				cidade,
				estado
			)
			values
			(
				@idCli,
				@cpfCnpjCli,
				@telefoneCli,
				@cepCli,
				@ruaCli,
				@numeroCli,
				@complementoCli,
				@bairroCli,
				@cidadeCli,
				@estadoCli
			)

			commit
			print 'Cliente cadastrado com sucesso'

	end try

	begin catch
		rollback
		print 'Erro ao cadastrar Cliente'
	end catch
end
go


-- testar a procedure
exec sp_CadCliente_Digimax
'Maria Oliveira',
'maria@email.com',
'12345678',
'12345678901',
'17991370827',
'15000000',
'Rua das Flores',
'100',
'Casa',
'Centro',
'São José do Rio Preto',
'SP'
go


select * from pessoa
go

select * from cliente
go












-----------------------------------------
-- COISAS PRA EXECUTAR PRO PROJETO RODAR
-----------------------------------------

CREATE USER aluno FOR LOGIN aluno;
GO

ALTER ROLE db_owner ADD MEMBER aluno;
GO


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



alter table orcamento add servico_nome varchar(100);
alter table orcamento add quantidade varchar(50);
alter table orcamento add medida varchar(100);
alter table orcamento add prazo varchar(100);
alter table orcamento add material varchar(100);
alter table orcamento add frente_verso varchar(50);
alter table orcamento add furo varchar(50);
alter table orcamento add observacoes_cliente varchar(max);
alter table orcamento add resposta_funcionario varchar(max);
alter table orcamento add visualizado_cliente bit default 0;
alter table orcamento add visualizado_funcionario bit default 0;
go


insert into pessoa (nome, email, senha, tipo, status) 
values ('Administrador Digimax', 'admin@digimax.com', '12345678', 'admin', 1);
go

insert into administrador (id, usuario) 
values (@@IDENTITY, 'admin01');
go



insert into cargo (nome, descricao) values ('Designer', 'Responsável pela criação de artes e materiais gráficos.');
go

insert into cargo (nome, descricao) values ('Atendente', 'Responsável pelo atendimento aos clientes e organização dos pedidos.');
go

insert into cargo (nome, descricao) values ('Impressor', 'Responsável pela impressão, acabamento e produção dos materiais.');
go

select * from cargo
go