function n(e) {
    this.init(e || {});
}

n.prototype = {
    init: function (e) {
        this.phase = e.phase || 0;
        this.offset = e.offset || 0;
        this.frequency = e.frequency || 0.001;
        this.amplitude = e.amplitude || 1;
        this._value = 0;
    },
    update: function () {
        this.phase += this.frequency;
        this._value = this.offset + Math.sin(this.phase) * this.amplitude;
        return this._value;
    },
    value: function () {
        return this._value;
    },
};

function Line(e) {
    this.init(e || {});
}

Line.prototype = {
    init: function (e) {
        this.spring = e.spring + 0.1 * Math.random() - 0.02;
        this.friction = E.friction + 0.01 * Math.random() - 0.002;
        this.nodes = [];
        for (var t, n = 0; n < E.size; n++) {
            t = new Node();
            t.x = pos.x;
            t.y = pos.y;
            this.nodes.push(t);
        }
    },
    update: function () {
        var e = this.spring,
            t = this.nodes[0];
        t.vx += (pos.x - t.x) * e;
        t.vy += (pos.y - t.y) * e;
        for (var n, i = 0, a = this.nodes.length; i < a; i++)
            (t = this.nodes[i]),
            0 < i &&
            ((n = this.nodes[i - 1]),
                (t.vx += (n.x - t.x) * e),
                (t.vy += (n.y - t.y) * e),
                (t.vx += n.vx * E.dampening),
                (t.vy += n.vy * E.dampening)),
            (t.vx *= this.friction),
            (t.vy *= this.friction),
            (t.x += t.vx),
            (t.y += t.vy),
            (e *= E.tension);
    },
    draw: function () {
        var e,
            t,
            n = this.nodes[0].x,
            i = this.nodes[0].y;
        ctx.beginPath();
        ctx.moveTo(n, i);
        for (var a = 1, o = this.nodes.length - 2; a < o; a++) {
            e = this.nodes[a];
            t = this.nodes[a + 1];
            n = 0.5 * (e.x + t.x);
            i = 0.5 * (e.y + t.y);
            ctx.quadraticCurveTo(e.x, e.y, n, i);
        }
        e = this.nodes[a];
        t = this.nodes[a + 1];
        ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
        ctx.stroke();
        ctx.closePath();
    },
};

function onMousemove(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
    
    function o() {
        lines = [];
        for (var e = 0; e < E.trails; e++)
            lines.push(new Line({ spring: 0.4 + (e / E.trails) * 0.025 }));
    }

    function c(e) {
        e.touches
            ? ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY))
            : ((pos.x = e.clientX), (pos.y = e.clientY)),
            e.preventDefault();
    }

    function l(e) {
        1 == e.touches.length &&
        ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY));
    }

    document.removeEventListener('mousemove', onMousemove),
    document.removeEventListener('touchstart', onMousemove),
    document.addEventListener('mousemove', c),
    document.addEventListener('touchmove', c, { passive: false }),
    document.addEventListener('touchstart', l, { passive: false }),
    c(e),
    o(),
    render();
}

function render() {
    if (ctx.running) {
        ctx.globalCompositeOperation = 'screen';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ', 100%, 50%, 0.8)';
        ctx.lineWidth = 1.5;
        
        for (var e, t = 0; t < E.trails; t++) {
            (e = lines[t]).update();
            e.draw();
        }
        
        ctx.frame++;
        window.requestAnimationFrame(render);
    }
}

function getOptimalSettings() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelCount = width * height;
    
    // Base settings for 960 x 540
    const basePixels = 960 * 540;
    const pixelRatio = pixelCount / basePixels;
    
    let settings = {
        trails: 20,
        size: 50
    };
    
    // Reduce trails for larger screens to improve performance
    if (pixelRatio > 2) { // Much larger than 1080p (like 4K)
        settings.trails = 8;
        settings.size = 25;
    } else if (pixelRatio > 1.5) { // Larger than 1080p
        settings.trails = 12;
        settings.size = 35;
    } else if (pixelRatio > 1.2) {
        settings.trails = 16;
        settings.size = 45;
    }
    
    return settings;
}

function resizeCanvas() {
    const optimalSettings = getOptimalSettings();
    
    // Update configuration
    E.trails = optimalSettings.trails;
    E.size = optimalSettings.size;
    
    // Set canvas size to match window size
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    
    // Reinitialize lines with new settings if they exist
    if (lines.length > 0) {
        lines = [];
        for (let i = 0; i < E.trails; i++) {
            lines.push(new Line({ spring: 0.4 + (i / E.trails) * 0.025 }));
        }
    }
}

var ctx,
    f,
    e = 0,
    pos = {},
    lines = [],
    E = {
        friction: 0.5,
        trails: 20,
        size: 50,
        dampening: 0.25,
        tension: 0.98
    };

function Node() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
}

window.onload = function () {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    ctx.running = true;
    ctx.frame = 1;

    f = new n({
        phase: Math.random() * 2 * Math.PI,
        amplitude: 85,
        frequency: 0.0015,
        offset: 285,
    });

    // Set initial position to center
    pos.x = window.innerWidth / 2;
    pos.y = window.innerHeight / 2;

    // Initialize with optimal settings
    resizeCanvas();

    // Initialize lines
    lines = [];
    for (let i = 0; i < E.trails; i++) {
        lines.push(new Line({ spring: 0.4 + (i / E.trails) * 0.025 }));
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('touchstart', onMousemove, { passive: false });
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('focus', () => {
        if (!ctx.running) {
            ctx.running = true;
            render();
        }
    });
    
    window.addEventListener('blur', () => {
        ctx.running = false;
    });

    render();
};