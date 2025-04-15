/**
 * Skyline algorithm implementation
 * 
 * This file contains the logic for computing the skyline from an array of buildings
 */

/**
 * Compute the skyline from an array of buildings
 * @param {Array} buildings - Array of buildings in format [left, right, height]
 * @returns {Array} Skyline key points in format [x, height]
 */
function getSkyline(buildings) {
    if (buildings.length === 0) return [];
    
    const events = [];
    
    for (const [left, right, height] of buildings) {
        events.push({ x: left, height, type: 'start' });
        events.push({ x: right, height, type: 'end' });
    }
    
    events.sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        
        if (a.type === 'start' && b.type === 'end') return -1;
        if (a.type === 'end' && b.type === 'start') return 1;
        
        if (a.type === 'start') return b.height - a.height;
        return a.height - b.height;
    });
    
    const result = [];
    const heights = new Map();
    let prevMaxHeight = 0;
    
    for (const event of events) {
        if (event.type === 'start') {
            heights.set(event.height, (heights.get(event.height) || 0) + 1);
        } else {
            heights.set(event.height, heights.get(event.height) - 1);
            if (heights.get(event.height) === 0) {
                heights.delete(event.height);
            }
        }
        
        let currMaxHeight = 0;
        for (const [height, count] of heights.entries()) {
            if (count > 0) {
                currMaxHeight = Math.max(currMaxHeight, height);
            }
        }
        
        if (currMaxHeight !== prevMaxHeight) {
            result.push([event.x, currMaxHeight]);
            prevMaxHeight = currMaxHeight;
        }
    }
    
    return result;
}