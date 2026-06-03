package projeto.digimax.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.dto.LoginClienteResponse;
import projeto.digimax.dto.LoginRequest;
import projeto.digimax.entity.Cliente;
import projeto.digimax.entity.Pessoa;
import projeto.digimax.repository.ClienteRepository;
import projeto.digimax.repository.PessoaRepository;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;
    private final PessoaRepository pessoaRepository;

    public String cadastrar(Cliente cliente) {

        String email = cliente.getPessoa().getEmail().trim().toLowerCase();

        if (pessoaRepository.existsByEmail(email)) {
            return "E-mail já cadastrado!";
        }

        Pessoa pessoa = cliente.getPessoa();
        pessoa.setEmail(email);
        pessoa.setSenha(pessoa.getSenha().trim());
        pessoa.setTipo("cliente");
        pessoa.setDataCadastro(LocalDateTime.now());
        pessoa.setStatus(1);

        cliente.setPessoa(pessoa);

        repository.save(cliente);

        return "Cliente cadastrado com sucesso!";
    }

    public LoginClienteResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String senha = request.getSenha().trim();

        Optional<Pessoa> pessoaOpt = pessoaRepository.findByEmail(email);

        if (pessoaOpt.isEmpty()) {
            return null;
        }

        Pessoa pessoa = pessoaOpt.get();

        if (!pessoa.getSenha().equals(senha)) {
            return null;
        }

        Optional<Cliente> clienteOpt = repository.findById(pessoa.getId());

        if (clienteOpt.isEmpty()) {
            return null;
        }

        Cliente cliente = clienteOpt.get();

        return new LoginClienteResponse(
                cliente.getId(),
                pessoa.getNome(),
                pessoa.getEmail()
        );
    }

    public List<Cliente> listarClientes() {
        return repository.findAll();
    }

    public Cliente atualizarCliente(Integer id, Cliente clienteAtualizado) {
        Cliente clienteExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));

        Pessoa pessoaExistente = clienteExistente.getPessoa();
        Pessoa pessoaAtualizada = clienteAtualizado.getPessoa();

        String email = pessoaAtualizada.getEmail().trim().toLowerCase();

        if (!pessoaExistente.getEmail().equals(email) && pessoaRepository.existsByEmail(email)) {
            throw new RuntimeException("E-mail já cadastrado para outro cliente!");
        }

        pessoaExistente.setNome(pessoaAtualizada.getNome());
        pessoaExistente.setEmail(email);
        pessoaExistente.setSenha(pessoaAtualizada.getSenha().trim());

        clienteExistente.setCpfCnpj(clienteAtualizado.getCpfCnpj());
        clienteExistente.setTelefone(clienteAtualizado.getTelefone());
        clienteExistente.setCep(clienteAtualizado.getCep());
        clienteExistente.setRua(clienteAtualizado.getRua());
        clienteExistente.setNumero(clienteAtualizado.getNumero());
        clienteExistente.setComplemento(clienteAtualizado.getComplemento());
        clienteExistente.setBairro(clienteAtualizado.getBairro());
        clienteExistente.setCidade(clienteAtualizado.getCidade());
        clienteExistente.setEstado(clienteAtualizado.getEstado());

        return repository.save(clienteExistente);
    }

    public void deletarCliente(Integer id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Pessoa pessoa = cliente.getPessoa();

        pessoa.setStatus(2);

        pessoaRepository.save(pessoa);
    }
}