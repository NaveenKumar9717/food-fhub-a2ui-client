import React, { useState, useEffect } from 'react';
import { Surface, MessageProcessor } from './messageProcessor';
import { ComponentContext, ReactComponentImplementation } from './adapter';

export interface Catalog {
  components: Map<string, ReactComponentImplementation>;
}

export const SkeletonLoader: React.FC<{ id: string }> = ({ id }) => {
  const normalizedId = id.toLowerCase();

  if (normalizedId.includes('profile')) {
    return (
      <div className="skeleton-container skeleton-profile">
        <div className="skeleton-circle" />
        <div className="skeleton-lines">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
    );
  }

  if (normalizedId.includes('news')) {
    return (
      <div className="skeleton-container skeleton-news" style={{ flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton-line skeleton-title" style={{ width: '40%', height: '16px' }} />
        <div className="skeleton-news-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-news-item" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingTop: i > 1 ? '16px' : '0px',
              borderTop: i > 1 ? '1px solid #242c3d' : 'none'
            }}>
              <div className="skeleton-news-source" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="skeleton-circle-tiny" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
                <div className="skeleton-line-tiny" style={{ width: '60px', height: '8px' }} />
              </div>
              <div className="skeleton-news-content" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                <div className="skeleton-lines" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div className="skeleton-line" style={{ width: '90%', height: '10px' }} />
                  <div className="skeleton-line" style={{ width: '70%', height: '10px' }} />
                </div>
                <div className="skeleton-square-small" style={{ width: '72px', height: '54px', borderRadius: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (normalizedId.includes('carousel')) {
    return (
      <div className="skeleton-container skeleton-carousel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'transparent', border: 'none', padding: 0 }}>
        <div className="skeleton-carousel-viewport" style={{ display: 'flex', gap: '12px', overflow: 'hidden', width: '100%' }}>
          <div className="skeleton-card" style={{ flex: '0 0 85%', height: '220px', borderRadius: '16px' }} />
          <div className="skeleton-card" style={{ flex: '0 0 85%', height: '220px', borderRadius: '16px' }} />
        </div>
        <div className="skeleton-carousel-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div className="skeleton-buttons" style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton-circle-small" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <div className="skeleton-circle-small" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          </div>
          <div className="skeleton-dots" style={{ display: 'flex', gap: '6px' }}>
            <div className="skeleton-circle-tiny" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
            <div className="skeleton-circle-tiny" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
            <div className="skeleton-circle-tiny" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (normalizedId.includes('grid') || normalizedId.includes('shelf')) {
    return (
      <div className="skeleton-container skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (normalizedId.includes('recipe') && normalizedId.includes('row')) {
    return (
      <div className="skeleton-container skeleton-row">
        <div className="skeleton-square" />
        <div className="skeleton-lines">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line" />
        </div>
      </div>
    );
  }

  if (normalizedId.includes('recipe') || normalizedId.includes('card')) {
    return (
      <div className="skeleton-container skeleton-large-card">
        <div className="skeleton-card-header">
          <div className="skeleton-circle-small" />
          <div className="skeleton-line-small" />
        </div>
        <div className="skeleton-image-block" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    );
  }

  if (normalizedId.includes('item')) {
    return (
      <div className="skeleton-container skeleton-item-card">
        <div className="skeleton-image-small" />
        <div className="skeleton-line-small" />
        <div className="skeleton-line-small" />
      </div>
    );
  }

  if (normalizedId.includes('btn') || normalizedId.includes('button')) {
    return (
      <div className="skeleton-container skeleton-button" />
    );
  }

  if (
    normalizedId.includes('header') ||
    normalizedId.includes('title') ||
    normalizedId.includes('text') ||
    normalizedId.includes('desc') ||
    normalizedId.includes('subtitle')
  ) {
    return (
      <div className="skeleton-container skeleton-text-only">
        <div className="skeleton-line" />
      </div>
    );
  }

  return (
    <div className="skeleton-container skeleton-generic" />
  );
};

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
    return <SkeletonLoader id={id} />;
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
