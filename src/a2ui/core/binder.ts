import { Surface, MessageProcessor } from './messageProcessor';

export interface ActionBinding {
  name: string;
  context?: Record<string, any>;
}

export interface PathBinding {
  path: string;
}

export class GenericBinder {
  public surface: Surface;
  private processor: MessageProcessor;
  public componentId: string;
  private onChange: () => void;
  private unsubscribers: Set<() => void> = new Set();
  
  public props: Record<string, any> = {};

  constructor(
    surface: Surface,
    processor: MessageProcessor,
    componentId: string,
    onChange: () => void
  ) {
    this.surface = surface;
    this.processor = processor;
    this.componentId = componentId;
    this.onChange = onChange;
    
    this.resolve();
  }

  /**
   * Evaluates and resolves raw properties into final React props.
   */
  public resolve() {
    // Clean up previous listeners
    this.dispose();

    const component = this.surface.getComponent(this.componentId);
    if (!component) {
      this.props = {};
      return;
    }

    console.log(`[GenericBinder] Resolving props for componentId="${this.componentId}" (type="${component.component}")`);

    const resolved: Record<string, any> = {};

    // Get all keys from the component definition excluding system ones
    const systemKeys = new Set(['id', 'component']);
    
    // Iterate through all key-values
    for (const key of Object.keys(component)) {
      if (systemKeys.has(key)) continue;

      const rawVal = component[key];
      resolved[key] = this.resolveValue(key, rawVal, resolved);
    }

    // Run validation checks if defined in component properties
    this.evaluateValidation(component, resolved);

    this.props = resolved;
    console.log(`[GenericBinder] Props resolved for "${this.componentId}":`, JSON.stringify(resolved));
  }

  /**
   * Resolves a single property value, binding paths to reactivity.
   */
  private resolveValue(key: string, val: any, resolvedObj: Record<string, any>): any {
    // 1. Is it a path binding? e.g. { path: "/user/name" }
    if (val && typeof val === 'object' && 'path' in val && Object.keys(val).length === 1) {
      const bindingPath = val.path;

      // Subscribe to changes on this path
      const unsub = this.surface.dataModel.subscribe(bindingPath, () => {
        console.log(`[GenericBinder] Path update detected: componentId="${this.componentId}" path="${bindingPath}"`);
        this.resolve();
        this.onChange();
      });
      this.unsubscribers.add(unsub);

      // Add two-way binding setter: set[Key] (e.g. setValue)
      const setterName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
      resolvedObj[setterName] = (newVal: any) => {
        console.log(`[GenericBinder] Two-way setter called: componentId="${this.componentId}" key="${key}" path="${bindingPath}" newVal=`, JSON.stringify(newVal));
        this.surface.dataModel.set(bindingPath, newVal);
      };

      const resolvedVal = this.surface.dataModel.get(bindingPath);
      console.log(`[GenericBinder] Resolved path binding: componentId="${this.componentId}" key="${key}" path="${bindingPath}" ->`, JSON.stringify(resolvedVal));
      return resolvedVal;
    }

    // 2. Is it an action binding? e.g. { name: "submit", context: { userId: "/id" } }
    if (val && typeof val === 'object' && 'name' in val) {
      const actionBinding = val as ActionBinding;
      return (runtimeContext?: Record<string, any>) => {
        // Resolve the action context bindings dynamically at trigger time
        const resolvedContext: Record<string, any> = {};
        if (actionBinding.context) {
          for (const cKey of Object.keys(actionBinding.context)) {
            const cVal = actionBinding.context[cKey];
            if (cVal && typeof cVal === 'object' && 'path' in cVal) {
              resolvedContext[cKey] = this.surface.dataModel.get(cVal.path);
            } else {
              resolvedContext[cKey] = cVal;
            }
          }
        }
        
        // Merge runtime context arguments with the resolved context
        const finalContext = { ...resolvedContext, ...runtimeContext };
        
        console.log(`[GenericBinder] Action triggered: componentId="${this.componentId}" name="${actionBinding.name}" context=`, JSON.stringify(finalContext));
        // Dispatch the action payload
        this.processor.dispatchAction(actionBinding.name, finalContext);
      };
    }

    // 3. Otherwise, return primitive/literal value
    return val;
  }

  /**
   * Helper to perform validations based on a "checks" array in properties.
   */
  private evaluateValidation(component: any, resolvedProps: Record<string, any>) {
    const checks = component.checks;
    if (!Array.isArray(checks) || checks.length === 0) {
      resolvedProps.isValid = true;
      resolvedProps.validationErrors = [];
      return;
    }

    const errors: string[] = [];
    const val = resolvedProps.value !== undefined ? resolvedProps.value : resolvedProps.checked;

    for (const check of checks) {
      if (!check || typeof check !== 'object') continue;

      const name = check.name;
      const args = check.args || {};
      const msg = args.message || `${name} check failed`;

      if (name === 'required') {
        if (val === undefined || val === null || val === '' || val === false) {
          errors.push(msg);
        }
      } else if (name === 'pattern') {
        if (typeof val === 'string' && args.regex) {
          const regex = new RegExp(args.regex);
          if (!regex.test(val)) {
            errors.push(msg);
          }
        }
      } else if (name === 'email') {
        if (typeof val === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            errors.push(msg);
          }
        }
      } else if (name === 'min') {
        if (typeof val === 'number' && typeof args.val === 'number' && val < args.val) {
          errors.push(msg);
        }
      } else if (name === 'max') {
        if (typeof val === 'number' && typeof args.val === 'number' && val > args.val) {
          errors.push(msg);
        }
      }
    }

    resolvedProps.isValid = errors.length === 0;
    resolvedProps.validationErrors = errors;
  }

  /**
   * Clean up subscribers to prevent memory leaks.
   */
  public dispose() {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers.clear();
  }
}
