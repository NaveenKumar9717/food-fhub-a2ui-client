import React from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { createComponentImplementation } from '../core/adapter';
import { Catalog } from '../core/A2uiSurface';

// Initialize markdown-it and DOMPurify
const md = new MarkdownIt({ html: true, linkify: true, breaks: true });
const renderMarkdown = (text: string): string => {
  return DOMPurify.sanitize(md.render(text));
};

// Styling helper utilities
const mapAlign = (align?: string) => {
  switch (align) {
    case 'start': return 'flex-start';
    case 'center': return 'center';
    case 'end': return 'flex-end';
    case 'stretch': return 'stretch';
    default: return 'stretch';
  }
};

const mapJustify = (justify?: string) => {
  switch (justify) {
    case 'start': return 'flex-start';
    case 'center': return 'center';
    case 'end': return 'flex-end';
    case 'spaceBetween': return 'space-between';
    case 'spaceAround': return 'space-around';
    case 'spaceEvenly': return 'space-evenly';
    default: return 'flex-start';
  }
};

// --- Layout Components ---

export const Column = createComponentImplementation('Column', {}, ({ props, buildChild }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: props.gap !== undefined ? `${props.gap}px` : 'var(--a2ui-spacing-m, 8px)',
    padding: props.padding !== undefined ? `${props.padding}px` : '0',
    alignItems: mapAlign(props.align),
    justifyContent: mapJustify(props.justify),
    width: '100%',
    boxSizing: 'border-box',
  };
  
  const children = props.children || [];
  return (
    <div style={style}>
      {children.map((childId: string) => buildChild(childId))}
    </div>
  );
});

export const Row = createComponentImplementation('Row', {}, ({ props, buildChild }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: props.gap !== undefined ? `${props.gap}px` : 'var(--a2ui-spacing-m, 8px)',
    padding: props.padding !== undefined ? `${props.padding}px` : '0',
    alignItems: mapAlign(props.align),
    justifyContent: mapJustify(props.justify),
    width: '100%',
    boxSizing: 'border-box',
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
  };

  const children = props.children || [];
  return (
    <div style={style}>
      {children.map((childId: string) => buildChild(childId))}
    </div>
  );
});

export const Card = createComponentImplementation('Card', {}, ({ props, buildChild }) => {
  const style: React.CSSProperties = {
    padding: props.padding !== undefined ? `${props.padding}px` : 'var(--a2ui-spacing-l, 16px)',
    borderRadius: 'var(--a2ui-border-radius, 8px)',
    border: 'var(--a2ui-border, 1px solid var(--a2ui-color-border, #ccc))',
    background: 'var(--a2ui-color-surface, #fff)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div className="a2ui-card" style={style}>
      {props.child ? buildChild(props.child) : null}
    </div>
  );
});

export const List = createComponentImplementation('List', {}, ({ props, buildChild }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--a2ui-spacing-s, 4px)',
    width: '100%',
    boxSizing: 'border-box',
  };

  const children = props.children || [];
  return (
    <div style={style}>
      {children.map((childId: string) => buildChild(childId))}
    </div>
  );
});

// --- Content Components ---

