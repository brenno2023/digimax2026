package projeto.digimax.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Servico;
import projeto.digimax.service.ServicoService;

@RestController
@RequestMapping("/servicos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServicoController {

    private final ServicoService service;

    @GetMapping
    public ResponseEntity<List<Servico>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}
