// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

function converterPrecoParaNumero(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  const texto = String(valor).trim().replace(/[^\d,.-]/g, '')

  if (!texto || texto === '-' || texto === '.' || texto === ',') {
    return 0
  }

  if (texto.includes(',') && texto.includes('.')) {
    return Number(texto.replace(/\./g, '').replace(',', '.'))
  }

  if (texto.includes(',')) {
    return Number(texto.replace(',', '.'))
  }

  return Number(texto)
}

export function temPrecoValido(produto) {
  const valor = converterPrecoParaNumero(produto?.price)
  return Number.isFinite(valor) && valor > 0
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const valor = converterPrecoParaNumero(produto?.price)

    if (!Number.isFinite(valor) || valor <= 0) {
      return total
    }

    return total + valor
  }, 0)
}

export function filtrarProdutosDisponiveis(produtos) {
  return produtos.filter(
    (produto) => Number(produto?.estoque ?? 0) > 0 && temPrecoValido(produto),
  )
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}