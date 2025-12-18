import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    {!isHome ? (
                        <Link to="/" style={styles.backButton}>
                            <ArrowLeft size={24} color="white" />
                        </Link>
                    ) : (
                        <div style={{ width: '24px' }}></div>
                    )}

                    <img src={logo} alt="Jbrasil" style={{ height: '140px', objectFit: 'contain' }} />

                    {/* Placeholder for balance, hidden for now */}
                    <div style={{ width: '24px' }}></div>
                </div>
            </header>

            <main style={styles.main}>
                {children}
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#121212', // Dark background matching global css
    },
    header: {
        backgroundColor: 'var(--surface-dark)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '600px',
        margin: '0 auto',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        transition: 'background-color 0.2s',
    },
    main: {
        flex: 1,
        padding: '16px',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
    }
};

export default Layout;
