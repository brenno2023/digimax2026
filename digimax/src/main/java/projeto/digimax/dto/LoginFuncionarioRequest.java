package projeto.digimax.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginFuncionarioRequest {
    private String usuario;
    private String senha;
}
