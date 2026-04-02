import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1>🚀 Apex SEO Plugin</h1>
      <p>Shopify SEO Plugin - Running Locally</p>

      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome to Apex SEO!</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <div className="links">
        <a href="https://shopify.com" target="_blank">Shopify Docs</a>
        <a href="https://react.dev" target="_blank">React Docs</a>
      </div>
    </div>
  )
}

export default App
