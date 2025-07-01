// Crear partículas de fondo
function createParticles() {
    const particleCount = 20;
    const body = document.body;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        body.appendChild(particle);
    }
}

// Efecto de glitch aleatorio para todas las cards
function randomGlitch() {
    document.querySelectorAll('.chromatic-border').forEach(chromaticBorder => {
        if (Math.random() < 0.1) {
            chromaticBorder.style.animation = 'chromaticGlitch 0.3s ease-in-out';
            setTimeout(() => {
                chromaticBorder.style.animation = '';
            }, 300);
        }
    });
}

// Inicializar efectos
createParticles();
setInterval(randomGlitch, 1000);

// Generador dinámico de cards y modal para evidencias
fetch('data/logica_dba.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('cards-container');
    data.forEach((item, idx) => {
      if (!item.area || !item.nivel || !item.enunciado || !item.evidencias_de_aprendizaje) return;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="chromatic-border"></div>
        <div class="card-content">
          <div class="card-header">
            <h1 class="card-title">${item.area}</h1>
            <p class="card-subtitle">Nivel: ${item.nivel}</p>
          </div>
          <div class="card-body">
            <div class="geometric-shape"></div>
          </div>
          <div class="card-footer">
            <p class="card-description">${item.enunciado}</p>
          </div>
        </div>
      `;
      // Efecto de seguimiento del mouse SOLO para cada card generada
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      });
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('modal-title').textContent = `${item.area} - Nivel: ${item.nivel}`;
        const ul = document.getElementById('modal-evidencias-list');
        ul.innerHTML = '';
        item.evidencias_de_aprendizaje.forEach((ev, i) => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.alignItems = 'center';
          li.style.gap = '10px';
          const evidenciaKey = `evidencia_${idx}_${i}`;
          const isUploaded = localStorage.getItem(evidenciaKey);
          if (isUploaded) {
            // Solo icono check ✅
            const check = document.createElement('span');
            check.className = 'evidencia-check';
            check.innerHTML = '✅';
            li.appendChild(check);
            const span = document.createElement('span');
            span.textContent = ev;
            li.appendChild(span);
          } else {
            // Icono ⬜ y botón subir
            const check = document.createElement('span');
            check.className = 'evidencia-check';
            check.innerHTML = '⬜';
            const span = document.createElement('span');
            span.textContent = ev;
            const btn = document.createElement('button');
            btn.textContent = 'Subir Evidencia';
            btn.style = 'margin-left:10px;background:#4ecdc4;color:#fff;border:none;border-radius:8px;padding:4px 12px;cursor:pointer;font-size:0.95rem;';
            const input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            btn.onclick = function(e) {
              e.stopPropagation();
              input.click();
            };
            input.onchange = function() {
              if (input.files.length > 0) {
                // Reemplazar todo el contenido del li por el check ✅ y el texto
                li.innerHTML = '';
                const checkDone = document.createElement('span');
                checkDone.className = 'evidencia-check';
                checkDone.innerHTML = '✅';
                li.appendChild(checkDone);
                const spanDone = document.createElement('span');
                spanDone.textContent = ev;
                li.appendChild(spanDone);
                localStorage.setItem(evidenciaKey, '1');
              }
            };
            li.appendChild(check);
            li.appendChild(span);
            li.appendChild(btn);
            li.appendChild(input);
          }
          ul.appendChild(li);
        });
        document.getElementById('modal-evidencias').style.display = 'flex';
      });
      container.appendChild(card);
    });
  });

// Modal close
const modal = document.getElementById('modal-evidencias');
document.querySelector('.close-modal').onclick = function() {
  modal.style.display = 'none';
};
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};