package projeto.digimax.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Orcamento;
import projeto.digimax.service.OrcamentoService;

@RestController
@RequestMapping("/orcamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrcamentoController {

    private final OrcamentoService service;

    @PostMapping("/solicitar")
public ResponseEntity<String> solicitar(@RequestBody Orcamento orcamento) {
    service.salvar(orcamento);
    return ResponseEntity.ok("Pedido enviado com sucesso!");
}

    @GetMapping
    public ResponseEntity<List<Orcamento>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Orcamento>> listarPorCliente(@PathVariable Integer clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/novos")
    public ResponseEntity<List<Orcamento>> listarNovosParaFuncionario() {
        return ResponseEntity.ok(service.listarNovosParaFuncionario());
    }

    @GetMapping("/cliente/{clienteId}/novos")
    public ResponseEntity<List<Orcamento>> listarRespostasNovasCliente(@PathVariable Integer clienteId) {
        return ResponseEntity.ok(service.listarRespostasNovasCliente(clienteId));
    }

    @GetMapping("/{id}")
public ResponseEntity<Orcamento> buscarPorId(@PathVariable Integer id) {
    return ResponseEntity.ok(service.buscarPorId(id));
}

    @PutMapping("/{id}/responder")
public ResponseEntity<String> responder(@PathVariable Integer id, @RequestBody Orcamento dadosResposta) {
    service.responder(id, dadosResposta);
    return ResponseEntity.ok("Resposta enviada com sucesso!");
}

    @PutMapping("/{id}/visualizado-funcionario")
    public ResponseEntity<Orcamento> marcarVisualizadoFuncionario(@PathVariable Integer id) {
        return ResponseEntity.ok(service.marcarVisualizadoFuncionario(id));
    }

    @PutMapping("/{id}/visualizado-cliente")
    public ResponseEntity<Orcamento> marcarVisualizadoCliente(@PathVariable Integer id) {
        return ResponseEntity.ok(service.marcarVisualizadoCliente(id));
    }
}