export const Text = createComponentImplementation('Text', {}, ({ props }) => {
  const textStr = typeof props.text === 'string' ? props.text : String(props.text ?? '');
  const variant = props.variant || 'body';

  const style: React.CSSProperties = {
    color: 'var(--a2ui-color-on-surface, #333)',
    margin: '0',
    fontFamily: 'var(--a2ui-font-family, inherit)',
  };

  if (variant === 'h1') {
    return <h1 style={{ ...style, fontSize: 'var(--a2ui-font-size-2xl, 1.8rem)', fontWeight: 'bold' }}>{textStr}</h1>;
  } else if (variant === 'h2') {
    return <h2 style={{ ...style, fontSize: 'var(--a2ui-font-size-xl, 1.5rem)', fontWeight: 'bold' }}>{textStr}</h2>;
  } else if (variant === 'h3') {
    return <h3 style={{ ...style, fontSize: 'var(--a2ui-font-size-l, 1.25rem)', fontWeight: 'bold' }}>{textStr}</h3>;
  } else if (variant === 'caption') {
    return <span style={{ ...style, fontSize: 'var(--a2ui-font-size-xs, 0.75rem)', opacity: 0.7 }}>{textStr}</span>;
  }

  // Markdown rendering
  const cleanHtml = renderMarkdown(textStr);
  return (
    <div
      style={{
        ...style,
        fontSize: 'var(--a2ui-font-size-m, 1rem)',
        lineHeight: 'var(--a2ui-line-height-body, 1.5)',
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
});

export const Image = createComponentImplementation('Image', {}, ({ props }) => {
  const style: React.CSSProperties = {
    maxWidth: '100%',
    height: props.height !== undefined ? `${props.height}px` : 'auto',
    width: props.width !== undefined ? `${props.width}px` : 'auto',
    borderRadius: 'var(--a2ui-border-radius, 8px)',
    objectFit: 'cover',
  };

  return <img src={props.src} alt={props.alt || ''} style={style} />;
});

export const Icon = createComponentImplementation('Icon', {}, ({ props }) => {
  const isPath = typeof props.name === 'object' && props.name !== null && 'svgPath' in props.name;
  
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: props.size !== undefined ? `${props.size}px` : 'var(--a2ui-font-size-xl, 24px)',
    width: props.size !== undefined ? `${props.size}px` : 'auto',
    height: props.size !== undefined ? `${props.size}px` : 'auto',
  };

  if (isPath) {
    return (
      <svg viewBox="0 0 24 24" style={{ ...style, fill: 'currentColor' }}>
        <path d={props.name.svgPath} />
      </svg>
    );
  }

  // Material Symbol camelCase mapping (e.g. shoppingCart -> shopping_cart)
  const iconName = typeof props.name === 'string'
    ? props.name.replace(/[A-Z]/g, (letter: string) => '_' + letter.toLowerCase())
    : '';

  return (
    <span className="material-symbols-outlined" style={style}>
      {iconName}
    </span>
  );
});

// --- Interactive Components ---

export const Button = createComponentImplementation('Button', {}, ({ props, buildChild }) => {
  const isPrimary = props.variant === 'primary';
  const isBorderless = props.variant === 'borderless';

  const style: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 'var(--a2ui-border-radius, 4px)',
    cursor: props.disabled || props.isValid === false ? 'not-allowed' : 'pointer',
    opacity: props.disabled || props.isValid === false ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--a2ui-font-size-s, 0.875rem)',
    fontWeight: '500',
    transition: 'all 0.15s ease',
    border: isPrimary ? 'none' : isBorderless ? 'none' : '1px solid var(--a2ui-color-border, #ccc)',
    backgroundColor: isPrimary ? 'var(--a2ui-color-primary, #17e)' : 'transparent',
    color: isPrimary ? '#fff' : 'var(--a2ui-color-on-surface, #333)',
    gap: '6px',
  };

  return (
    <button
      style={style}
      onClick={props.action}
      disabled={props.disabled || props.isValid === false}
      className={`a2ui-button ${isPrimary ? 'primary' : ''}`}
    >
      {props.iconSrc && (
        <img
          src={props.iconSrc}
          alt=""
          style={{
            width: '18px',
            height: '18px',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />
      )}
      {props.child ? buildChild(props.child) : 'Button'}
    </button>
  );
});

export const TextField = createComponentImplementation('TextField', {}, ({ props }) => {
  const isLong = props.variant === 'longText';
  const inputType = props.variant === 'number' ? 'number' : props.variant === 'obscured' ? 'password' : 'text';
  const hasError = props.validationErrors && props.validationErrors.length > 0;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--a2ui-font-size-xs, 0.75rem)',
    fontWeight: '600',
    color: 'var(--a2ui-color-on-surface, #555)',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 'var(--a2ui-border-radius, 4px)',
    border: `1px solid ${hasError ? '#f44336' : 'var(--a2ui-color-border, #ccc)'}`,
    fontSize: 'var(--a2ui-font-size-m, 1rem)',
    outline: 'none',
    backgroundColor: 'var(--a2ui-color-input, #fff)',
    color: 'var(--a2ui-color-on-input, #333)',
    width: '100%',
    boxSizing: 'border-box',
  };

  const errorStyle: React.CSSProperties = {
    color: '#f44336',
    fontSize: 'var(--a2ui-font-size-xs, 0.75rem)',
    marginTop: '2px',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (props.setValue) {
      props.setValue(e.target.value);
    }
  };

  return (
    <div style={containerStyle}>
      {props.label && <label style={labelStyle}>{props.label}</label>}
      {isLong ? (
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={props.value || ''}
          placeholder={props.placeholder}
          onChange={handleChange}
        />
      ) : (
        <input
          type={inputType}
          style={inputStyle}
          value={props.value || ''}
          placeholder={props.placeholder}
          onChange={handleChange}
        />
      )}
      {hasError && <span style={errorStyle}>{props.validationErrors[0]}</span>}
    </div>
  );
});

export const CheckBox = createComponentImplementation('CheckBox', {}, ({ props }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--a2ui-font-size-m, 1rem)',
    color: 'var(--a2ui-color-on-surface, #333)',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.setChecked) {
      props.setChecked(e.target.checked);
    }
  };

  return (
    <label style={containerStyle}>
      <input
        type="checkbox"
        checked={!!props.checked}
        onChange={handleChange}
      />
      {props.label && <span style={labelStyle}>{props.label}</span>}
    </label>
  );
});

