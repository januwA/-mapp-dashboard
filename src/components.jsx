import React from "react";

export const Chart = () => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Chart Component</h3>
      <div style={{ height: '100px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        📊 Chart Data
      </div>
    </div>
  )
}

export const Sidebar = () => {
  return (
    <div style={{ border: '1px solid #333', padding: '15px', backgroundColor: '#f9f9f9' }}>
      <h3>Sidebar Component</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '5px 0' }}>📈 Analytics</li>
        <li style={{ margin: '5px 0' }}>👥 Users</li>
        <li style={{ margin: '5px 0' }}>⚙️ Settings</li>
      </ul>
    </div>
  )
}