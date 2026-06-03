package projeto.digimax.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginAdministradorRequest {
    private String usuario;
    private String senha;
}
