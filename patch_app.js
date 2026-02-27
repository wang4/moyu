const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  '<input type="radio" name="skin" value="dashboard" defaultChecked className="text-purple-500 accent-purple-500 w-4 h-4" />',
  `<input type="radio" name="skin" value="dashboard" checked={data.currentSkin === 'dashboard'} onChange={e => { const newSkin = e.target.value; localStorage.setItem('moyu_data_v2', JSON.stringify({...data, currentSkin: newSkin})); window.location.reload(); }} className="text-purple-500 accent-purple-500 w-4 h-4" />`
);
content = content.replace(
  '<input type="radio" name="skin" value="doc" className="text-purple-500 accent-purple-500 w-4 h-4" />',
  `<input type="radio" name="skin" value="doc" checked={data.currentSkin === 'doc'} onChange={e => { const newSkin = e.target.value; localStorage.setItem('moyu_data_v2', JSON.stringify({...data, currentSkin: newSkin})); window.location.reload(); }} className="text-purple-500 accent-purple-500 w-4 h-4" />`
);
content = content.replace(
  '<input type="radio" name="skin" value="winupdate" className="text-purple-500 accent-purple-500 w-4 h-4" />',
  `<input type="radio" name="skin" value="winupdate" checked={data.currentSkin === 'winupdate'} onChange={e => { const newSkin = e.target.value; localStorage.setItem('moyu_data_v2', JSON.stringify({...data, currentSkin: newSkin})); window.location.reload(); }} className="text-purple-500 accent-purple-500 w-4 h-4" />`
);
fs.writeFileSync('src/App.tsx', content);
