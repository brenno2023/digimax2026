package projeto.digimax.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import projeto.digimax.dto.LoginAdministradorRequest;
import projeto.digimax.entity.Administrador;
import projeto.digimax.service.AdministradorService;

@RestController
@RequestMapping("/administradores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdministradorController {

    private final AdministradorService service;

    @PostMapping("/cadastrar")
    public ResponseEntity<Administrador> cadastrar(@RequestBody Administrador admin) {
        return ResponseEntity.ok(service.salvar(admin));
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody LoginAdministradorRequest request) {
        return ResponseEntity.ok(service.login(request));
    }

    @GetMapping
    public ResponseEntity<List<Administrador>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}