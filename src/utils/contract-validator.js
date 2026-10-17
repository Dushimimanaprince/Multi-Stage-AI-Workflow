/**
 * Lightweight, zero-dependency JSON Schema contract validator
 * Ensures Chat UX output complies with the MultiStageServiceContract specification
 */
export function validateServiceContract(contract) {
  const errors = [];

  if (!contract || typeof contract !== 'object') {
    return { valid: false, errors: ['Contract must be an object'] };
  }

  const requiredRoot = [
    'serviceName',
    'version',
    'description',
    'entities',
    'endpoints',
    'qualityGateCriteria'
  ];

  for (const field of requiredRoot) {
    if (!contract[field]) {
      errors.push(`Missing required root field: ${field}`);
    }
  }

  // Validate entities
  if (contract.entities && typeof contract.entities === 'object') {
    for (const [entityName, entity] of Object.entries(contract.entities)) {
      if (!entity.primaryKey) {
        errors.push(`Entity '${entityName}' missing primaryKey`);
      }
      if (!entity.fields || typeof entity.fields !== 'object') {
        errors.push(`Entity '${entityName}' missing fields object`);
      } else {
        for (const [fieldName, fieldDef] of Object.entries(entity.fields)) {
          if (!fieldDef.type) {
            errors.push(`Field '${entityName}.${fieldName}' missing type definition`);
          }
          if (typeof fieldDef.required !== 'boolean') {
            errors.push(`Field '${entityName}.${fieldName}' missing required boolean flag`);
          }
        }
      }
    }
  }

  // Validate endpoints
  if (Array.isArray(contract.endpoints)) {
    contract.endpoints.forEach((ep, index) => {
      if (!ep.method || !['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(ep.method)) {
        errors.push(`Endpoint #${index} has invalid or missing HTTP method: ${ep.method}`);
      }
      if (!ep.path || typeof ep.path !== 'string') {
        errors.push(`Endpoint #${index} missing path string`);
      }
      if (typeof ep.expectedStatus !== 'number') {
        errors.push(`Endpoint #${index} (${ep.method} ${ep.path}) missing expectedStatus number`);
      }
    });
  } else {
    errors.push('Endpoints must be an array');
  }

  // Validate quality gate criteria
  if (contract.qualityGateCriteria) {
    const qg = contract.qualityGateCriteria;
    if (typeof qg.minimumTestCoverage !== 'number') {
      errors.push('qualityGateCriteria.minimumTestCoverage must be a number');
    }
    if (typeof qg.maxResponseTimeMs !== 'number') {
      errors.push('qualityGateCriteria.maxResponseTimeMs must be a number');
    }
    if (!Array.isArray(qg.requiredSecurityHeaders)) {
      errors.push('qualityGateCriteria.requiredSecurityHeaders must be an array');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
