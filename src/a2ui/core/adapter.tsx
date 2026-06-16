import React, { useState, useEffect, useRef } from 'react';
import { Surface, MessageProcessor } from './messageProcessor';
import { GenericBinder } from './binder';

export interface ComponentContext {
  surface: Surface;
  processor: MessageProcessor;
  componentId: string;
  basePath: string;
}

export interface ReactComponentImplementation {
  name: string;
  schema?: any;
  render: React.FC<{
    context: ComponentContext;
    buildChild: (id: string, basePath?: string) => React.ReactNode;
  }>;
}

export interface ReactA2uiComponentProps<PropsType> {
  props: PropsType;
  buildChild: (id: string, basePath?: string) => React.ReactNode;
  context: ComponentContext;
}

/**
 * Creates a React component implementation using the dynamic property binder.
 */
export function createComponentImplementation<PropsType = any>(
  name: string,
  schema: any,
  RenderComponent: React.FC<ReactA2uiComponentProps<PropsType>>
): ReactComponentImplementation {
  
  const ReactWrapper: React.FC<{
    context: ComponentContext;
    buildChild: (id: string, basePath?: string) => React.ReactNode;
  }> = ({ context, buildChild }) => {
    // State to trigger re-renders when data model changes
    const [, setTick] = useState(0);
    const binderRef = useRef<GenericBinder | null>(null);

    // Instantiate or re-create binder if context/componentId changes
    if (!binderRef.current) {
      binderRef.current = new GenericBinder(
        context.surface,
        context.processor,
        context.componentId,
        () => setTick(t => t + 1)
      );
    } else if (
      binderRef.current.componentId !== context.componentId ||
      binderRef.current.surface !== context.surface
    ) {
      binderRef.current.dispose();
      binderRef.current = new GenericBinder(
        context.surface,
        context.processor,
        context.componentId,
        () => setTick(t => t + 1)
      );
    }

    const binder = binderRef.current;

    // Trigger re-resolve if binder dependency elements or surface components change
    useEffect(() => {
      const unsub = context.surface.subscribeComponents(() => {
        binder.resolve();
        setTick(t => t + 1);
      });
      
      binder.resolve();
      setTick(t => t + 1);
      
      return unsub;
    }, [context.surface, context.componentId, binder]);

    // Clean up binder subscriptions on unmount
    useEffect(() => {
      return () => {
        binder.dispose();
      };
    }, [binder]);

    return (
      <RenderComponent
        props={binder.props as PropsType}
        buildChild={buildChild}
        context={context}
      />
    );
  };

  return {
    name,
    schema,
    render: ReactWrapper,
  };
}

/**
 * Creates a React component implementation that manages its own context bindings (no generic binder).
 */
export function createBinderlessComponentImplementation(
  name: string,
  schema: any,
  RenderComponent: React.FC<{
    context: ComponentContext;
    buildChild: (id: string, basePath?: string) => React.ReactNode;
  }>
): ReactComponentImplementation {
  return {
    name,
    schema,
    render: RenderComponent,
  };
}
