package projeto.digimax.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Funcionario;
import projeto.digimax.entity.Orcamento;
import projeto.digimax.entity.Servico;
import projeto.digimax.repository.FuncionarioRepository;
import projeto.digimax.repository.OrcamentoRepository;
import projeto.digimax.repository.ServicoRepository;

@Service
@RequiredArgsConstructor
public class OrcamentoService {

    private final OrcamentoRepository repo;
    private final FuncionarioRepository funcionarioRepository;
    private final ServicoRepository servicoRepository;

    public Orcamento salvar(Orcamento orcamento) {
        if (orcamento.getStatus() == null || orcamento.getStatus().isBlank()) {
            orcamento.setStatus("PENDENTE");
        }

        if (orcamento.getDataSolicitacao() == null) {
            orcamento.setDataSolicitacao(LocalDateTime.now());
        }

        if (orcamento.getVisualizadoCliente() == null) {
            orcamento.setVisualizadoCliente(false);
        }

        if (orcamento.getVisualizadoFuncionario() == null) {
            orcamento.setVisualizadoFuncionario(false);
        }

        if (orcamento.getServico() != null && orcamento.getServico().getId() != null) {
            Integer servicoId = orcamento.getServico().getId();

            Servico servico = servicoRepository.findById(servicoId)
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

            orcamento.setServico(servico);
        }

        return repo.save(orcamento);
    }

    public List<Orcamento> listar() {
        return repo.findAll();
    }

    public List<Orcamento> listarPorCliente(Integer clienteId) {
        return repo.findByCliente_Id(clienteId);
    }

    public List<Orcamento> listarNovosParaFuncionario() {
        return repo.findByVisualizadoFuncionarioFalse();
    }

    public List<Orcamento> listarRespostasNovasCliente(Integer clienteId) {
        return repo.findByCliente_IdAndVisualizadoClienteFalse(clienteId);
    }

    public Orcamento responder(Integer id, Orcamento dadosResposta) {
        Optional<Orcamento> orcamentoOpt = repo.findById(id);

        if (orcamentoOpt.isEmpty()) {
            throw new RuntimeException("Orçamento não encontrado");
        }

        Orcamento orcamento = orcamentoOpt.get();

        if (dadosResposta.getFuncionario() != null && dadosResposta.getFuncionario().getId() != null) {
            Integer funcionarioId = dadosResposta.getFuncionario().getId();

            Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

            orcamento.setFuncionario(funcionario);
        }

        if (dadosResposta.getValorEstimado() != null) {
            orcamento.setValorEstimado(dadosResposta.getValorEstimado());
        }

        if (dadosResposta.getRespostaFuncionario() != null) {
            orcamento.setRespostaFuncionario(dadosResposta.getRespostaFuncionario());
        }

        if (dadosResposta.getStatus() != null && !dadosResposta.getStatus().isBlank()) {
            orcamento.setStatus(dadosResposta.getStatus());
        } else {
            orcamento.setStatus("RESPONDIDO");
        }

        orcamento.setVisualizadoCliente(false);
        orcamento.setVisualizadoFuncionario(true);

        return repo.save(orcamento);
    }

    public Orcamento marcarVisualizadoFuncionario(Integer id) {
        Orcamento orcamento = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));

        orcamento.setVisualizadoFuncionario(true);
        return repo.save(orcamento);
    }

    public Orcamento marcarVisualizadoCliente(Integer id) {
        Orcamento orcamento = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));

        orcamento.setVisualizadoCliente(true);
        return repo.save(orcamento);
    }

    public Orcamento buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
    }
}