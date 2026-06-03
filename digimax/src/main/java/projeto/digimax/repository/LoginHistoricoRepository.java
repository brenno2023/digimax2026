package projeto.digimax.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.LoginHistorico;

public interface LoginHistoricoRepository extends JpaRepository<LoginHistorico, Integer> {

    List<LoginHistorico> findByCliente_Id(Integer clienteId);

    List<LoginHistorico> findByFuncionario_Id(Integer funcionarioId);
}