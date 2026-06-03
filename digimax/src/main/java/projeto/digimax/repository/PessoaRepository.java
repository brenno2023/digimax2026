package projeto.digimax.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Integer> {

    boolean existsByEmail(String email);

    Optional<Pessoa> findByEmail(String email);
}
