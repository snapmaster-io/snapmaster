// utilities to serialize snaps into YAML, and parse YAML into a snap
import YAML from 'yaml'

export function serializeSnap(snap) {
  return YAML.stringify(snap);
}

export function parseDefinition(definition) {
  try {
    const snapDefinition = YAML.parse(definition);
    const snap = { 
      name: snapDefinition.name,
      description: snapDefinition.description, 
      trigger: snapDefinition.trigger,
      actions: snapDefinition.actions,
      parameters: snapDefinition.parameters,
      config: snapDefinition.config,
    };

    // validate required fields
    if (!snap.name || !snap.trigger || !snap.actions || !snap.config) {
      console.error('parse: definition did not contain required fields');
      return null;
    }

    return snap;
  } catch (error) {
    return null;
  }  
}