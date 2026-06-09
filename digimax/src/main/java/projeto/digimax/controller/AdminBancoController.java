package projeto.digimax.controller;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminBancoController {

    private final JdbcTemplate jdbcTemplate;

    public AdminBancoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/admin-bd/view-orcamentos")
    // http://localhost:8080/admin-bd/view-orcamentos
    public List<Map<String, Object>> consultarViewOrcamentos() {
        return jdbcTemplate.queryForList("select * from v_Relatorio_Orcamentos_Digimax");
    }

    @GetMapping("/admin-bd/function-orcamentos")
    // http://localhost:8080/admin-bd/function-orcamentos
    public List<Map<String, Object>> consultarFunctionOrcamentos() {
        return jdbcTemplate.queryForList(
            "select * from fc_RelatorioOrcamentos_Digimax('pendente', 0, 10)"
        );
    }

    @GetMapping("/admin-bd/procedure-funcionario")
public List<Map<String, Object>> executarProcedureFuncionario() {

    System.out.println("EXECUTANDO PROCEDURE");

    jdbcTemplate.update(
        "exec sp_CadFuncionario_Digimax ?, ?, ?, ?, ?",
        "Miguel Lourenço",
        "miguel.lourenco@digimax.com",
        "123456",
        "miguelfunc",
        1
    );

    return jdbcTemplate.queryForList(
        "select p.id, p.nome, p.email, f.usuario, f.cargo_id " +
        "from pessoa p " +
        "inner join funcionario f on p.id = f.id " +
        "where p.email = 'miguel.lourenco@digimax.com'"
    );
}

@GetMapping("/admin-bd/executar-trigger")
public String executarTrigger() {

    jdbcTemplate.update(
        "insert into orcamento " +
        "(cliente_id, funcionario_id, servico_id, descricao, valor_estimado, status) " +
        "values (?, ?, ?, ?, ?, ?)",
        1,
        null,
        1,
        "\"Orçamento criado via painel administrativo\"",
        150.00,
        "pendente"
    );

    return "Trigger executada com sucesso!";
}

@GetMapping("/admin-bd/backup")
public String realizarBackup() {
    // http://localhost:8080/admin-bd/backup

    jdbcTemplate.execute(
        "backup database banco_inter_4sem_digimax " +
        "to disk = 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Backup\\bkp-banco_inter_4sem_digimax-20260608.bak' " +
        "with init"
    );

    return "backup realizado com sucesso";
}

@GetMapping("/admin-bd/restore")
public String realizarRestore() {

    // http://localhost:8080/admin-bd/restore

    jdbcTemplate.execute(
        "alter database banco_inter_4sem_digimax " +
        "set single_user with rollback immediate"
    );

    jdbcTemplate.execute(
        "restore database banco_inter_4sem_digimax " +
        "from disk = 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Backup\\bkp-banco_inter_4sem_digimax-20260608.bak' " +
        "with replace"
    );

    jdbcTemplate.execute(
        "alter database banco_inter_4sem_digimax " +
        "set multi_user"
    );

    return "restore realizado com sucesso";
}
}
