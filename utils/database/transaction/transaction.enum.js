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
  'repair_return',
  'inputs',
  'exchange',
  'pending_analysis',
  'analysis_return',
  'booking_return',
  'borrowing_with_pending_analysis_return',
  'tenancy_with_pending_analysis_return',
  'technician_return',
  'technician_with_pending_analysis_return',
  'ecommerce_with_pending_analysis_return',
  'free_market_return'
]

module.exports = ENUM_TRANSACTION
