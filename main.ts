import {
  SKEvent,
  startSimpleKit,
  setSKDrawCallback,
  setSKAnimationCallback,
  setSKEventListener,
  SKMouseEvent,
  skTime,
} from "simplekit/canvas-mode";

// local
import { Circle } from "./circle";
import { BasicTimer, CallbackTimer } from "./timer";

startSimpleKit();

let numTargets = 6;
let targets = new Array<Circle>(numTargets);
let targetRadius = 30;
let currentTarget = 1;
let fastestTime = -1;
const maxRadius = 45;
const minRadius = 15;
let timeText = "";
let currTime = -1;
let bgColour = "black";
let hovering: boolean[] = [false, false, false, false, false, false, false, false];
let clicking: boolean[] = [false, false, false, false, false, false, false, false];
let clicked: boolean[] = [false, false, false, false, false, false, false, false];
enum State {
  Start,
  Play,
  End
 }
 let gameState: State = State.Start;
 

 // mouse position
let mx = 0;
let my = 0;

// event handler with switch statement dispatch
function handleEvent(e: SKEvent) {
  switch (e.type) {
    case "mousemove":
      ({ x: mx, y: my } = e as SKMouseEvent);
      targets.forEach((s) => {
        if (s instanceof Circle) {
          if (gameState != State.End) {
            if (s.hitTest(mx, my)) {
              hovering[s.id-1] = true;            
            } else {
              hovering[s.id-1] = false;
            }
          }
        }
      });
      break;
    case "click":
      ({ x: mx, y: my } = e as SKMouseEvent);
      targets.forEach((s) => {
        if (s instanceof Circle) {
          if (s.hitTest(mx, my)) {
            if (s.id == currentTarget) {
              gameState = State.Play;
              clicked[s.id-1] = true;
              if (currentTarget < numTargets){
                currentTarget = currentTarget < numTargets ? currentTarget + 1 : 1;
              } else {
                currentTarget += 1;
                currTime = (skTime/1000);
                if (fastestTime = -1 || currTime < fastestTime){
                  fastestTime = currTime;
                }
                
                gameState = State.End;
              }
            }             
          }
        }
      });
      break;
    case "mousedown":
      let targetClicked = false;
      ({ x: mx, y: my } = e as SKMouseEvent);
      targets.forEach((s) => {
        if (s instanceof Circle) {
          if (gameState != State.End){
            if (s.hitTest(mx, my)) {
              targetClicked = true;
              clicking[s.id-1] = true;
              if (currentTarget != s.id){
                bgColour = "darkred";
              }
            } 
          }
          
        }
      });
      if (gameState != State.End && !targetClicked) {
        bgColour = "darkred";
      }
      break;
    case "mouseup":
      for (let i = 0; i < numTargets; i++){
        clicking[i] = false;
      }
      bgColour = "black";
      break;
    case "keydown":
      {
        const { key } = e as KeyboardEvent;
        switch (key) {
          case " ":
            if (gameState == State.Start){
              randomizeCircles();
            } else if (gameState == State.End){
              gameState = State.Start;
              hovering = [false, false, false, false, false, false, false, false];
              clicking= [false, false, false, false, false, false, false, false];
              clicked = [false, false, false, false, false, false, false, false];
              currentTarget = 1;
            }
            break;
          case "]":
            if (gameState == State.Start){
              numTargets = numTargets != 8 ? numTargets + 1: numTargets;
            }
            break;
          case "[":
            /*if (gameState == State.Start){
              numTargets = numTargets != 3 ? numTargets - 1: numTargets;
            }*/
            break;
          case "}":
            if (gameState == State.Start){
              targetRadius = targetRadius != maxRadius ? targetRadius + 5: targetRadius;
            }            
            break;
          case "{":
            if (gameState == State.Start){
              targetRadius = targetRadius != minRadius ? targetRadius - 5: targetRadius;
            }            
            break;
          case "c":
            clicked[currentTarget - 1] = true;
            if (gameState == State.Start){
              
              currentTarget += 1;
              gameState = State.Play;
            } else if (gameState == State.Play) {
              console.log(currentTarget);
              if (currentTarget < numTargets){
                currentTarget += 1;
                
              } else {
                currentTarget += 1;
                currTime = (skTime/1000);
                if (fastestTime = -1 || currTime < fastestTime){
                  fastestTime = currTime;
                }
                gameState = State.End;
              }
              
            }
        }
      }
      break;
  }
}

// set the event handler
setSKEventListener(handleEvent);

let circleOrder: number [] = [1, 2, 3, 4, 5, 6, 7, 8];
//let circleOrder: number [] = startCircleOrder.slice(0, numTargets);
for (let i = 0; i < circleOrder.length; i++){
 console.log(circleOrder[i]);
}
function randomizeCircles(){
 let currentIndex = numTargets;
 while (currentIndex != 0) {
   let randomIndex = Math.floor(Math.random() * currentIndex);
   currentIndex--;
   [circleOrder[currentIndex], circleOrder[randomIndex]] = [
     circleOrder[randomIndex], circleOrder[currentIndex]];
 }

}
randomizeCircles();

