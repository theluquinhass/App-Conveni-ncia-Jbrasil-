import { useState } from 'react';
import { Lock, X, Check } from 'lucide-react';

const PasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '2828') {
            onSuccess();
            handleClose();
        } else {
            setError(true);
            setPassword('');
            // Auto-focus back or shake animation could go here
        }
    };

    const handleClose = () => {
        setPassword('');
        setError(false);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div className="card animate-fade-in" style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={20} color="var(--primary-color)" />
                        Senha Necessária
                    </h3>
                    <button onClick={handleClose} style={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <p style={styles.text}>Esta ação requer autorização.</p>

                    <div className="form-group">
                        <input
                            type="password"
                            inputMode="numeric"
                            autoFocus
                            className="form-input"
                            style={{
                                textAlign: 'center',
                                letterSpacing: '8px',
                                fontSize: '1.5rem',
                                borderColor: error ? 'var(--secondary-color)' : 'transparent'
                            }}
                            value={password}
                            onChange={(e) => {
                                setError(false);
                                setPassword(e.target.value);
                            }}
                            placeholder="••••"
                            maxLength={6}
                        />
                        {error && <span style={styles.errorMsg}>Senha incorreta</span>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <Check size={20} style={{ marginRight: '8px' }} />
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
    },
    modal: {
        width: '100%',
        maxWidth: '320px',
        backgroundColor: 'var(--surface-dark)',
        border: '1px solid var(--surface-light)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
    },
    text: {
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        textAlign: 'center',
    },
    errorMsg: {
        color: 'var(--secondary-color)',
        fontSize: '0.875rem',
        display: 'block',
        textAlign: 'center',
        marginTop: '8px',
    }
};

export default PasswordModal;
