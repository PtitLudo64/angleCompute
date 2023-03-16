const canvas = document.querySelector('#canvasInfo #canvas1');
const ctx = canvas.getContext('2d');
const divInput = document.querySelector('#nbDiv');
const info = document.querySelector('#canvasInfo #info');

ctx.fillStyle = '#fff';

canvas.width = 1000;
canvas.height = 740;

const centerX = canvas.width * 0.5;
const centerY = canvas.height * 0.5;

class seg {
    constructor() {
        this.startPlot;
        this.endPlot;
        this.coul;
    }
}

let segmentsArray = [];     //Array of segments (start & end angle coords in 2PI circle and color)
let segmentsLimits = [];    //Array of segments (start & end angle coords in PI half circle)
let mouse = {};             //Mouse object for x and y coords
let dx, dy, angle;

//Add between function to Number Object
Number.prototype.between = function (lower, upper) {
    return lower < this && this < upper;
};

//Helpers functions
const arePositives = (item1, item2) => {
    return (item1 >= 0 && item2 >= 0);
}
const areNegatives = (item1, item2) => {
    return (item1 <= 0 && item2 <= 0);
}

divInput.addEventListener('change', () => {
    divComputing(divInput.value);
});

const segmentInfo = () => {
    segmentsLimits = [];
    info.innerHTML = '<h2>Segments</h2>';
    segmentsArray.forEach(segment => {
        let truc;
        // Segment Start 
        const pointStartX = Math.cos(segment.startPlot);
        const pointStartY = Math.sin(segment.startPlot);
        let startAngle = Math.trunc(Math.atan2(pointStartY, pointStartX) * 100) / 100;
        // Segment End
        const pointEndX = Math.cos(segment.endPlot);
        const pointEndY = Math.sin(segment.endPlot);
        let endAngle = Math.trunc(Math.atan2(pointEndY, pointEndX) * 100) / 100;
        if (startAngle >= 0 && endAngle == -3.14)
            endAngle *= -1;
        // Info Box
        info.innerHTML += '<div class="infoLine"><div class="pastille" style="background-color: ' + segment.coul + '"></div><p>start at ' + Math.trunc(startAngle * 100) / 100 + ", end at " + Math.trunc(endAngle * 100) / 100 + " rad</p></div>";
        // store Segment in segmentsLimits array
        if (!arePositives(startAngle, endAngle) && !areNegatives(startAngle, endAngle)) {
            // console.log(segmentsArray.indexOf(segment), 'Segment PAS dans la même tranche', startAngle, endAngle);
            truc = {
                id: segmentsArray.indexOf(segment),
                start: startAngle,
                end: startAngle > 0 ? 3.14 : 0
            }
            segmentsLimits.push(truc);
            truc = {
                id: segmentsArray.indexOf(segment),
                start: endAngle > 0 ? 0 : -3.14,
                end: endAngle
            }
            segmentsLimits.push(truc);
        } else {
            truc = {
                id: segmentsArray.indexOf(segment),
                start: startAngle,
                end: endAngle
            }
            segmentsLimits.push(truc);
        }
    });
};

const divComputing = (nb) => {
    console.clear();
    if (nb != segmentsArray.length) {
        segmentsArray = [];

        let segment = new seg;
        const angleDeg = 360 / nb;
        const angleRad = Math.PI * 2 / nb;
        segment = {
            startPlot: Math.PI * 0.5 - (angleRad * 0.5),
            endPlot: Math.PI * 0.5 + (angleRad * 0.5),
            coul: "hsl(" + nb * angleDeg + ", 100%, 50%)"
        };
        segmentsArray.push(segment);
        for (let i = 0; i < nb - 1; i++) {
            const start = segmentsArray[segmentsArray.length - 1].endPlot + 0.0001;
            let segment = new seg;
            segment.startPlot = start;
            segment.endPlot = segment.startPlot + angleRad;
            segment.coul = "hsl(" + (i + 1) * angleDeg + ", 100%, 50%)";
            segmentsArray.push(segment);
        }
        segmentInfo();
    }
};

