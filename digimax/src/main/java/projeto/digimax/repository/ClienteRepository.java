package projeto.digimax.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

}