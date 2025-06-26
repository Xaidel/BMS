import { QueryClient } from '@tanstack/query-core'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import LoginPage from './pages/Login';
import AppLayout from './components/ui/applayout';
import Dashboard from './pages/Dashboard';
import EventManager from './pages/EventManager';
import Residents from './pages/Residents';
import Households from './pages/Households';
import Certificate from './pages/Certificate';
import Income from './pages/Income';
import Expense from './pages/Expense';
import BlotterRecord from './pages/BlotterRecord';
import Official from './pages/Official';
function App() {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <Routes>
          <Route
            element={<AppLayout />}
          >
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/event-manager' element={<EventManager />} />
            <Route path='/residents' element={<Residents />} />
            <Route path='/households' element={<Households />} />
            <Route path='/certificates' element={<Certificate />} />
            <Route path='/income' element={<Income />} />
            <Route path='/expense' element={<Expense />} />
            <Route path='/blotter' element={<BlotterRecord />} />
            <Route path='/officials' element={<Official />} />
          </Route>
          <Route index element={<LoginPage />}></Route>
        </Routes>
      </Router >
    </QueryClientProvider>
  )
}

export default App;
