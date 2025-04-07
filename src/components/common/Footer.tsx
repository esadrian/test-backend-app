import ThemeToggle from './ThemeToggle';
import Container from './Container';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700">
      <Container>
        <div className="flex w-full items-center justify-between py-4">
          <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Created by{' '}
            <a
              href="https://www.linkedin.com/in/esadrian/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Adrián López
            </a>{' '}
            in{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
