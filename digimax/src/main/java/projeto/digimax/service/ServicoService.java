package projeto.digimax.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Servico;
import projeto.digimax.repository.ServicoRepository;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository repo;

    public Servico salvar(Servico servico) {
        return repo.save(servico);
    }

    public List<Servico> listar() {
        return repo.findAll();
    }
}