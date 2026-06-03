package projeto.digimax.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import projeto.digimax.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    List<Feedback> findByCliente_Id(Integer clienteId);
}
