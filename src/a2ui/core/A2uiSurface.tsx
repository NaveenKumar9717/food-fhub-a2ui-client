import React, { useState, useEffect } from 'react';
import { Surface, MessageProcessor } from './messageProcessor';
import { ComponentContext, ReactComponentImplementation } from './adapter';

export interface Catalog {
  components: Map<string, ReactComponentImplementation>;
}

export const DeferredChild: React.FC<{
  surface: Surface;
  processor: MessageProcessor;
  catalog: Catalog;
  id: string;
  basePath: string;
}> = React.memo(({ surface, processor, catalog, id, basePath }) => {
  // Subscribe to changes in components map (e.g. creation / deletion / updates)
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = surface.subscribeComponents(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, [surface]);

  const componentModel = surface.getComponent(id);

  if (!componentModel) {
    return <div style={{ color: 'gray', padding: '4px', fontStyle: 'italic' }}>[Loading {id}...]</div>;
  }

  const compImpl = catalog.components.get(componentModel.component);

  if (!compImpl) {
    return <div style={{ color: 'red', padding: '4px' }}>Unknown component: {componentModel.component}</div>;
  }

  // Create context for this component
  const context: ComponentContext = {
    surface,
    processor,
    componentId: id,
    basePath,
  };

  const buildChild = (childId: string, specificPath?: string) => {
    const path = specificPath || basePath;
    return (
      <DeferredChild
        key={`${childId}-${path}`}
        surface={surface}
        processor={processor}
        catalog={catalog}
        id={childId}
        basePath={path}
      />
    );
  };

  const ComponentToRender = compImpl.render;
  return <ComponentToRender context={context} buildChild={buildChild} />;
});

DeferredChild.displayName = 'DeferredChild';

export const A2uiSurface: React.FC<{
  surface: Surface;
  processor: MessageProcessor;
  catalog: Catalog;
}> = ({ surface, processor, catalog }) => {
  // The root component is always named 'root' and starts at base data path '/'
  return (
    <div className="a2ui-surface-wrapper">
      <DeferredChild
        surface={surface}
        processor={processor}
        catalog={catalog}
        id="root"
        basePath="/"
      />
    </div>
  );
};
