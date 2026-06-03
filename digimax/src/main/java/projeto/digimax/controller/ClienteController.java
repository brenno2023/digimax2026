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
import projeto.digimax.dto.LoginClienteResponse;
import projeto.digimax.dto.LoginRequest;
import projeto.digimax.entity.Cliente;
import projeto.digimax.service.ClienteService;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService service;

    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrar(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(service.cadastrar(cliente));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginClienteResponse clienteLogado = service.login(request);

        if (clienteLogado == null) {
            return ResponseEntity.status(401).body("E-mail ou senha inválidos");
        }

        return ResponseEntity.ok(clienteLogado);
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(service.listarClientes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Integer id, @RequestBody Cliente cliente) {
        return ResponseEntity.ok(service.atualizarCliente(id, cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarCliente(@PathVariable Integer id) {
        service.deletarCliente(id);
        return ResponseEntity.ok("Cliente deletado com sucesso!");
    }
}