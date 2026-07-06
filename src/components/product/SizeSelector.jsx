function SizeSelector({ sizes = [], selected, onChange }) {
  if (sizes.length === 0) return null

  // Free Size — show as info label, nothing to select
  if (sizes.length === 1 && sizes[0] === 'Free Size') {
    return (
      <div className="size-selector">
        <p className="size-selector__label">Size: <strong>Free Size</strong></p>
      </div>
    )
  }

  return (
    <div className="size-selector">
      <p className="size-selector__label">
        Size: {selected && <strong>{selected}</strong>}
      </p>
      <div className="size-selector__options">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`size-selector__btn${selected === size ? ' size-selector__btn--active' : ''}`}
            onClick={() => onChange(size)}
            aria-pressed={selected === size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SizeSelector