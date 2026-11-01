// Add scroll reveal effect for the philosophy panels
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.content');
  
  // Initially add 'reveal' class to all contents
  elements.forEach(el => {
    el.classList.add('reveal');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  elements.forEach(el => {
    observer.observe(el);
  });
});

// Topology canvas animation (kept subtle)
const canvas = document.getElementById('topology-canvas')
if (canvas) {
  const ctx = canvas.getContext('2d')

  let width = window.innerWidth
  let height = window.innerHeight

  canvas.width = width
  canvas.height = height

  window.addEventListener('resize', () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
    initNodes()
  })

  const nodes = []
  const nodeCount = 40 
  const connectionDistance = 250

  class Node {
    constructor() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.vx = (Math.random() - 0.5) * 0.15
      this.vy = (Math.random() - 0.5) * 0.15
      this.radius = Math.random() * 1.5 + 0.5
    }

    update() {
      this.x += this.vx
      this.y += this.vy

      if (this.x < 0 || this.x > width) this.vx *= -1
      if (this.y < 0 || this.y > height) this.vy *= -1
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = '#8C8B86'
      ctx.fill()
    }
  }

  function initNodes() {
    nodes.length = 0
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node())
    }
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          const opacity = 1 - (distance / connectionDistance)
          ctx.strokeStyle = `rgba(140, 139, 134, ${opacity * 0.2})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height)

    for (const node of nodes) {
      node.update()
      node.draw()
    }
    
    drawConnections()

    requestAnimationFrame(animate)
  }

  initNodes()
  animate()
}

// Contact form -> Web3Forms relay (anas@djet.online / ansgrb@gmail.com)
const form = document.getElementById('contact-form');
if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const originalText = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    status.textContent = '';
    status.classList.remove('ok', 'error');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        status.textContent = '// Message transmitted. We will respond.';
        status.classList.add('ok');
        form.reset();
      } else {
        status.textContent = '// Error: ' + (data.message || 'Submission failed.');
        status.classList.add('error');
      }
    } catch (error) {
      status.textContent = '// Error: network unreachable. Try again.';
      status.classList.add('error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
