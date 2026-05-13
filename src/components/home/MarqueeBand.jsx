const items = [
    'New Collection', 'SS 2025', 'Free Shipping Over ₹5000',
    'Exclusive Pieces', 'Handcrafted Excellence', 'Limited Editions',
    'Sustainable Luxury', 'New Collection', 'SS 2025', 'Free Shipping Over ₹5000',
    'Exclusive Pieces', 'Handcrafted Excellence', 'Limited Editions', 'Sustainable Luxury',
  ]
  
  export default function MarqueeBand() {
    return (
      <div style={{
        borderTop: '1px solid var(--bo)', borderBottom: '1px solid var(--bo)',
        padding: '.95rem 0', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          animation: 'marquee 30s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {[...items, ...items].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem', flexShrink: 0 }}>
              <span style={{ fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--mu)' }}>
                {item}
              </span>
              <span style={{ width: 3, height: 3, background: 'var(--go)', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>
    )
  }