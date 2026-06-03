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
import projeto.digimax.entity.Cargo;
import projeto.digimax.service.CargoService;

@RestController
@RequestMapping("/cargos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CargoController {

    private final CargoService service;

    @PostMapping("/cadastrar")
    public ResponseEntity<Cargo> cadastrar(@RequestBody Cargo cargo) {
        return ResponseEntity.ok(service.salvar(cargo));
    }

    @GetMapping
    public ResponseEntity<List<Cargo>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cargo> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cargo> atualizar(@PathVariable Integer id, @RequestBody Cargo cargo) {
        return ResponseEntity.ok(service.atualizar(id, cargo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable Integer id) {
        service.excluir(id);
        return ResponseEntity.ok("Cargo excluído com sucesso!");
    }
}
