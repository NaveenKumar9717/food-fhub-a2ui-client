import { DataModel } from './dataModel';

export interface A2UIComponent {
  id: string;
  component: string; // Component type name (e.g. Text, Button)
  children?: string[];
  [key: string]: any; // Additional properties
}

export class Surface {
  public id: string;
  public catalogId: string;
  public dataModel: DataModel;
  public components: Map<string, A2UIComponent> = new Map();
  
  // Custom subscription callbacks
  private componentListeners: Set<() => void> = new Set();

  constructor(id: string, catalogId: string) {
    this.id = id;
    this.catalogId = catalogId;
    this.dataModel = new DataModel();
  }

  public updateComponents(componentsList: A2UIComponent[]) {
    for (const comp of componentsList) {
      this.components.set(comp.id, comp);
    }
    this.notifyComponentListeners();
  }

  public getComponent(id: string): A2UIComponent | undefined {
    return this.components.get(id);
  }

  public subscribeComponents(callback: () => void): () => void {
    this.componentListeners.add(callback);
    return () => {
      this.componentListeners.delete(callback);
    };
  }

  private notifyComponentListeners() {
    for (const cb of this.componentListeners) {
      cb();
    }
  }
}

export type ActionCallback = (actionPayload: { name: string; context: any }) => void;

export class MessageProcessor {
  public surfaces: Map<string, Surface> = new Map();
  private surfaceListeners: Set<() => void> = new Set();
  private actionCallback?: ActionCallback;

  constructor(onAction?: ActionCallback) {
    this.actionCallback = onAction;
  }

  /**
   * Dispatches user action back to the controller.
   */
  public dispatchAction(name: string, context: any) {
    if (this.actionCallback) {
      this.actionCallback({ name, context });
    }
  }

  public getSurfaces(): Surface[] {
    return Array.from(this.surfaces.values());
  }

  public subscribeSurfaces(callback: () => void): () => void {
    this.surfaceListeners.add(callback);
    return () => {
      this.surfaceListeners.delete(callback);
    };
  }

  private notifySurfaces() {
    for (const cb of this.surfaceListeners) {
      cb();
    }
  }

  /**
   * Process a sequence of A2UI messages (an array of JSON objects).
   */
  public processMessages(messages: any[]) {
    if (!Array.isArray(messages)) {
      console.warn('Expected array of messages, got:', messages);
      return;
    }

    for (const msg of messages) {
      this.processMessage(msg);
    }
  }

  /**
   * Process a single A2UI message.
   */
  public processMessage(msg: any) {
    if (!msg || typeof msg !== 'object') return;

    if (msg.createSurface) {
      const { surfaceId, catalogId } = msg.createSurface;
      if (!this.surfaces.has(surfaceId)) {
        const newSurface = new Surface(surfaceId, catalogId);
        this.surfaces.set(surfaceId, newSurface);
        this.notifySurfaces();
      }
    }

    if (msg.updateComponents) {
      const { surfaceId, components } = msg.updateComponents;
      const surface = this.surfaces.get(surfaceId);
      if (surface && Array.isArray(components)) {
        surface.updateComponents(components);
      }
    }

    if (msg.updateDataModel) {
      const { surfaceId, path, value } = msg.updateDataModel;
      const surface = this.surfaces.get(surfaceId);
      if (surface && path !== undefined && value !== undefined) {
        surface.dataModel.set(path, value);
      }
    }
  }

  /**
   * Deletes a surface.
   */
  public deleteSurface(surfaceId: string) {
    if (this.surfaces.has(surfaceId)) {
      this.surfaces.delete(surfaceId);
      this.notifySurfaces();
    }
  }

  /**
   * Resets all surfaces.
   */
  public reset() {
    this.surfaces.clear();
    this.notifySurfaces();
  }
}
