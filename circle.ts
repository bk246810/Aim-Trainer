export class Circle{
    fill: string = "darkgrey";
    stroke: string = "darkgrey";
    clickedFill: string[] = [
        "red", "orange", "yellow", "green", "cyan", "blue", "violet", "pink"
    ];
    constructor(
        public x: number,
        public y: number,
        public rad: number,
        public startAng: number,
        public endAng: number,
        public id: number,
        public currTarget: number,
        public prevTargetx: number,
        public prevTargety: number,
        public isHover: boolean,
        public isClick: boolean,
        public isClicked: boolean,
      ) {}
      drawLines(gc: CanvasRenderingContext2D){
        gc.save();
        if (this.isClicked){
            gc.strokeStyle = this.clickedFill[this.id - 2];
            gc.lineWidth = 6;
    
            if (this.id != 1){
                gc.beginPath();
                gc.moveTo(this.x, this.y);
                gc.lineTo(this.prevTargetx, this.prevTargety);
                gc.closePath();
                gc.stroke();
            }
        }
        
        gc.restore();
      }
      draw(gc: CanvasRenderingContext2D) {
        gc.save();
        if (this.isClick && this.currTarget != this.id){
            gc.fillStyle = "red";
        } else if (this.currTarget == this.id){
            gc.fillStyle = "white";
        } else if (this.currTarget > this.id){
            gc.fillStyle = this.clickedFill[this.id - 1];
        } else {
            gc.fillStyle = this.fill;
        }
        if (this.isClick && this.currTarget != this.id){
            gc.strokeStyle = "red";
        } else if (this.isHover){
            gc.strokeStyle = "lightblue";
        } else if (this.currTarget == this.id){
            gc.strokeStyle = "white";
        } else if (this.currTarget > this.id){
            gc.strokeStyle = this.clickedFill[this.id - 1];
        } else {
            gc.strokeStyle = this.fill;
        }
        gc.lineWidth = 3;        

        gc.beginPath();
        gc.arc(this.x, this.y, this.rad, this.startAng, this.endAng);
        gc.fill();
        gc.closePath();
        gc.stroke();
        
        // Draw id at the center of each circle
        gc.fillStyle = "black";
        gc.font = "20px sans-serif";
        gc.textAlign = "center";
        gc.textBaseline = "middle";
        gc.fillText((this.id).toString(), this.x, this.y);
        gc.restore();
      }
      hitTest(mx: number, my: number) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.rad;
      }
      
}