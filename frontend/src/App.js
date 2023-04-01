import { BrowserRouter } from 'react-router-dom';
import RenderRouters from './routes';

function App() {
  return (
    <BrowserRouter>
      <RenderRouters />
    </BrowserRouter>
  );
}

export default App;