setSKDrawCallback((gc) => {
  gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);

  drawBackground(gc);
  if (gameState == State.Start){
    drawTitle(gc);
  } else if (gameState == State.Play){
    drawPlayTitle(gc);
  } else  /*gameState == State.End*/{
    drawEndTitle(gc);
  }
  
  drawCircles(gc);
  
 });

 
 function drawBackground(gc: CanvasRenderingContext2D){
  gc.save();
  gc.fillStyle = bgColour;
  gc.beginPath();
  gc.rect(0, 0, gc.canvas.width, gc.canvas.height);
  gc.fill();
  gc.restore();
 }
 function drawTitle(gc: CanvasRenderingContext2D) {
  gc.save();
  gc.beginPath();
  gc.lineWidth = 2;
  gc.fillStyle="white";
  gc.strokeStyle="white";
  gc.font = "24px sans-serif";
  gc.textAlign= "center";
  gc.textBaseline = "bottom";
  gc.fillText("click target 1 to begin", gc.canvas.width/2,37);
  gc.moveTo(0,50);
  gc.lineTo(gc.canvas.width, 50);
  gc.stroke();
  gc.restore();
}

function drawPlayTitle(gc: CanvasRenderingContext2D){
  const timer = new CallbackTimer(0, (t) => {
    t = 0;
    
  });
  
  // start timer
  // (skTime is time in ms since SimpleKit started)
  //timer.start(skTime);

  // the animation callback
  //setSKAnimationCallback((time) => {
    timer.update(0);
    timeText = `${(skTime / 1000).toFixed(2)}`;
 
    if (gameState == State.Play){
     
      gc.save();
      gc.fillStyle = "black";
      gc.beginPath();
      gc.rect(0, 0, gc.canvas.width, 50);
      gc.fill();
      gc.beginPath();
      gc.lineWidth = 2;
      gc.fillStyle="white";
      gc.strokeStyle="white";
      gc.font = "24px sans-serif";
      gc.textAlign= "center";
      gc.textBaseline = "bottom";
      gc.fillText(timeText, gc.canvas.width/2,37);
      gc.moveTo(0,50);
      gc.lineTo(gc.canvas.width, 50);
      gc.stroke();
      gc.restore();
    } 
}

function drawEndTitle(gc: CanvasRenderingContext2D){
  gc.save();
  gc.beginPath();
  gc.lineWidth = 2;
  gc.fillStyle="white";
  gc.strokeStyle="white";
  gc.font = "24px sans-serif";
  gc.textAlign= "center";
  gc.textBaseline = "bottom";
  if (currTime == fastestTime){
    gc.fillText(currTime.toFixed(2) + "(new best!)", gc.canvas.width/2,37);
  } else {
    gc.fillText(currTime.toFixed(2) + "(best " + fastestTime.toFixed(2) + ")", gc.canvas.width/2,37);
  }
  
  gc.moveTo(0,50);
  gc.lineTo(gc.canvas.width, 50);
  gc.stroke();
  gc.restore();
}

function drawCircles(gc: CanvasRenderingContext2D){
  // subtract 30px to account for not wanting to be 15px from edge
  let width = gc.canvas.width - 30 - targetRadius;
  // subtract 50px to account for the title text region
  // subtract 30px to account for not wanting to be 15px from edge
  let height = gc.canvas.height - 50 - 30 - targetRadius;
  let rad = width > height ? height/2 : width/2;

  //center of the remaining space
  let centerX = width/2 + 15 + targetRadius/2;
  let centerY = height/2 + 50 + 15 + targetRadius/2;

  const angleStep = (2 * Math.PI) / numTargets;
  // stores the target location of each circle in order from 1, 2, 3, 4, etc.
  const targetLoc: number[][] = []
  for (let i = 0; i < numTargets; i++) {
    const angle = i * angleStep;
    const circleX = centerX + (rad - targetRadius/2) * Math.cos(angle);
    const circleY = centerY + (rad - targetRadius/2) * Math.sin(angle);

    targetLoc[circleOrder[i] - 1] = [circleX, circleY];
  }
  //draw the lines first and then the circles on top
  for (let i = 0; i < numTargets; i++) {
    const angle = i * angleStep;
    const circleX = centerX + (rad - targetRadius/2) * Math.cos(angle);
    const circleY = centerY + (rad - targetRadius/2) * Math.sin(angle);
    
    const prevTargetx = circleOrder[i] != 1 ? targetLoc[circleOrder[i] - 2][0]: targetLoc[circleOrder[i] - 1][0];
    const prevTargety = circleOrder[i] != 1 ? targetLoc[circleOrder[i] - 2][1]: targetLoc[circleOrder[i] - 1][1];
    targets[i] = new Circle(circleX, circleY, targetRadius, 0, 2 * Math.PI, 
      circleOrder[i], currentTarget, prevTargetx, prevTargety, 
      hovering[circleOrder[i] - 1], clicking[circleOrder[i] - 1], clicked[circleOrder[i] - 1]);
    targets[i].drawLines(gc);
  }
  for (let i = 0; i < numTargets; i++) {
    targets[i].draw(gc);    
  }
}