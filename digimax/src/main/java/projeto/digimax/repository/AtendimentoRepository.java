package projeto.digimax.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Atendimento;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Integer> {

    List<Atendimento> findByCliente_Id(Integer clienteId);

    List<Atendimento> findByFuncionario_Id(Integer funcionarioId);
}
