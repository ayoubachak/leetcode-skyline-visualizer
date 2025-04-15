/**
 * Utility functions for the Skyline Visualization app
 */

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active', 'border-blue-500', 'text-blue-600'));
            tabButtons.forEach(btn => btn.classList.add('text-gray-500'));
            tabContents.forEach(content => content.classList.add('hidden'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active', 'border-blue-500', 'text-blue-600');
            button.classList.remove('text-gray-500');
            
            const tabId = button.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            tabContent.classList.remove('hidden');
            tabContent.classList.add('active');
        });
    });
}

function setupCanvas() {
    const canvas = document.getElementById('skyline-canvas');
    
    function resizeCanvas() {
        const container = document.querySelector('.canvas-container');
        const containerWidth = container.clientWidth;
        
        if (containerWidth < 1000) {
            const aspectRatio = canvas.height / canvas.width;
            canvas.style.width = (containerWidth - 20) + 'px';
            canvas.style.height = ((containerWidth - 20) * aspectRatio) + 'px';
        } else {
            canvas.style.width = '';
            canvas.style.height = '';
        }
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return { canvas, resizeCanvas };
}

function parseBuildingsInput(input) {
    try {
        const buildings = JSON.parse(input);
        
        if (!Array.isArray(buildings)) {
            throw new Error('Input must be an array');
        }
        
        buildings.forEach(building => {
            if (!Array.isArray(building) || building.length !== 3) {
                throw new Error('Each building must be an array with 3 elements [left, right, height]');
            }
            
            const [left, right, height] = building;
            
            if (typeof left !== 'number' || typeof right !== 'number' || typeof height !== 'number') {
                throw new Error('Building coordinates and height must be numbers');
            }
            
            if (left >= right) {
                throw new Error('Left position must be less than right position');
            }
            
            if (height <= 0) {
                throw new Error('Height must be greater than 0');
            }
        });
        
        return buildings;
    } catch (error) {
        throw new Error(`Invalid input format: ${error.message}`);
    }
}