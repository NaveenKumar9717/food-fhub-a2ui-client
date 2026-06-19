import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { createComponentImplementation } from '../core/adapter';
import { LOCAL_ICONS_MAP } from './iconsMap';

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
  const name = props.name;
  const isPath = typeof name === 'object' && name !== null && 'svgPath' in name;
  
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: props.size !== undefined ? `${props.size}px` : 'var(--a2ui-font-size-xl, 24px)',
    width: props.size !== undefined ? `${props.size}px` : 'auto',
    height: props.size !== undefined ? `${props.size}px` : 'auto',
    color: props.color || 'inherit',
  };

  if (isPath) {
    return (
      <svg viewBox="0 0 24 24" style={{ ...style, fill: 'currentColor' }}>
        <path d={(name as any).svgPath} />
      </svg>
    );
  }

  if (typeof name === 'string') {
    // 1. Look up react-icons map
    const ReactIcon = LOCAL_ICONS_MAP[name] || LOCAL_ICONS_MAP[name.replace(/[A-Z]/g, (letter: string) => '_' + letter.toLowerCase())];
    if (ReactIcon) {
      return (
        <span style={style} className="a2ui-local-icon">
          <ReactIcon size={props.size || 24} />
        </span>
      );
    }

    // 2. Fallback to Google Material Symbols
    const iconName = name.replace(/[A-Z]/g, (letter: string) => '_' + letter.toLowerCase());
    return (
      <span className="material-symbols-outlined" style={style}>
        {iconName}
      </span>
    );
  }

  return null;
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

export const Carousel = createComponentImplementation('Carousel', {}, ({ props, buildChild }) => {
  const children = props.children || [];
  const options = { loop: true, align: 'start', ...props.options };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const onInit = React.useCallback((api: any) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on('reinit' as any, onInit).on('reinit' as any, onSelect).on('select', onSelect);

    return () => {
      emblaApi.off('reinit' as any, onInit);
      emblaApi.off('reinit' as any, onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  const onPrevButtonClick = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {children.map((childId: string, idx: number) => (
            <div className="embla__slide" key={childId || idx}>
              {buildChild(childId)}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <button
            className={`embla__button embla__button--prev ${prevBtnDisabled ? 'embla__button--disabled' : ''}`}
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            type="button"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            className={`embla__button embla__button--next ${nextBtnDisabled ? 'embla__button--disabled' : ''}`}
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            type="button"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
});
