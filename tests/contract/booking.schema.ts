// Contract the frontend relies on. If the API drifts from this shape,
// the contract tests fail before any UI test does.
export const serviceSchema = {
  type: 'object',
  required: ['id', 'name', 'priceUsd'],
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    priceUsd: { type: 'number', minimum: 0 },
  },
} as const;

export const bookingSchema = {
  type: 'object',
  required: ['id', 'address', 'serviceId', 'serviceName', 'priceUsd', 'date', 'status'],
  additionalProperties: false,
  properties: {
    id: { type: 'string', minLength: 1 },
    address: { type: 'string', minLength: 5 },
    serviceId: { type: 'string' },
    serviceName: { type: 'string' },
    priceUsd: { type: 'number', minimum: 0 },
    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    status: { enum: ['confirmed', 'cancelled'] },
  },
} as const;

export const errorSchema = {
  type: 'object',
  required: ['errors'],
  additionalProperties: false,
  properties: { errors: { type: 'array', minItems: 1, items: { type: 'string' } } },
} as const;
