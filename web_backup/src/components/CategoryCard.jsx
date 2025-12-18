import { Link } from 'react-router-dom';

const CategoryCard = ({ title, icon: Icon, to, color }) => {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <div
                className="card"
                style={{
                    ...styles.card,
                    background: `linear-gradient(135deg, var(--surface-dark), ${color}22)` /* 22 = low opacity hex */
                }}
            >
                <div style={{ ...styles.iconContainer, backgroundColor: `${color}33`, color: color }}>
                    <Icon size={32} />
                </div>
                <h2 style={styles.title}>{title}</h2>
                <div style={styles.arrow}>→</div>
            </div>
        </Link>
    );
};

const styles = {
    card: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px',
        height: '100px',
        transition: 'transform 0.2s ease',
    },
    iconContainer: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '16px',
    },
    title: {
        flex: 1,
        margin: 0,
        fontSize: '1.25rem',
    },
    arrow: {
        color: 'var(--text-secondary)',
        fontSize: '1.5rem',
    }
};

export default CategoryCard;
