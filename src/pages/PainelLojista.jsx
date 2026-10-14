import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = ['roupas', 'eletronicos', 'acessorios', 'casa']
const MARGEM_BRUTA_ESTIMADA = 0.35

export default function PainelLojista({ produtos = [], listaEspera = [] }) {
  const produtosEmEstoque = produtos.filter(
    (produto) => Number(produto?.estoque ?? 0) > 0 && Number(produto?.price ?? 0) > 0,
  )

  const produtosSemPreco = produtos.filter(
    (produto) => Number(produto?.estoque ?? 0) > 0 && Number(produto?.price ?? 0) <= 0,
  )

  const clientesEsperando = new Set(listaEspera.map((item) => item.clienteId)).size

  const valorTotalEstoque = produtosEmEstoque.reduce(
    (total, produto) => total + Number(produto.price) * Number(produto.estoque ?? 0),
    0,
  )

  const lucroTotalEstimado = valorTotalEstoque * MARGEM_BRUTA_ESTIMADA

  const linhasPorCategoria = CATEGORIAS.map((categoria) => {
    const itens = produtos.filter((produto) => produto.category === categoria)
    const emEstoque = itens.filter(
      (produto) => Number(produto?.estoque ?? 0) > 0 && Number(produto?.price ?? 0) > 0,
    )

    const valorEstoque = emEstoque.reduce(
      (total, produto) => total + Number(produto.price) * Number(produto.estoque ?? 0),
      0,
    )

    const clientesEsperandoCategoria = listaEspera.filter((item) => {
      const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId)
      return produto && produto.category === categoria && Number(produto.estoque ?? 0) === 0
    }).length

    const esperandoPreco = itens.filter(
      (produto) => Number(produto?.estoque ?? 0) > 0 && Number(produto?.price ?? 0) <= 0,
    ).length

    return {
      categoria,
      valorEstoque,
      quantidade: emEstoque.length,
      clientesEsperandoCategoria,
      esperandoPreco,
      lucroEstimado: valorEstoque * MARGEM_BRUTA_ESTIMADA,
    }
  })

  return (
    <section className="painel-lojista">
      <p className="sobretitulo">Painel do lojista</p>
      <h1>Visão geral da loja</h1>

      <div className="painel-cards">
        <article className="painel-card">
          <span>Valor em estoque</span>
          <strong>{formatarPreco(valorTotalEstoque)}</strong>
        </article>

        <article className="painel-card">
          <span>Produtos esperando preço</span>
          <strong>{produtosSemPreco.length}</strong>
        </article>

        <article className="painel-card">
          <span>Clientes esperando retorno</span>
          <strong>{clientesEsperando}</strong>
        </article>

        <article className="painel-card">
          <span>Lucro estimado</span>
          <strong>{formatarPreco(lucroTotalEstimado)}</strong>
        </article>
      </div>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Valor em estoque</th>
              <th>Itens disponíveis</th>
              <th>Esperando preço</th>
              <th>Clientes esperando</th>
              <th>Lucro estimado</th>
            </tr>
          </thead>
          <tbody>
            {linhasPorCategoria.map((linha) => (
              <tr key={linha.categoria}>
                <td>{linha.categoria}</td>
                <td>{formatarPreco(linha.valorEstoque)}</td>
                <td>{linha.quantidade}</td>
                <td>{linha.esperandoPreco}</td>
                <td>{linha.clientesEsperandoCategoria}</td>
                <td>{formatarPreco(linha.lucroEstimado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="painel-blocos">
        <div className="tabela-moldura">
          <h2>Produtos parados esperando preço</h2>
          {produtosSemPreco.length === 0 ? (
            <p className="aviso">Nenhum produto está aguardando preço.</p>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                </tr>
              </thead>
              <tbody>
                {produtosSemPreco.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.title}</td>
                    <td>{produto.category}</td>
                    <td>{produto.estoque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="tabela-moldura">
          <h2>Clientes na fila de espera</h2>
          {listaEspera.length === 0 ? (
            <p className="aviso">Nenhum cliente esperando retorno no momento.</p>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Cliente</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                {listaEspera.map((item, index) => (
                  <tr key={`${item.produtoId}-${item.clienteId}-${index}`}>
                    <td>{produtos.find((produto) => produto.id === item.produtoId)?.title ?? 'Produto removido'}</td>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  )
}
