import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { filtrarProdutosDisponiveis } from '../utils/carrinho'

export default function PaginaProduto({
  produtos,
  clienteAtual,
  listaEspera = [],
  onAdicionar,
  onRegistrarEspera,
}) {
  const { id } = useParams()
  const [mensagemEspera, setMensagemEspera] = useState('')
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = filtrarProdutosDisponiveis(produtos)
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  const jaNaFila =
    clienteAtual &&
    listaEspera.some(
      (item) => item.produtoId === produto.id && item.clienteId === clienteAtual.id,
    )

  function registrarEspera() {
    if (!clienteAtual) {
      setMensagemEspera('Selecione um cliente no rodapé para receber a notificação.')
      return
    }

    if (jaNaFila) {
      setMensagemEspera('Você já está na lista de espera desse produto.')
      return
    }

    onRegistrarEspera(produto.id)
    setMensagemEspera('Você foi adicionado à lista de espera.')
  }

  const esgotado = produto.estoque === 0

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>

          {esgotado ? (
            <>
              <p className="selo selo-esgotado">Esgotado</p>
              <p className="detalhe-estoque">Produto indisponível no momento.</p>
              <button className="botao botao-secundario botao-grande" onClick={registrarEspera}>
                {jaNaFila ? 'Já estou na lista' : 'Avise-me quando chegar'}
              </button>
              {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
            </>
          ) : (
            <>
              <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>
              <button className="botao botao-grande" onClick={() => onAdicionar(produto)}>
                Adicionar ao carrinho
              </button>
            </>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}