export const ChoicePicker = createComponentImplementation('ChoicePicker', {}, ({ props }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--a2ui-font-size-xs, 0.75rem)',
    fontWeight: '600',
    color: 'var(--a2ui-color-on-surface, #555)',
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 'var(--a2ui-border-radius, 4px)',
    border: '1px solid var(--a2ui-color-border, #ccc)',
    fontSize: 'var(--a2ui-font-size-m, 1rem)',
    outline: 'none',
    backgroundColor: 'var(--a2ui-color-input, #fff)',
    color: 'var(--a2ui-color-on-input, #333)',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.setValue) {
      props.setValue(e.target.value);
    }
  };

  const options = props.options || [];

  return (
    <div style={containerStyle}>
      {props.label && <label style={labelStyle}>{props.label}</label>}
      <select style={selectStyle} value={props.value || ''} onChange={handleChange}>
        {options.map((opt: { value: string; label: string }, idx: number) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

// --- Food AI Custom Premium Components ---

export const UserProfile = createComponentImplementation('UserProfile', {}, ({ props }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    border: '1px solid #334155',
    color: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  };

  const infoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  };

  const goalStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: 0,
  };

  const metricStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: 0,
  };

  const calStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#f59e0b',
    margin: 0,
    marginTop: '4px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '2px solid #ffffff',
    objectFit: 'cover',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={style}>
      <div style={infoStyle}>
        <h3 style={nameStyle}>{props.name || 'User Name'}</h3>
        <p style={goalStyle}>{props.dietGoal || 'Balanced Diet'}</p>
        {props.metrics && <p style={metricStyle}>{props.metrics}</p>}
        {props.maintenanceCalories && (
          <p style={calStyle}>🔥 {props.maintenanceCalories}</p>
        )}
      </div>
      {props.avatar && (
        <img src={props.avatar} alt="User Avatar" style={avatarStyle} />
      )}
    </div>
  );
});

export const FoodItem = createComponentImplementation('FoodItem', {}, ({ props }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '130px',
    padding: '8px',
    borderRadius: '12px',
    background: '#1e293b',
    border: '1px solid #334155',
    boxSizing: 'border-box',
    gap: '6px',
    position: 'relative',
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const addBtnStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffffff',
    border: '1.5px solid #ff3f6c',
    color: '#ff3f6c',
    borderRadius: '16px',
    padding: '4px 14px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    transition: 'all 0.15s ease',
    outline: 'none',
  };

  const detailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const calStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#94a3b8',
    margin: 0,
  };

  const qtyStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#64748b',
    margin: 0,
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.action) {
      props.action();
    }
  };

  return (
    <div style={containerStyle} className="a2ui-food-item">
      <div style={imageWrapperStyle}>
        <img src={props.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'} alt={props.name} style={imageStyle} />
        {props.action && (
          <button style={addBtnStyle} onClick={handleActionClick}>
            {props.actionText || 'ADD'}
          </button>
        )}
      </div>
      <div style={detailsStyle}>
        <p style={nameStyle}>{props.name || 'Food Item'}</p>
        <p style={calStyle}>{props.calories || '0 kcal'}</p>
        {props.quantity && <p style={qtyStyle}>{props.quantity}</p>}
      </div>
    </div>
  );
});

export const RefrigeratorGrid = createComponentImplementation('RefrigeratorGrid', {}, ({ props }) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
    width: '100%',
    boxSizing: 'border-box',
    padding: '4px 0',
  };

  const emptyStyle: React.CSSProperties = {
    padding: '24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '13px',
    fontStyle: 'italic',
    width: '100%',
  };

  const items = Array.isArray(props.items) ? props.items : [];

  if (items.length === 0) {
    return <div style={emptyStyle}>Refrigerator is empty</div>;
  }

  return (
    <div style={gridStyle}>
      {items.map((item: any, idx: number) => {
        const foodItemProps = {
          name: item.name,
          image: item.image,
          calories: item.calories,
          quantity: item.quantity,
          actionText: 'REMOVE',
          action: () => {
            if (props.removeAction) {
              props.removeAction({ itemName: item.name });
            }
          }
        };

        return (
          <FoodItemWrapper key={idx} foodProps={foodItemProps} />
        );
      })}
    </div>
  );
});

