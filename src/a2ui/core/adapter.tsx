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
      console.log(`[adapter ReactWrapper] Initializing GenericBinder for componentId="${context.componentId}"`);
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
      console.log(`[adapter ReactWrapper] Re-creating GenericBinder for componentId: "${binderRef.current.componentId}" -> "${context.componentId}"`);
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
      console.log(`[adapter ReactWrapper] useEffect mounting for componentId="${context.componentId}". Registering component updates subscription.`);
      const unsub = context.surface.subscribeComponents(() => {
        console.log(`[adapter ReactWrapper] component subscription triggered: componentId="${context.componentId}" re-resolving.`);
        binder.resolve();
        setTick(t => t + 1);
      });
      
      binder.resolve();
      setTick(t => t + 1);
      
      return () => {
        console.log(`[adapter ReactWrapper] useEffect cleanup for componentId="${context.componentId}". Unsubscribing components list updates.`);
        unsub();
      };
    }, [context.surface, context.componentId, binder]);

    // Clean up binder subscriptions on unmount
    useEffect(() => {
      return () => {
        console.log(`[adapter ReactWrapper] Cleaning up / disposing GenericBinder for componentId="${context.componentId}"`);
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
