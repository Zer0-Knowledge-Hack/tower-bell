import schema from '../data/validaciones.json'

function runRules(rules, data) {
  const errors = {}
  for (const [field, rule] of Object.entries(rules)) {
    const value = String(data[field] ?? '').trim()
    const label = rule.label || field
    if (rule.required && !value) {
      errors[field] = `${label} is required`
      continue
    }
    if (!value) continue
    if (rule.min && value.length < rule.min)
      errors[field] = `${label} must be at least ${rule.min} characters`
    if (rule.max && value.length > rule.max)
      errors[field] = `${label} cannot exceed ${rule.max} characters`
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
      errors[field] = rule.mensaje || `${label} has an invalid format`
    }
  }
  return { ok: Object.keys(errors).length === 0, errors }
}

export function validateBeacon(data) {
  return runRules(schema.beacon, data)
}

export function validateAdmin(data) {
  return runRules(schema.admin, data)
}
