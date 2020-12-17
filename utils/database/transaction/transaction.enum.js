const ENUM_TRANSACTION = [
  // status de saida
  'sale',
  'ecommerce',
  'free_market',
  'technician',
  'outputs',
  'booking',
  'tenancy',
  'borrowing',
  'in_analysis',
  'repair',
  // status de entrada
  'buy',
  'inputs',
  'exchange',
  'pending_analysis',
  'analysis_return',
  'repair_return',
  'booking_return',
  'borrowing_with_pending_analysis_return',
  'tenancy_with_pending_analysis_return',
  'technician_return',
  'technician_with_pending_analysis_return',
  'ecommerce_with_pending_analysis_return',
  'free_market_return'
]

const parseStatusToType = {
  sale: 'outputs',
  ecommerce: 'outputs',
  free_market: 'outputs',
  technician: 'outputs',
  outputs: 'outputs',
  booking: 'outputs',
  tenancy: 'outputs',
  borrowing: 'outputs',
  in_analysis: 'outputs',
  repair: 'outputs',
  buy: 'inputs',
  inputs: 'inputs',
  exchange: 'inputs',
  pending_analysis: 'inputs',
  analysis_return: 'inputs',
  repair_return: 'inputs',
  booking_return: 'inputs',
  borrowing_with_pending_analysis_return: 'inputs',
  tenancy_with_pending_analysis_return: 'inputs',
  technician_return: 'inputs',
  technician_with_pending_analysis_return: 'inputs',
  ecommerce_with_pending_analysis_return: 'inputs',
  free_market_return: 'inputs',
}

const relativeStatus = {
  pending_analysis: 'in_analysis',
  in_analysis: 'analysis_return',
}

const relativeInverseStatus = {
  in_analysis: 'pending_analysis',
  analysis_return: 'in_analysis',
}

module.exports = {
  ENUM_TRANSACTION,
  parseStatusToType,
  relativeStatus,
  relativeInverseStatus,
}
