package projeto.digimax.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginClienteResponse {
    private Integer id;
    private String nome;
    private String email;
}