const FoodItemWrapper: React.FC<{ foodProps: any }> = ({ foodProps }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '8px',
    borderRadius: '12px',
    background: '#1e293b',
    border: '1px solid #334155',
    boxSizing: 'border-box',
    gap: '6px',
    position: 'relative',
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const removeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#334155',
    border: '1.5px solid #475569',
    color: '#cbd5e1',
    borderRadius: '16px',
    padding: '4px 14px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
    transition: 'all 0.15s ease',
    outline: 'none',
  };

  const detailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const calStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#94a3b8',
    margin: 0,
  };

  const qtyStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#64748b',
    margin: 0,
  };

  return (
    <div style={containerStyle} className="a2ui-food-item inside-refrigerator">
      <div style={imageWrapperStyle}>
        <img src={foodProps.image} alt={foodProps.name} style={imageStyle} />
        {foodProps.action && (
          <button style={removeBtnStyle} onClick={foodProps.action}>
            {foodProps.actionText}
          </button>
        )}
      </div>
      <div style={detailsStyle}>
        <p style={nameStyle}>{foodProps.name}</p>
        <p style={calStyle}>{foodProps.calories}</p>
        {foodProps.quantity && <p style={qtyStyle}>{foodProps.quantity}</p>}
      </div>
    </div>
  );
};

export const RecipeItem = createComponentImplementation('RecipeItem', {}, ({ props }) => {
  const isRow = props.variant === 'row';

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '12px',
    background: '#1e293b',
    border: '1px solid #334155',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const rowImageStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#0f172a',
  };

  const rowInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '4px',
  };

  const rowTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  };

  const rowMetaStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0,
  };

  const rowActionsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    color: '#94a3b8',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    background: '#1e293b',
    border: '1px solid #334155',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    gap: '12px',
    paddingBottom: '16px',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px 0 16px',
  };

  const userMetaStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
  };

  const userAvatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const userTextStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  };

  const userSubStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#94a3b8',
    margin: 0,
  };

  const joinBtnStyle: React.CSSProperties = {
    padding: '4px 12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#334155',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
  };

  const cardImageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const cardContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px',
    gap: '8px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: '1.4',
    margin: 0,
  };

  const cardBuyRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    marginTop: '6px',
  };

  const buyBtnStyle = (isZepto: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    color: '#ffffff',
    backgroundColor: isZepto ? '#ff3f6c' : '#334155',
    transition: 'all 0.15s ease',
  });

  const storeIconStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '2px',
    objectFit: 'contain',
  };

  if (isRow) {
    return (
      <div style={rowStyle} className="a2ui-recipe-item-row">
        <img src={props.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80'} alt={props.title} style={rowImageStyle} />
        <div style={rowInfoStyle}>
          <p style={rowTitleStyle}>{props.title || 'Recipe'}</p>
          <p style={rowMetaStyle}>
            {props.category ? `${props.category} • ` : ''}
            {props.calories || '0 kcal'}
            {props.prepTime ? ` • ⏳ ${props.prepTime}` : ''}
          </p>
        </div>
        <div style={rowActionsStyle}>
          <span className="material-symbols-outlined" style={{ ...iconStyle, color: '#64748b' }}>swap_horiz</span>
          <span className="material-symbols-outlined" style={{ ...iconStyle, color: '#64748b' }}>calendar_today</span>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle} className="a2ui-recipe-item-card">
      <div style={cardHeaderStyle}>
        <div style={userMetaStyle}>
          <img src={props.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80'} alt="Author" style={userAvatarStyle} />
          <div style={userTextStyle}>
            <p style={userNameStyle}>{props.authorName || 'Estefana V. Cruz'}</p>
            <p style={userSubStyle}>{props.communityName || 'Recipe added in MealPrep'}</p>
          </div>
        </div>
        <button style={joinBtnStyle}>Join</button>
      </div>

      <img src={props.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'} alt={props.title} style={cardImageStyle} />

      <div style={cardContentStyle}>
        <h4 style={cardTitleStyle}>{props.title || 'Recipe Title'}</h4>
        {props.description && <p style={cardDescStyle}>{props.description}</p>}
        {props.prepTime && <p style={userSubStyle}>⏳ Prep Time: {props.prepTime} | Calories: {props.calories}</p>}

        <div style={cardBuyRowStyle}>
          {props.zeptoAction && (
            <button style={buyBtnStyle(true)} onClick={props.zeptoAction}>
              <img src="/icons/Zepto.jpeg" alt="Zepto" style={storeIconStyle} />
              Buy on Zepto
            </button>
          )}
          {props.blinkitAction && (
            <button style={buyBtnStyle(false)} onClick={props.blinkitAction}>
              <img src="/icons/Blinkit.jpeg" alt="Blinkit" style={storeIconStyle} />
              Buy on Blinkit
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// Define and assemble the basic components catalog
export const basicCatalog: Catalog = {
  components: new Map([
    ['Column', Column],
    ['Row', Row],
    ['Card', Card],
    ['List', List],
    ['Text', Text],
    ['Image', Image],
    ['Icon', Icon],
    ['Button', Button],
    ['TextField', TextField],
    ['CheckBox', CheckBox],
    ['ChoicePicker', ChoicePicker],
    ['UserProfile', UserProfile],
    ['FoodItem', FoodItem],
    ['RefrigeratorGrid', RefrigeratorGrid],
    ['RecipeItem', RecipeItem],
  ]),
};
