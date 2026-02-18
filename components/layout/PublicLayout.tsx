import Header from './Header';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pt-16 md:pt-20 outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
