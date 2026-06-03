package projeto.digimax.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Orcamento;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Integer> {

    List<Orcamento> findByCliente_Id(Integer clienteId);

    List<Orcamento> findByVisualizadoFuncionarioFalse();

    List<Orcamento> findByCliente_IdAndVisualizadoClienteFalse(Integer clienteId);
}