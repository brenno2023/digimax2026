package projeto.digimax.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.dto.LoginAdministradorRequest;
import projeto.digimax.entity.Administrador;
import projeto.digimax.entity.Pessoa;
import projeto.digimax.repository.AdministradorRepository;
import projeto.digimax.repository.PessoaRepository;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final AdministradorRepository repo;
    private final PessoaRepository pessoaRepository;

    public Administrador salvar(Administrador admin) {
        admin.setUsuario(admin.getUsuario().trim().toLowerCase());

        Pessoa pessoa = admin.getPessoa();
        pessoa.setSenha(pessoa.getSenha().trim());
        pessoa.setTipo("administrador");
        pessoa.setDataCadastro(LocalDateTime.now());

        admin.setPessoa(pessoa);

        return repo.save(admin);
    }

    public List<Administrador> listar() {
        return repo.findAll();
    }

    public boolean login(LoginAdministradorRequest request) {
        String usuario = request.getUsuario().trim().toLowerCase();
        String senha = request.getSenha().trim();

        Optional<Administrador> adminOpt = repo.findByUsuario(usuario);

        if (adminOpt.isEmpty()) {
            return false;
        }

        Administrador admin = adminOpt.get();

        return admin.getPessoa().getSenha().equals(senha);
    }
}
