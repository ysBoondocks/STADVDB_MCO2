import Home from './pages/Home';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>IMDB</title>
      </Helmet>
      <Home></Home>
    </div>
  );
}

export default App;
