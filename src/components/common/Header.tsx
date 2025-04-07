import Navigation from './Navigation';
import { ReactComponent as DcycleLogo } from '../../assets/img/Dcycle-logo.svg';
import Container from './Container';

const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700">
      <Container>
        <div className="flex w-full items-center justify-between gap-4 py-4">
          <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-4">
            <DcycleLogo className="h-12 w-auto dark:invert" />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div>Dcycle Frontend Test</div>
              <div className="font-bold">
                <a
                  href="https://www.linkedin.com/in/esadrian/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  Adrián López
                </a>
              </div>
            </div>
          </div>
          <Navigation />
        </div>
      </Container>
    </header>
  );
};

export default Header;
