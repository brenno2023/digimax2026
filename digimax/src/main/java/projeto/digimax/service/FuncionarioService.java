package projeto.digimax.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.dto.LoginFuncionarioRequest;
import projeto.digimax.entity.Funcionario;
import projeto.digimax.entity.Pessoa;
import projeto.digimax.repository.FuncionarioRepository;
import projeto.digimax.repository.PessoaRepository;

@Service
@RequiredArgsConstructor
public class FuncionarioService {

    private final FuncionarioRepository repo;
    private final PessoaRepository pessoaRepository;

    public Funcionario salvar(Funcionario funcionario) {
        funcionario.setUsuario(funcionario.getUsuario().trim().toLowerCase());

        Pessoa pessoa = funcionario.getPessoa();
        pessoa.setSenha(pessoa.getSenha().trim());
        pessoa.setTipo("funcionario");
        pessoa.setStatus(1);
        pessoa.setDataCadastro(LocalDateTime.now());

        funcionario.setPessoa(pessoa);

        return repo.save(funcionario);
    }

    public List<Funcionario> listar() {
        return repo.findAll();
    }

    public Optional<Funcionario> buscarPorUsuario(String usuario) {
        return repo.findByUsuario(usuario.trim().toLowerCase());
    }

    public Optional<Funcionario> buscarPorId(Integer id) {
        return repo.findById(id);
    }

    public Funcionario atualizar(Integer id, Funcionario funcionarioAtualizado) {
        Funcionario funcionarioExistente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Pessoa pessoaExistente = funcionarioExistente.getPessoa();
        Pessoa pessoaAtualizada = funcionarioAtualizado.getPessoa();

        if (pessoaAtualizada.getNome() != null) {
            pessoaExistente.setNome(pessoaAtualizada.getNome());
        }

        if (funcionarioAtualizado.getCargo() != null) {
            funcionarioExistente.setCargo(funcionarioAtualizado.getCargo());
        }

        return repo.save(funcionarioExistente);
    }

    public void excluir(Integer id) {
        Funcionario funcionario = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Pessoa pessoa = funcionario.getPessoa();

        pessoa.setStatus(2);

        pessoaRepository.save(pessoa);
    }

    public Funcionario login(LoginFuncionarioRequest request) {
        String usuario = request.getUsuario().trim().toLowerCase();
        String senha = request.getSenha().trim();

        Optional<Funcionario> funcionarioOpt = repo.findByUsuario(usuario);

        if (funcionarioOpt.isEmpty()) {
            return null;
        }

        Funcionario funcionario = funcionarioOpt.get();

        if (funcionario.getPessoa().getSenha().equals(senha)) {
            return funcionario;
        }

        return null;
    }
}