import { BrowserRouter } from 'react-router-dom';
import RenderRouters from './routes';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <RenderRouters />
    </BrowserRouter>
  );
}

export default App;
