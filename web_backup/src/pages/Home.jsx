import Layout from '../components/Layout';
import CategoryCard from '../components/CategoryCard';
import { Droplets, IceCream, ClipboardCheck, DollarSign } from 'lucide-react';

const Home = () => {
    return (
        <Layout>
            <div style={{ padding: '20px 0' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Ferramentas</h2>

                <CategoryCard
                    title="Conferência"
                    icon={ClipboardCheck}
                    to="/conferencia"
                    color="var(--success-color)"
                />

                <CategoryCard
                    title="Frente de Caixa"
                    icon={DollarSign}
                    to="/vendas"
                    color="#ffd166"
                />

                <div style={{ margin: '32px 0 16px', borderTop: '1px solid var(--surface-light)' }}></div>

                <h2 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Categorias</h2>

                <CategoryCard
                    title="Água"
                    icon={Droplets}
                    to="/agua"
                    color="var(--primary-color)"
                />

                <CategoryCard
                    title="Sorvete"
                    icon={IceCream}
                    to="/sorvete"
                    color="var(--secondary-color)"
                />
            </div>
        </Layout>
    );
};

export default Home;
