import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ControlCatalog from "./pages/ControlCatalog";
import KsiValidation from "./pages/KsiValidation";
import ProviderPage from "./pages/ProviderPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/control-catalog" element={<ControlCatalog />} />
              <Route path="/ksi-validation" element={<KsiValidation />} />
              <Route path="/provider/:provider" element={<ProviderPage />} />
              <Route path="/provider" element={<ProviderPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
