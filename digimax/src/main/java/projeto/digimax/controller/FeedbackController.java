package projeto.digimax.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Feedback;
import projeto.digimax.service.FeedbackService;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService service;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviar(@RequestBody Feedback feedback) {
        service.salvar(feedback);
        return ResponseEntity.ok("Feedback enviado com sucesso!");
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Feedback>> listarPorCliente(@PathVariable Integer clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }
}
