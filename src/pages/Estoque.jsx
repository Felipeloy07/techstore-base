// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const clientesPorProduto = listaEspera.reduce((acumulador, item) => {
    const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId)
    if (!produto) return acumulador

    const produtoId = item.produtoId
    if (!acumulador[produtoId]) {
      acumulador[produtoId] = {
        produto,
        clientes: [],
      }
    }

    acumulador[produtoId].clientes.push({
      nome: item.nome,
      email: item.email,
    })

    return acumulador
  }, {})

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Clientes esperando produto voltar</h2>

        {Object.keys(clientesPorProduto).length === 0 ? (
          <p className="aviso">Nenhum cliente na lista de espera no momento.</p>
        ) : (
          <div className="tabela-moldura">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Cliente</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(clientesPorProduto).flatMap(({ produto, clientes }) =>
                  clientes.map((cliente, index) => (
                    <tr key={`${produto.id}-${cliente.email}-${index}`}>
                      <td>{produto.title}</td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.email}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
