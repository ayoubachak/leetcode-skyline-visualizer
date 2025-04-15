/**
 * Canvas renderer for skyline visualization
 */

class SkylineRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    
    /**
     * Draw the skyline visualization
     * @param {Array} buildings - Array of buildings in format [left, right, height]
     * @param {Array} skyline - Array of skyline points in format [x, height]
     */
    draw(buildings, skyline) {
        const { canvas, ctx } = this;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let maxX = 0;
        let maxHeight = 0;
        
        buildings.forEach(([left, right, height]) => {
            maxX = Math.max(maxX, right);
            maxHeight = Math.max(maxHeight, height);
        });
        
        maxX += 2;
        maxHeight += 2;
        
        const padding = 40;
        const xScale = (canvas.width - padding * 2) / maxX;
        const yScale = (canvas.height - padding * 2) / maxHeight;
        const originX = padding;
        const originY = canvas.height - padding;
        
        this._drawGrid(originX, originY, maxX, maxHeight, xScale, yScale);
        this._drawAxes(originX, originY, maxX, maxHeight, xScale, yScale);
        this._drawBuildings(buildings, originX, originY, xScale, yScale);
        this._drawSkyline(skyline, originX, originY, xScale, yScale);
    }
    
    /**
     * Draw the coordinate grid
     */
    _drawGrid(originX, originY, maxX, maxHeight, xScale, yScale) {
        const { ctx, canvas } = this;
        
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= maxX; x += Math.ceil(maxX / 10)) {
            const xPos = originX + x * xScale;
            ctx.beginPath();
            ctx.moveTo(xPos, originY - maxHeight * yScale - 10);
            ctx.lineTo(xPos, originY);
            ctx.stroke();
        }
        
        for (let y = 0; y <= maxHeight; y += Math.ceil(maxHeight / 10)) {
            const yPos = originY - y * yScale;
            ctx.beginPath();
            ctx.moveTo(originX, yPos);
            ctx.lineTo(originX + maxX * xScale + 10, yPos);
            ctx.stroke();
        }
    }
    
    /**
     * Draw the coordinate axes
     */
    _drawAxes(originX, originY, maxX, maxHeight, xScale, yScale) {
        const { ctx } = this;
        
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + maxX * xScale + 20, originY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX, originY - maxHeight * yScale - 20);
        ctx.stroke();
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px system-ui, sans-serif';
        
        for (let x = 0; x <= maxX; x += Math.ceil(maxX / 10)) {
            const xPos = originX + x * xScale;
            ctx.fillText(x.toString(), xPos - 5, originY + 20);
            
            ctx.beginPath();
            ctx.moveTo(xPos, originY);
            ctx.lineTo(xPos, originY + 5);
            ctx.stroke();
        }
        
        for (let y = 0; y <= maxHeight; y += Math.ceil(maxHeight / 10)) {
            const yPos = originY - y * yScale;
            ctx.fillText(y.toString(), originX - 25, yPos + 5);
            
            ctx.beginPath();
            ctx.moveTo(originX - 5, yPos);
            ctx.lineTo(originX, yPos);
            ctx.stroke();
        }
    }
    
    /**
     * Draw the buildings
     */
    _drawBuildings(buildings, originX, originY, xScale, yScale) {
        const { ctx } = this;
        
        buildings.forEach(([left, right, height], index) => {
            const x = originX + left * xScale;
            const y = originY - height * yScale;
            const width = (right - left) * xScale;
            const rectHeight = height * yScale;
            
            const hue = (left * 37 + height * 71) % 360;
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.5)`;
            ctx.strokeStyle = `hsla(${hue}, 70%, 40%, 1)`;
            ctx.lineWidth = 1;
            
            ctx.fillRect(x, y, width, rectHeight);
            ctx.strokeRect(x, y, width, rectHeight);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.font = '14px system-ui, sans-serif';
            ctx.fillText((index + 1).toString(), x + width / 2 - 5, y + rectHeight / 2 + 5);
        });
    }
    
    /**
     * Draw the skyline
     */
    _drawSkyline(skyline, originX, originY, xScale, yScale) {
        const { ctx } = this;
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (skyline.length > 0) {
            const [x0, y0] = skyline[0];
            ctx.moveTo(originX + x0 * xScale, originY - y0 * yScale);
            
            for (let i = 1; i < skyline.length; i++) {
                const [x, y] = skyline[i];
                const [prevX, prevY] = skyline[i-1];
                
                ctx.lineTo(originX + x * xScale, originY - prevY * yScale);
                
                ctx.lineTo(originX + x * xScale, originY - y * yScale);
            }
        }
        
        ctx.stroke();
    }
}