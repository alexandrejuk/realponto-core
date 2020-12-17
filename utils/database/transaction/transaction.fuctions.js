const { relativeStatus } = require('./transaction.enum')

const getTotalStatusOfProduct = (current, prev) => {
  if (current[prev.productId] && current[prev.productId][prev.status]) {
    current = {
      ...current,
      [prev.productId]: {
        ...current[prev.productId],
        [prev.status]: current[prev.productId][prev.status] + prev.quantity,
      }
    }
  }

  if (current[prev.productId] && !current[prev.productId][prev.status]) {
    const relativeStatusExits = (
      relativeStatus[prev.status]
        ? { [relativeStatus[prev.status]]: 0 }
        : {}
    )

    current = {
      ...current,
      [prev.productId]: {
        ...current[prev.productId],
        [prev.status]: prev.quantity,
        ...relativeStatusExits,
      }
    }
  }

  if (!current[prev.productId]) {
    const relativeStatusExits = (
      relativeStatus[prev.status]
        ? { [relativeStatus[prev.status]]: 0 }
        : {}
    )

    current = {
      ...current,
      [prev.productId]: {
        [prev.status]: prev.quantity,
        ...relativeStatusExits,
      }
    }
  }

  return current
}

const getTotalTypeEventTransaction = (current, prev) => {
  if (current[prev.productId] && current[prev.productId][prev.type]) {
    current = {
      ...current,
      [prev.productId]: {
        ...current[prev.productId],
        [prev.type]: prev.quantity + current[prev.productId][prev.type],
      }
    }
  }

  if (current[prev.productId] && !current[prev.productId][prev.type]) {
    current = {
      ...current,
      [prev.productId]: {
        ...current[prev.productId],
        [prev.type]: prev.quantity,
      }
    }
  }

  if (!current[prev.productId]) {
    current = {
      ...current,
      [prev.productId]: {
        [prev.type]: prev.quantity,
      }
    }
  }
  return current
}

module.exports = {
  getTotalStatusOfProduct,
  getTotalTypeEventTransaction,
}
