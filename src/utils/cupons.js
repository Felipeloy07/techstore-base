const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = codigo.trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false }
  }

  if (codigoNormalizado === 'PRIMEIRACOMPRA') {
    const jaComprou = !cliente || Number(cliente.pedidosAnteriores ?? 0) > 0

    if (jaComprou) {
      return { valido: false }
    }
  }

  return { valido: true, desconto: 0.1 }
}