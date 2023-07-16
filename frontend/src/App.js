import { useScrollToTop } from "./hooks/use-scroll-to-top";
import AuthProvider from "./providers/auth/auth-provider";
import RenderRouters from "./routes";
import ThemeProvider from "./theme";
import ProgressBar from './components/progress-bar';
import { AuthConsumer } from "./providers/auth/auth-consumer";
import SnackbarProvider from "./components/snackbar/snackbar-provider";
// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App = () => {
  useScrollToTop();

  return <>
    <AuthProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <ProgressBar />
          <AuthConsumer>
            <RenderRouters />
          </AuthConsumer>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  </>
}

export default App
