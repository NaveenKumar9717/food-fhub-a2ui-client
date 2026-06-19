import React from 'react';
import { createComponentImplementation } from '../core/adapter';

export const NewsCard = createComponentImplementation('NewsCard', {}, ({ props }) => {
  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    background: '#121620',
    border: '1px solid #242c3d',
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    gap: '16px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    cursor: 'pointer',
  };

  const chevronStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#94a3b8',
    verticalAlign: 'middle',
  };

  const items = Array.isArray(props.items) ? props.items : [];

  return (
    <div style={cardStyle} className="a2ui-news-card">
      <div style={headerStyle} className="news-header">
        <span>{props.category || 'News'}</span>
        <span className="material-symbols-outlined" style={chevronStyle}>chevron_right</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item: any, idx: number) => {
          const itemStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            paddingTop: idx > 0 ? '16px' : '0px',
            borderTop: idx > 0 ? '1px solid #242c3d' : 'none',
            cursor: item.action ? 'pointer' : 'default',
            gap: '8px',
          };

          const sourceRowStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
          };

          const sourceLogoStyle: React.CSSProperties = {
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            objectFit: 'cover',
          };

          const sourceBadgeStyle: React.CSSProperties = {
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };

          const sourceNameStyle: React.CSSProperties = {
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#cbd5e1',
          };

          const contentRowStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
          };

          const headlineStyle: React.CSSProperties = {
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#ffffff',
            margin: 0,
            lineHeight: '1.4',
            flex: 1,
          };

          const thumbnailStyle: React.CSSProperties = {
            width: '72px',
            height: '54px',
            borderRadius: '8px',
            objectFit: 'cover',
            backgroundColor: '#191f2d',
            flexShrink: 0,
          };

          const footerRowStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          };

          const metaStyle: React.CSSProperties = {
            fontSize: '0.75rem',
            color: '#94a3b8',
            margin: 0,
          };

          const actionBtnStyle: React.CSSProperties = {
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#191f2d',
            border: '1px solid #242c3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
          };

          const handleItemClick = (e: React.MouseEvent) => {
            if (item.action) {
              e.stopPropagation();
              item.action();
            }
          };

          const getFirstLetter = (name: string) => {
            return name ? name.charAt(0).toUpperCase() : 'N';
          };

          return (
            <div key={idx} style={itemStyle} className="news-item" onClick={handleItemClick}>
              <div style={sourceRowStyle}>
                {item.sourceLogo ? (
                  <img src={item.sourceLogo} alt={item.sourceName} style={sourceLogoStyle} />
                ) : (
                  <div style={sourceBadgeStyle}>{getFirstLetter(item.sourceName)}</div>
                )}
                <span style={sourceNameStyle}>{item.sourceName || 'News Source'}</span>
              </div>

              <div style={contentRowStyle}>
                <h4 style={headlineStyle}>{item.title}</h4>
                {item.image && (
                  <img src={item.image} alt={item.title} style={thumbnailStyle} />
                )}
              </div>

              <div style={footerRowStyle}>
                <p style={metaStyle}>
                  {item.timeAgo}
                  {item.author ? ` • By ${item.author}` : ''}
                </p>
                {item.action && (
                  <button style={actionBtnStyle} className="news-action-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>article</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
