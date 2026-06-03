package projeto.digimax.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orcamento")
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "servico_id")
    private Servico servico;

    @Column(nullable = false)
    private String descricao;

    @Column(name = "servico_nome", length = 100)
    private String servicoNome;

    @Column(length = 50)
    private String quantidade;

    @Column(length = 100)
    private String medida;

    @Column(length = 100)
    private String prazo;

    @Column(length = 100)
    private String material;

    @Column(name = "frente_verso", length = 50)
    private String frenteVerso;

    @Column(length = 50)
    private String furo;

    @Column(name = "observacoes_cliente")
    private String observacoesCliente;

    @Column(name = "resposta_funcionario")
    private String respostaFuncionario;

    @Column(name = "valor_estimado")
    private BigDecimal valorEstimado;

    @Column(name = "data_solicitacao")
    private LocalDateTime dataSolicitacao;

    @Column(length = 20)
    private String status;

    @Column(name = "visualizado_cliente")
    private Boolean visualizadoCliente;

    @Column(name = "visualizado_funcionario")
    private Boolean visualizadoFuncionario;
}