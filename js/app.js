/**
 * Main application logic for Skyline Visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    const { canvas } = setupCanvas();
    
    const visualizeBtn = document.getElementById('visualize-btn');
    const clearBtn = document.getElementById('clear-btn');
    const skylineResult = document.getElementById('skyline-result');
    const buildingsInput = document.getElementById('buildings-input');
    
    const leftInput = document.getElementById('left-input');
    const rightInput = document.getElementById('right-input');
    const heightInput = document.getElementById('height-input');
    const addBuildingBtn = document.getElementById('add-building-btn');
    const buildingsListContainer = document.getElementById('buildings-list-container');
    const visualizeManualBtn = document.getElementById('visualize-manual-btn');
    const clearManualBtn = document.getElementById('clear-manual-btn');
    
    const renderer = new SkylineRenderer(canvas);
    
    let manualBuildings = [];
    
    visualizeBtn.addEventListener('click', () => {
        try {
            const input = buildingsInput.value.trim();
            const buildings = parseBuildingsInput(input);
            const skyline = getSkyline(buildings);
            
            renderer.draw(buildings, skyline);
            skylineResult.textContent = JSON.stringify(skyline);
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error(error);
        }
    });
    
    clearBtn.addEventListener('click', () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        skylineResult.textContent = '';
    });
    
    addBuildingBtn.addEventListener('click', () => {
        const left = parseInt(leftInput.value);
        const right = parseInt(rightInput.value);
        const height = parseInt(heightInput.value);
        
        if (isNaN(left) || isNaN(right) || isNaN(height)) {
            alert('Please enter valid numbers for all fields');
            return;
        }
        
        if (left >= right) {
            alert('Left position must be less than right position');
            return;
        }
        
        if (height <= 0) {
            alert('Height must be greater than 0');
            return;
        }
        
        manualBuildings.push([left, right, height]);
        updateBuildingsList();
        
        leftInput.value = '';
        rightInput.value = '';
        heightInput.value = '';
    });
    
    visualizeManualBtn.addEventListener('click', () => {
        if (manualBuildings.length === 0) {
            alert('Please add at least one building');
            return;
        }
        
        const skyline = getSkyline(manualBuildings);
        renderer.draw(manualBuildings, skyline);
        skylineResult.textContent = JSON.stringify(skyline);
    });
    
    clearManualBtn.addEventListener('click', () => {
        manualBuildings = [];
        updateBuildingsList();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        skylineResult.textContent = '';
    });
    
    function updateBuildingsList() {
        buildingsListContainer.innerHTML = '';
        
        if (manualBuildings.length === 0) {
            buildingsListContainer.innerHTML = '<p class="p-3 text-gray-500">No buildings added yet</p>';
            return;
        }
        
        const list = document.createElement('ul');
        list.className = 'divide-y divide-gray-200';
        
        manualBuildings.forEach((building, index) => {
            const item = document.createElement('li');
            item.className = 'buildings-list-item p-3 flex justify-between items-center';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = `Building ${index + 1}: [${building[0]}, ${building[1]}, ${building[2]}]`;
            item.appendChild(textSpan);
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded';
            
            removeBtn.addEventListener('click', () => {
                manualBuildings.splice(index, 1);
                updateBuildingsList();
            });
            
            item.appendChild(removeBtn);
            list.appendChild(item);
        });
        
        buildingsListContainer.appendChild(list);
    }
    
    updateBuildingsList();
    
    visualizeBtn.click();
});