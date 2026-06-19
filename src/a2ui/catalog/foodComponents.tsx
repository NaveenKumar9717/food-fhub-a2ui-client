import React from 'react';
import { createComponentImplementation } from '../core/adapter';

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
