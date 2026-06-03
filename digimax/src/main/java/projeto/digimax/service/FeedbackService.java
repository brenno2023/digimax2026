package projeto.digimax.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Feedback;
import projeto.digimax.repository.FeedbackRepository;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository repo;

    public Feedback salvar(Feedback feedback) {
        feedback.setData(LocalDateTime.now());
        return repo.save(feedback);
    }

    public List<Feedback> listar() {
        return repo.findAll();
    }

    public List<Feedback> listarPorCliente(Integer clienteId) {
        return repo.findByCliente_Id(clienteId);
    }
}