package projeto.digimax.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Atendimento;
import projeto.digimax.repository.AtendimentoRepository;

@Service
@RequiredArgsConstructor
public class AtendimentoService {

    private final AtendimentoRepository repo;

    public Atendimento salvar(Atendimento atendimento) {
        return repo.save(atendimento);
    }

    public List<Atendimento> listar() {
        return repo.findAll();
    }

    public List<Atendimento> listarPorCliente(Integer clienteId) {
        return repo.findByCliente_Id(clienteId);
    }
}
