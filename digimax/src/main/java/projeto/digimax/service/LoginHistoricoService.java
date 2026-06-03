package projeto.digimax.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.LoginHistorico;
import projeto.digimax.repository.LoginHistoricoRepository;

@Service
@RequiredArgsConstructor
public class LoginHistoricoService {

    private final LoginHistoricoRepository repo;

    public LoginHistorico salvar(LoginHistorico log) {
        return repo.save(log);
    }

    public List<LoginHistorico> listar() {
        return repo.findAll();
    }
}
