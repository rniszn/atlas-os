import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/canvas/Experience';
import './App.css';

function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // The Bridge: Fetch data when the Study Module opens
  useEffect(() => {
    if (activeModule === 'study') {
      setLoading(true);
      fetch('http://localhost:5000/api/tasks')
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(data => {
          setTasks(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("API Fetch Error:", err);
          setTasks([{ id: 99, title: '❌ Cannot connect to backend server', priority: 'High', status: 'Error' }]);
          setLoading(false);
        });
    }
  }, [activeModule]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      
      {/* 3D WORKSPACE */}
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Experience setActiveModule={setActiveModule} />
        </Suspense>
      </Canvas>

      {/* OVERLAY UI: MODULE DRAWER */}
      {activeModule && (
        <div className="module-drawer">
          <button className="close-btn" onClick={() => setActiveModule(null)}>×</button>
          
          {activeModule === 'study' && (
            <div className="content">
              <h2>Study Workspace</h2>
              <p style={{ color: '#00d4ff', marginBottom: '20px' }}>Task Tracking & Syllabus</p>
              
              {loading ? (
                <div className="loading-spinner">Syncing with server...</div>
              ) : (
                <ul className="task-list" style={{ listStyle: 'none', padding: 0 }}>
                  {tasks.map(task => (
                    <li key={task.id} style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '15px', 
                      marginBottom: '10px',
                      borderLeft: task.priority === 'High' ? '4px solid #ff4757' : '4px solid #2ed573'
                    }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>Status: {task.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeModule === 'ai' && (
            <div className="content">
              <h2>AI Assistant</h2>
              <p>Real-time Doubt Clarification</p>
              <input type="text" placeholder="Ask Atlas anything..." className="chat-input" />
            </div>
          )}
        </div>
      )}

      {/* BRANDING */}
      <div className="branding" style={{ position: 'absolute', top: 20, left: 20, color: 'white', pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>ATLAS</h1>
        <p style={{ opacity: 0.7 }}>Lead Backend Engineer Workspace</p>
      </div>
    </div>
  );
}

export default App;