const drawFrames = (context) => {
    segmentsArray.forEach(seg => {
        let pointX = centerX + (Math.cos(seg.startPlot) * 350);
        let pointY = centerY + (Math.sin(seg.startPlot) * 350);
        plotAdot(ctx, pointX, pointY);
        pointX = centerX + (Math.cos(seg.endPlot) * 350);
        pointY = centerY + (Math.sin(seg.endPlot) * 350);
        plotAdot(ctx, pointX, pointY);
        drawFrameArc(context, centerX, centerY, seg.startPlot, seg.endPlot, seg.coul);
    })
}

const drawFrameArc = (context, cx, cy, as, ae, clr) => {
    context.beginPath();
    context.arc(cx, cy, 350, as, ae, false);
    context.strokeStyle = clr;
    context.lineWidth = 2;
    context.stroke();
    context.lineWidth = 1;
};

const checkSegment = (mouseAngle) => {
    if (segmentsLimits.length > 0) {
        let isIncluded = false;
        segmentsLimits.forEach(pieceOfPie => {
            isIncluded = mouseAngle.between(pieceOfPie.start, pieceOfPie.end);
            if (isIncluded)
                console.log('PieceOfPie : ', pieceOfPie.id);
        });

    }
}

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    checkSegment(angle);
});

const plotAdot = (context, cX, cY) => {
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(cX, cY, 2, 0, Math.PI * 2);
    context.fill();
}

const drawCentrer = (context) => {
    plotAdot(context, centerX, centerY);
};

const drawText = (context, text, x, y) => {
    context.font = '24px serif';
    context.fillStyle = '#fff';
    context.fillText(text, x, y);
};

const drawAbscisse = (context) => {
    context.strokeStyle = "#0f0";
    context.beginPath();
    context.moveTo(centerX + 100, centerY);
    context.lineTo(centerX + 300, centerY);
    context.stroke();
    context.strokeStyle = "#0f0";
    context.beginPath();
    context.moveTo(centerX - 100, centerY);
    context.lineTo(centerX - 300, centerY);
    context.stroke();
};

const drawMouseAngle = (context, angle) => {
    let startAngle, endAngle;
    startAngle = 0;
    endAngle = angle;
    context.strokeStyle = "#f80";
    context.beginPath();
    context.arc(centerX, centerY, 100, startAngle, endAngle);
    context.stroke();
};

const drawBlueLine = (context, ptX, ptY) => {
    context.strokeStyle = "#00f";
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(ptX, ptY);
    context.stroke();
}

const drawLineFromAngle = (context, ptX, ptY) => {
    drawText(context, 'Point X : ', 5, 90);
    drawText(context, Math.floor(ptX * 100) / 100, 100, 90);
    drawText(context, 'Point Y : ', 5, 120);
    drawText(context, Math.floor(ptY * 100) / 100, 100, 120);

    drawBlueLine(context, ptX, ptY);
}

// mouse position

function calculAngle(context) {
    dx = mouse.x - centerX;
    dy = mouse.y - centerY;
    angle = Math.atan2(dy, dx);
    drawText(context, 'DX : ', 5, 30);
    drawText(context, dx, 70, 30);
    drawText(context, 'DY : ', 150, 30);
    drawText(context, dy, 210, 30);
    drawText(context, 'Angle : ', 5, 60);
    drawText(context, Math.round(angle * 100) / 100 + ' rad, ' + (Math.round((angle * 180 / Math.PI) * 100)) / 100 + '°', 80, 60);

    drawCentrer(context);
    drawAbscisse(context);
    drawMouseAngle(context, angle);

    let pointX = centerX + (Math.cos(angle) * 350);
    let pointY = centerY + (Math.sin(angle) * 350);

    drawLineFromAngle(context, pointX, pointY);

}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    calculAngle(ctx);
    drawFrames(ctx);
    window.requestAnimationFrame(animate);
}

animate();