document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  initRouter();
});

function initRouter(){
  renderRoute('home');
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const route = a.dataset.route;
      setActiveLink(route);
      renderRoute(route);
    });
  });
}

function setActiveLink(route){
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.classList.toggle('active', a.dataset.route===route);
  });
}

function renderRoute(route){
  const app = document.getElementById('app');
  if(route==='home') return renderHome(app);
  if(route==='about') return renderAbout(app);
  if(route==='dashboard') return renderDashboard(app);
  renderHome(app);
}

function renderHome(el){
  el.innerHTML = `
    <section class="hero">
      <div>
        <h2>Welcome to Instrument Dashboard</h2>
        <p>Monitor instruments, view recent telemetry, and get alerts — all in one lightweight UI.</p>
        <a class="cta" href="#" id="open-dashboard">Open Dashboard</a>
      </div>
      <div style="min-width:220px;max-width:360px">
        <div class="card">
          <h3>Quick Summary</h3>
          <p class="muted">Active instruments: <strong id="active-count">—</strong></p>
        </div>
      </div>
    </section>
    <section class="features">
      <div class="card"><h3>Realtime Telemetry</h3><p class="muted">Stream live data and inspect trends.</p></div>
      <div class="card"><h3>Alerts</h3><p class="muted">Custom alerts for thresholds and anomalies.</p></div>
      <div class="card"><h3>Integrations</h3><p class="muted">Connect to your data sources and APIs.</p></div>
    </section>
  `;

  // small demo: populate active count and wire CTA
  document.getElementById('active-count').textContent = Math.floor(Math.random()*12)+1;
  document.getElementById('open-dashboard').addEventListener('click', (e)=>{
    e.preventDefault();
    setActiveLink('dashboard');
    renderRoute('dashboard');
  });
}

function renderAbout(el){
  el.innerHTML = `
    <section class="card">
      <h2>About</h2>
      <p class="muted">This demo home page is built with plain HTML, CSS and JavaScript. Replace this content with your actual app details.</p>
    </section>
  `;
}

function renderDashboard(el){
  el.innerHTML = `
    <h2>QA Testing Dashboard</h2>

    <div class="cards">
      <div class="card">
        <h3>Total Test Cases</h3>
        <p>8</p>
      </div>
      <div class="card">
        <h3>Pass Rate</h3>
        <p>50%</p>
      </div>
      <div class="card">
        <h3>Failed Tests</h3>
        <p>1</p>
      </div>
      <div class="card">
        <h3>Open Bugs</h3>
        <p>1</p>
      </div>
    </div>

    <div class="main" style="display:grid;grid-template-columns:1fr 320px;gap:16px;margin-top:18px">
      <div class="panel card">
        <h3>Test Results</h3>
        <canvas id="chart" width="300" height="300"></canvas>
      </div>

      <div class="panel card">
        <h3>Recent Activity</h3>
        <ul>
          <li>TC-001 passed</li>
          <li>BUG-001 created</li>
          <li>Regression completed</li>
        </ul>
      </div>
    </div>

    <div class="table-panel card" style="margin-top:18px">
      <h3>Test Cases</h3>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <th style="text-align:left;padding:8px">ID</th><th style="text-align:left;padding:8px">Title</th><th style="text-align:left;padding:8px">Status</th><th style="text-align:left;padding:8px">Priority</th>
        </tr>
        <tr>
          <td style="padding:8px">TC-001</td>
          <td style="padding:8px">Login with valid credentials</td>
          <td style="padding:8px" class="status-passed">Passed</td>
          <td style="padding:8px"><span class="badge high">High</span></td>
        </tr>
        <tr>
          <td style="padding:8px">TC-002</td>
          <td style="padding:8px">Invalid password</td>
          <td style="padding:8px" class="status-failed">Failed</td>
          <td style="padding:8px"><span class="badge high">High</span></td>
        </tr>
        <tr>
          <td style="padding:8px">TC-003</td>
          <td style="padding:8px">Password reset</td>
          <td style="padding:8px" class="status-pending">Pending</td>
          <td style="padding:8px"><span class="badge medium">Medium</span></td>
        </tr>
      </table>
    </div>
  `;

  // initialize chart (Chart.js is loaded from CDN in index.html)
  const ctx = document.getElementById('chart');
  if(ctx && typeof Chart !== 'undefined'){
    // small demo dataset
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Pending'],
        datasets: [{
          data: [4, 2, 2],
          backgroundColor: ['#10b981','#ef4444','#f59e0b']
        }]
      },
      options: {maintainAspectRatio:false}
    });
  }
}
