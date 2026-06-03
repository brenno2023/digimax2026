package projeto.digimax.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import projeto.digimax.dto.LoginFuncionarioRequest;
import projeto.digimax.dto.LoginFuncionarioResponse;
import projeto.digimax.entity.Funcionario;
import projeto.digimax.service.FuncionarioService;

@RestController
@RequestMapping("/funcionarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FuncionarioController {

    private final FuncionarioService service;

    @PostMapping("/cadastrar")
    public ResponseEntity<Funcionario> cadastrar(@RequestBody Funcionario funcionario) {
        return ResponseEntity.ok(service.salvar(funcionario));
    }

    @PostMapping("/login")
public ResponseEntity<LoginFuncionarioResponse> login(@RequestBody LoginFuncionarioRequest request) {
    Funcionario funcionario = service.login(request);

    if (funcionario == null) {
        return ResponseEntity.badRequest().build();
    }

    LoginFuncionarioResponse response = new LoginFuncionarioResponse(
        funcionario.getId(),
        funcionario.getUsuario()
    );

    return ResponseEntity.ok(response);
}

    @GetMapping
    public ResponseEntity<List<Funcionario>> listarFuncionarios() {
        return ResponseEntity.ok(service.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizarFuncionario(@PathVariable Integer id, @RequestBody Funcionario funcionario) {
        return ResponseEntity.ok(service.atualizar(id, funcionario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirFuncionario(@PathVariable Integer id) {
        service.excluir(id);
        return ResponseEntity.ok("Funcionário excluído com sucesso!");
    }
}