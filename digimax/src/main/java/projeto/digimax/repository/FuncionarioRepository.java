package projeto.digimax.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {

    Optional<Funcionario> findByUsuario(String usuario);
}