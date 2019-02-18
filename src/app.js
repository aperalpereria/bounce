const objWidth=objHeight=100;
let selectedEntity=0;
let force=10;
let drag=0.05;
let debugMode=false;
let entities=[];

window.onkeyup=(event)=>{
    switch(event.key){
        case 'e':
            selectedEntity++;
            if(selectedEntity>(entities.length-1)){
                selectedEntity=0;
            }
            break;
        case 'd':
            debugMode=!debugMode;
            break;
        case 'ArrowUp':
            force+=1;
            break;
        case 'ArrowDown':
            force-=1;
            break;
        case 'ArrowLeft':
            drag-=0.01;
            break;
        case 'ArrowRight':
            drag+=0.01;
            break;
        default:
            break;
    }
    console.log(event.key);
};
window.onmouseup=(event)=>{
    const entity = entities[selectedEntity];
    if(entity.vx==0 && entity.vy==0){
        const dirX=event.pageX-entity.x;
        const dirY=event.pageY-entity.y;
        const mod = Math.sqrt(dirX**2+dirY**2);
        entity.vx=dirX/mod*10*force;
        entity.vy=dirY/mod*10*force;
    }
};

function init(){
    window.requestAnimationFrame(draw);
    entities.push(createEntity(10,10,'green'));
    entities.push(createEntity(100,100,'red'));
    entities.push(createEntity(200,300,'blue'));
    entities.push(createEntity(5,5,'yellow'));
}

function draw(){
    const canvas=document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);


    //render all entities
    entities.forEach((entity,index)=>{
        ctx.fillStyle = entity.style;
        entity.updatePosition(canvas);
        entities.forEach((otherEntity,otherIndex)=>{
           if(otherIndex>index){
               entity.checkCollision(otherEntity)
           }
        });
        ctx.fillRect(entity.x, entity.y, objWidth, objHeight);
    });

    if(debugMode){
        ctx.font = '20px serif';
        ctx.fillStyle='black';
        ctx.fillText(`Selected entity: ${entities[selectedEntity].name}`,0,20);
        ctx.fillText(`Vx: ${entities[selectedEntity].vx}`,0,40);
        ctx.fillText(`Vy: ${entities[selectedEntity].vy}`,0,60);
        ctx.fillText(`Force: ${force}`,0,80);
        ctx.fillText(`Friction Coef.: ${drag}`,0,100);
    }
    window.requestAnimationFrame(draw);
}

function createEntity(xInit,yInit,color){
    return {
        name: `${color} block`,
        x: xInit,
        y: yInit,
        vx: 0,
        vy :0,
        style: color,
        checkCollision: function(entity){
            const checkPairs = [{x:this.x,y:this.y},{x:this.x+objWidth,y:this.y},{x:this.x,y:this.y+objHeight},{x:this.x+objWidth,y:this.y+objHeight}];
            checkPairs.forEach((pair)=>{
               if(
                   (pair.x>entity.x && pair.x < entity.x+objWidth)&&
                   (pair.y>entity.y && pair.y < entity.y+objHeight)
               ){
                   console.log(`Collision detected between ${this.name}(this) and ${entity.name}`);
                   //reset position (naive)
                   if(this.vx>this.vy){
                       if(this.vx>0){
                           this.x=entity.x-objWidth;
                       }else{
                           this.x=entity.x+objWidth;
                       }
                   }else{
                       if(this.vy>0){
                           this.y=entity.y-objHeight;
                       }else{
                           this.y=entity.y+objHeight;
                       }
                   }
                   /*switch(index){
                       case 0:
                           this.x=entity.x-objWidth;
                           this.y=entity.y-objHeight;
                           break;
                       case 1:
                           this.x=entity.x-objWidth;
                           this.y=entity.y+objHeight;
                           break;
                       case 2:
                           this.x=entity.x+objWidth;
                           this.y=entity.y-objHeight;
                           break;
                       case 3:
                           this.x=entity.x+objWidth;
                           this.y=entity.y+objHeight;
                           break;
                   }*/

                   //same mass, swap velocities
                   let vx=this.vx;
                   let vy=this.vy;
                   this.vx=entity.vx;
                   this.vy=entity.vy;
                   entity.vx=vx;
                   entity.vy=vy;
               }
            });
        },
        updatePosition: function(canvas){
            //apply drag
            this.vx=(1-drag)*this.vx;
            this.vy=(1-drag)*this.vy;

            //full stop condition
            if(Math.abs(this.vx)<0.01){
                this.vx=0;
            }
            if(Math.abs(this.vy)<0.01){
                this.vy=0;
            }

            //update position based on velocity
            this.x=this.x+this.vx;
            this.y=this.y+this.vy;

            //check for canvas walls, bounce if past wall
            if(this.y+objHeight>canvas.height){
                this.y=canvas.height-objHeight;
                this.vy=-this.vy;
            }
            if(this.y<0){
                this.y=0;
                this.vy=-this.vy;
            }
            if(this.x<0){
                this.x=0;
                this.vx=-this.vx;
            }
            if(this.x+objWidth>canvas.width){
                this.x=canvas.width-objWidth;
                this.vx=-this.vx;
            }
        }
    }
}

init();

