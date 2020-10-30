let particles1 = [];
let particles2 = [];
let particles3 = [];
let particles4 = [];
let particles5 = [];
let particles6 = [];
let particles7 = [];
let particles8 = [];
let particles9 = [];

let pSystems = [];
let mouseClick = 0;

let music;

let params = {
    shrink: 2,
    rotateSpd1: 0.2,
    rotateSpd2: 0.5,
    rotateSpd3: -0.1,
    rotateSpd4: -0.4
}

const gui = new dat.GUI();

gui.add(params, 'shrink', 1, 5)
gui.add(params, 'rotateSpd1', -1, 1)
gui.add(params, 'rotateSpd2', -1, 1)
gui.add(params, 'rotateSpd3', -1, 1)
gui.add(params, 'rotateSpd4', -1, 1)


// function preload() {
//     soundFormats('mp3', 'ogg');
//     music = loadSound('4n-n.mp3');
//     music.setVolume(0.1);
// }


function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    angleMode(DEGREES);
    rectMode(CENTER);

    pSystems.push(new ParticleSystem(10, 200, 10, 0.1, particles1));
    pSystems.push(new TriSystem(10, 300, 50, params.rotateSpd3, particles3));
    pSystems.push(new ParticleSystem(10, 20, 5, params.rotateSpd1, particles8));
    pSystems.push(new TriSystem(10, 30, 30, params.rotateSpd3, particles4));
    pSystems.push(new RectSystem(10, 50, 200, params.rotateSpd2, particles5));
    pSystems.push(new RectSystem(10, 50, 900, params.rotateSpd3, particles6));
    pSystems.push(new RectSystem(10, 350, 50, params.rotateSpd4, particles7));
    pSystems.push(new LineSystem(10, 350, 500, params.rotateSpd1, particles9));
    pSystems.push(new GlowingSystem(10, 400, 400, params.rotateSpd3, particles2));

    console.log(pSystems);

    for (let i = 0; i < pSystems.length; i++) {
        let ps = pSystems[i];
        ps.generate();
        // pSystems[0].generate()
    }
}

function mouseClicked() {
    if (mouseClick <= 8) {
        mouseClick += 1;
    }
    if (mouseClick == 1) {
        // music.play();
    }
    // console.log(mouseClick);
}

function draw() {
    background(0);

    for (let i = 0; i < mouseClick; i++) {
        let ps = pSystems[i];
        console.log(mouseClick);
        ps.display();
    }
    if (mouseClick == 6) {
        pSystems[4].expand();
    }
    if (mouseClick == 7) {
        pSystems[5].expand();

    }
    if (mouseClick == 9) {
        pSystems[5].shrink();
    }


}

class Particle {
    constructor(angle, rad, m, spd) {
        this.angle = angle;
        this.rad = rad;
        this.mass = m;
        this.spd = spd;
        this.pos = new p5.Vector.fromAngle(radians(this.angle), rad);
        this.vel = new p5.Vector();
        this.acc = new p5.Vector();

    }
    update() {
        this.angle = this.angle + this.spd;
        this.pos = p5.Vector.fromAngle(radians(this.angle), this.rad);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

    }
    display() {
        push();
        translate(this.pos.x, this.pos.y);
        fill(255);
        ellipse(0, 0, this.mass, this.mass);
        // text(this.angle,10,10)
        pop();
    }
}

class Glowing extends Particle {
    constructor(angle, rad, m, spd) {
        super(angle, rad, m, spd);
    }
    display() {
        push();
        // translate(this.pos.x, this.pos.y);
        stroke(255)
            // fill(255)
        noFill();
        strokeWeight(1);
        stroke(102, 186, 183);
        rotate(this.angle)
        line(0, 0, this.mass, this.mass)
        pop();

    }
}

class TriShape extends Particle {
    constructor(angle, rad, m, spd) {
        super(angle, rad, m, spd);

    }
    display() {
        push();
        translate(this.pos.x, this.pos.y);
        stroke(255)
            // fill(255)
        noFill();
        rotate(this.angle)
        triangle(10, 0, -10, 53, -10, -53);
        pop();
    }

}

class RectShape extends Particle {
    constructor(angle, rad, m, spd) {
        super(angle, rad, m, spd);

    }
    expand() {
        this.mass += 1;
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        noFill();
        stroke(255)
        rotate(this.angle)
        rect(0, 0, this.mass, this.mass)
        pop();
    }
}

class LineShape extends Particle {
    constructor(angle, rad, m, spd) {
        super(angle, rad, m, spd);
    }
    display() {
        push();
        // translate(this.pos.x, this.pos.y);
        stroke(255)
        noFill();
        rotate(this.angle)
        line(0, 0, this.mass, this.mass)
        pop();
    }
}


class ParticleSystem {
    constructor(freq, rad, m, spd, array) {
        this.freq = freq;
        this.rad = rad;
        this.mass = m;
        this.spd = spd;
        this.particles = array;
    }
    generate() {
        for (let i = 0; i < 360; i += this.freq) {
            this.particles.push(new Particle(i, this.rad, this.mass, this.spd))
        }
    }
    display() {
        push();
        translate(width / 2, height / 2)
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.update();
            p.display();
        }
        pop();
    }
}

class GlowingSystem extends ParticleSystem {
    generate() {
        for (let i = 0; i < 360; i += this.freq) {
            this.particles.push(new Glowing(i, this.rad, this.mass, this.spd))
        }
    }
}

class TriSystem extends ParticleSystem {
    generate() {
        for (let i = 0; i < 360; i += this.freq) {
            this.particles.push(new TriShape(i, this.rad, this.mass, this.spd))
        }
    }
}

class RectSystem extends ParticleSystem {
    expand() {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.mass += 1;
        }
    }
    shrink() {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.mass -= params.shrink;
        }
    }
    generate() {
        for (let i = 0; i < 360; i += this.freq) {
            this.particles.push(new RectShape(i, this.rad, this.mass, this.spd))
        }
    }
}

class LineSystem extends ParticleSystem {
    generate() {
        for (let i = 0; i < 360; i += this.freq) {
            this.particles.push(new LineShape(i, this.rad, this.mass, this.spd))
        }
    }
}