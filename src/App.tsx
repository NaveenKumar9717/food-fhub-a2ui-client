import { useState, useEffect, useMemo } from 'react';
import { MessageProcessor, Surface } from './a2ui/core/messageProcessor';
import { A2uiSurface } from './a2ui/core/A2uiSurface';
import { basicCatalog } from './a2ui/catalog/basicComponents';
import { mockTemplates, defaultMockJson } from './mockData';
import './App.css';

export function App() {
  const [jsonText, setJsonText] = useState(defaultMockJson);
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{ time: string; message: string }>>([]);
  const [surfaces, setSurfaces] = useState<Surface[]>([]);
  const [activeSurfaceData, setActiveSurfaceData] = useState<any>({});

  // Chat/Agent State variables
  const [queryInput, setQueryInput] = useState('');
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // 1. Create the MessageProcessor with interactive simulator hooks
  const processor = useMemo(() => {
    return new MessageProcessor((action) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `[Action Dispatch] Name: "${action.name}", Payload: ${JSON.stringify(action.context)}`;
      
      setLogs((prev) => [{ time: timestamp, message: logMessage }, ...prev]);

      // Interactive Agent flow simulation:
      if (action.name === 'select_restaurant') {
        // Transition to Booking Form template pre-filled with selected restaurant info
        const bookingTemplate = mockTemplates[1];
        const updatedMessages = JSON.parse(JSON.stringify(bookingTemplate.messages));

        // Inject restaurant name into components
        const indicator = updatedMessages[1].updateComponents.components.find(
          (c: any) => c.id === 'restaurant-indicator'
        );
        if (indicator) {
          indicator.text = `Booking a table at **${action.context.name || 'Restaurant'}**`;
        }

        // Initialize state model
        const modelUpdate = updatedMessages[2].updateDataModel;
        if (modelUpdate) {
          modelUpdate.value = {
            ...modelUpdate.value,
            restaurantName: action.context.name || 'Restaurant',
            imageUrl: action.context.image || ''
          };
        }

        setJsonText(JSON.stringify(updatedMessages, null, 2));
      } else if (action.name === 'submit_booking') {
        // Transition to booking confirmation screen
        const confTemplate = mockTemplates[2];
        const updatedMessages = JSON.parse(JSON.stringify(confTemplate.messages));

        const summaryText = updatedMessages[1].updateComponents.components.find(
          (c: any) => c.id === 'summary-details'
        );
        if (summaryText) {
          summaryText.text = `**Restaurant**: ${action.context.restaurantName || 'The Bistro Garden'}  \n**Guest**: ${action.context.guestName || 'Valued Guest'}  \n**Time**: ${action.context.time || '7:00 PM'}  \n**Party Size**: ${action.context.partySize || '2'} Guests  \n**Notes**: ${action.context.dietaryNotes || 'None'}`;
        }

        setJsonText(JSON.stringify(updatedMessages, null, 2));
      } else if (action.name === 'reset_flow') {
        // Reset to home search flow
        setJsonText(JSON.stringify(mockTemplates[0].messages, null, 2));
      } else if (action.name === 'add_to_refrigerator') {
        const { itemName, calories, image } = action.context;
        if (itemName) {
          const activeSurface = processor.getSurfaces()[0];
          if (activeSurface) {
            // 1. Update old text list model
            const currentListText = activeSurface.dataModel.get('/refrigerator/listText') || '';
            const updatedListText = currentListText ? `${currentListText}\n- 🥬 ${itemName}` : `- 🥬 ${itemName}`;
            activeSurface.dataModel.set('/refrigerator/listText', updatedListText);
            activeSurface.dataModel.set('/refrigerator/newItemName', '');

            // 2. Update new grid items array model
            const currentItems = activeSurface.dataModel.get('/refrigerator/items') || [];
            const exists = currentItems.some((item: any) => item.name.toLowerCase() === itemName.toLowerCase());
            if (!exists) {
              const newItem = {
                name: itemName,
                calories: calories || '25 kcal',
                image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80',
                quantity: '1 pc'
              };
              activeSurface.dataModel.set('/refrigerator/items', [...currentItems, newItem]);
            }
          }
        }
      } else if (action.name === 'remove_from_refrigerator') {
        const { itemName } = action.context;
        if (itemName) {
          const activeSurface = processor.getSurfaces()[0];
          if (activeSurface) {
            const currentItems = activeSurface.dataModel.get('/refrigerator/items') || [];
            const updatedItems = currentItems.filter((item: any) => item.name.toLowerCase() !== itemName.toLowerCase());
            activeSurface.dataModel.set('/refrigerator/items', updatedItems);

            const newListText = updatedItems.map((item: any) => `- 🥬 ${item.name}`).join('\n');
            activeSurface.dataModel.set('/refrigerator/listText', newListText);
          }
        }
      } else if (action.name === 'buy_ingredients') {
        const actionTimestamp = new Date().toLocaleTimeString();
        const actionLog = `[Purchase Action] Initiating purchase on ${action.context.store.toUpperCase()} for recipe ingredients: ${JSON.stringify(action.context.ingredients)}`;
        setLogs((prev) => [{ time: actionTimestamp, message: actionLog }, ...prev]);
        alert(`Successfully initiated purchase on ${action.context.store} for recipe: "${action.context.recipe}"!`);
      }
    });
  }, []);

  // 2. Synchronize surface list from message processor
  useEffect(() => {
    const unsub = processor.subscribeSurfaces(() => {
      setSurfaces(processor.getSurfaces());
    });
    return unsub;
  }, [processor]);

  // 3. Parse JSON from editor and feed update commands to engine
  useEffect(() => {
    if (isStreaming) return; // Skip sync during streaming to avoid conflicts
    try {
      const parsed = JSON.parse(jsonText);
      setIsValidJson(true);
      setJsonError(null);

      // Re-initialize and execute message log in simulator
      processor.reset();
      processor.processMessages(parsed);
      setSurfaces(processor.getSurfaces());
    } catch (err: any) {
      setIsValidJson(false);
      setJsonError(err.message || 'JSON Syntax Error');
    }
  }, [jsonText, processor, isStreaming]);

  // 4. Track dynamic data model changes on the main surface
  const mainSurface = surfaces[0];
  useEffect(() => {
    if (mainSurface) {
      const unsub = mainSurface.dataModel.subscribe('/', () => {
        setActiveSurfaceData({ ...mainSurface.dataModel.getRawData() });
      });
      // Initial trigger
      setActiveSurfaceData({ ...mainSurface.dataModel.getRawData() });
      return unsub;
    } else {
      setActiveSurfaceData({});
    }
  }, [mainSurface, surfaces]);

  const handleSendToAgent = async () => {
    if (!queryInput.trim()) return;
    setLoadingAgent(true);
    setAgentError(null);
    setIsStreaming(true);

    const requestTimestamp = new Date().toLocaleTimeString();
    const requestLog = `[Chat Request] Sent query to FoodAI server: "${queryInput}"`;
    setLogs((prev) => [{ time: requestTimestamp, message: requestLog }, ...prev]);

    // Clear previous surface state before streaming
    processor.reset();
    setSurfaces([]);
    setJsonText('[\n');

    try {
      const res = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: queryInput }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMsg = `HTTP error ${res.status}`;
        try {
          const parsedErr = JSON.parse(errorText);
          errorMsg = parsedErr.error || parsedErr.details || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('Readable stream not supported or missing from response.');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;
      let firstMessage = true;
      const receivedMessages: any[] = [];

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const textChunk = decoder.decode(value, { stream: true });
          buffer += textChunk;

          // Split buffer by newlines to get individual JSON lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const parsedMsg = JSON.parse(trimmed);
              receivedMessages.push(parsedMsg);

              // 1. Process message immediately on the surface engine
              processor.processMessage(parsedMsg);
              // 2. Refresh surfaces list in React to trigger updates
              setSurfaces(processor.getSurfaces());

              // 3. Append to textarea text format visually
              setJsonText((prev) => {
                const cleanPrev = prev.trim() === '[\n' ? '[\n' : prev;
                const formattedMsg = JSON.stringify(parsedMsg, null, 2)
                  .split('\n')
                  .map(l => '  ' + l)
                  .join('\n');
                
                if (firstMessage) {
                  firstMessage = false;
                  return '[\n' + formattedMsg;
                } else {
                  return cleanPrev + ',\n' + formattedMsg;
                }
              });
            } catch (err) {
              console.error('Failed to parse streaming line:', trimmed, err);
            }
          }
        }
      }

      // Close the JSON array in textarea
      setJsonText((prev) => prev + '\n]');

      const responseTimestamp = new Date().toLocaleTimeString();
      const responseLog = `[Chat Response] Completed streaming with ${receivedMessages.length} messages.`;
      setLogs((prev) => [{ time: responseTimestamp, message: responseLog }, ...prev]);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || 'Failed to connect to FoodAI agent server.';
      setAgentError(errMsg);

      const errorTimestamp = new Date().toLocaleTimeString();
      const errorLog = `[Chat Error] Failed to generate A2UI stream: ${errMsg}`;
      setLogs((prev) => [{ time: errorTimestamp, message: errorLog }, ...prev]);
    } finally {
      setLoadingAgent(false);
      setIsStreaming(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && mockTemplates[idx]) {
      setJsonText(JSON.stringify(mockTemplates[idx].messages, null, 2));
    }
  };

  const handleReset = () => {
    setJsonText(defaultMockJson);
    setLogs([]);
    setQueryInput('');
    setAgentError(null);
  };

  return (
    <div className="playground-container" id="playground-root">
      {/* Top Header Controls */}
      <header className="header-bar">
        <div className="logo-section">
          <h1>🤖 A2UI v0.9 Renderer <span>Spec-Sandbox</span></h1>
        </div>
        <div className="controls-section">
          <div className="template-selector">
            <label htmlFor="flow-template">Flow Template:</label>
            <select id="flow-template" onChange={handleTemplateChange}>
              {mockTemplates.map((t, idx) => (
                <option key={idx} value={idx}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-primary" onClick={handleReset} id="btn-reset">
            Reset Sandbox
          </button>
        </div>
      </header>

      {/* Agent Interactive Bar */}
      <div className="agent-bar">
        <input
          type="text"
          className="agent-input"
          placeholder="Ask FoodAI Agent (e.g. 'Show recipes for low-carb daily plan', 'add banana to refrigerator', 'Buy ingredients for Keto salad')"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendToAgent()}
          disabled={loadingAgent}
        />
        <button
          className="btn-primary"
          onClick={handleSendToAgent}
          disabled={loadingAgent || !queryInput.trim()}
        >
          {loadingAgent ? 'Generating A2UI...' : 'Send to Agent'}
        </button>
        {agentError && <span className="agent-error">⚠️ {agentError}</span>}
      </div>

      {/* Main split dashboard content */}
      <main className="workspace-grid">
        {/* Left Side: Text JSON Editor */}
        <section className="panel left-panel">
          <div className="panel-header">
            <span>A2UI Protocol Stream (JSON Array)</span>
            <span style={{ fontSize: '11px', opacity: 0.6 }}>Real-Time Editing Enabled</span>
          </div>
          <div className="panel-body json-editor-container">
            <textarea
              className="json-textarea"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste A2UI v0.9 JSON messages array here..."
              spellCheck="false"
              id="json-editor-input"
            />
            <div className={`validation-bar ${isValidJson ? 'valid' : 'invalid'}`}>
              {isValidJson ? '🟢 JSON Structure Valid' : `🔴 Invalid: ${jsonError}`}
            </div>
          </div>
        </section>

        {/* Right Side: Virtual Renderer Canvas */}
        <section className="panel right-panel">
          <div className="panel-header">
            <span>Live Surface Preview</span>
            <span style={{ color: 'var(--accent-color)' }}>v0.9 Specification</span>
          </div>
          <div className="panel-body" style={{ overflowY: 'auto' }}>
            <div className="rendering-viewport">
              <div className="viewport-device">
                <div className="viewport-header">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="viewport-address">localhost:3000/main-surface</div>
                </div>
                <div className="viewport-content" id="surface-render-viewport">
                  {surfaces.length === 0 ? (
                    <div className="empty-state">Waiting for createSurface message...</div>
                  ) : (
                    surfaces.map((s) => (
                      <A2uiSurface
                        key={s.id}
                        surface={s}
                        processor={processor}
                        catalog={basicCatalog}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom panels: Data model state + Action dispatch logger */}
      <footer className="bottom-panels">
        {/* Data Store State Inspector */}
        <section className="bottom-panel">
          <div className="panel-header">
            <span>Surface Data Model State</span>
          </div>
          <div className="panel-body" style={{ display: 'flex' }}>
            {surfaces.length > 0 ? (
              <pre className="data-inspector-pre">
                {JSON.stringify(activeSurfaceData, null, 2)}
              </pre>
            ) : (
              <div className="empty-state">No active surface data store.</div>
            )}
          </div>
        </section>

        {/* Action Event Dispatch Logs */}
        <section className="bottom-panel">
          <div className="panel-header">
            <span>Action Handler Event Log</span>
          </div>
          <div className="panel-body" style={{ display: 'flex' }}>
            {logs.length > 0 ? (
              <ul className="log-list" id="action-logs">
                {logs.map((l, idx) => (
                  <li key={idx} className="log-item">
                    <span>[{l.time}]</span>
                    {l.message}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">Interact with components to dispatch actions...</div>
            )}
          </div>
        </section>
      </footer>
    </div>
  );
}
