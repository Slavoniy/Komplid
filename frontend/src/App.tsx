import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('Проверка...')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('/api/health')
        setHealthStatus(JSON.stringify(response.data))
      } catch (error) {
        setHealthStatus('Ошибка подключения к API')
      }
    }
    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">ConstructionDocs Frontend</h1>
        <p className="text-gray-700 mb-2">Статус бэкенда и БД:</p>
        <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto text-gray-800">
          {healthStatus}
        </pre>
      </div>
    </div>
  )
}

export default App
