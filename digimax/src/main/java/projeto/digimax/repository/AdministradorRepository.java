package projeto.digimax.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByUsuario(String usuario);
}