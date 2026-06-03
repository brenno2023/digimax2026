package projeto.digimax.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import projeto.digimax.entity.Cargo;
import projeto.digimax.repository.CargoRepository;

@Service
@RequiredArgsConstructor
public class CargoService {

    private final CargoRepository repository;

    public Cargo salvar(Cargo cargo) {
        return repository.save(cargo);
    }

    public List<Cargo> listar() {
        return repository.findAll();
    }

    public Cargo buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));
    }

    public Cargo atualizar(Integer id, Cargo cargoAtualizado) {

        Cargo cargoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));

        cargoExistente.setNome(cargoAtualizado.getNome());
        cargoExistente.setDescricao(cargoAtualizado.getDescricao());

        return repository.save(cargoExistente);
    }

    public void excluir(Integer id) {

        Cargo cargoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));

        repository.delete(cargoExistente);
    }
}
