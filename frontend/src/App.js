import './App.css';
import useSocket from './useSocket';

function App() {

  const { role, gameGrid, sendMessage } = useSocket()

  console.log(role, role, gameGrid, gameGrid);
  
  return (
    <div className="App">
      <header className="App-header">
          Learn React
      </header>
    </div>
  );
}

export default App;
