function calculateCosts() {
    const houseCost = parseFloat(document.getElementById("houseCost").value) || 0;
    const chefCost = parseFloat(document.getElementById("chefCost").value) || 0;
    const transportCost = parseFloat(document.getElementById("transportCost").value) || 0;
    const activityCost = parseFloat(document.getElementById("activityCost").value) || 0;

    const resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = ""; // Clear existing results

    for (let groupSize = 8; groupSize <= 26; groupSize++) {
        const housePerPerson = houseCost / groupSize;
        const chefPerPerson = chefCost / groupSize;
        const transportPerPerson = transportCost / groupSize;
        const totalPerPerson = housePerPerson + chefPerPerson + transportPerPerson + activityCost;
        const totalGroupCost = totalPerPerson * groupSize;

        const row = `
            <tr>
                <td>${groupSize}</td>
                <td>${housePerPerson.toFixed(2)}</td>
                <td>${chefPerPerson.toFixed(2)}</td>
                <td>${transportPerPerson.toFixed(2)}</td>
                <td>${activityCost.toFixed(2)}</td>
                <td>${totalPerPerson.toFixed(2)}</td>
                <td>${totalGroupCost.toFixed(2)}</td>
            </tr>
        `;
        resultsTable.innerHTML += row;
    }
}
// Set default values when the page loads
window.addEventListener('load', function() {
    document.getElementById('houseCost').value = 12000;
    document.getElementById('chefCost').value = 5000;
    document.getElementById('transportCost').value = 500;
    document.getElementById('activityCost').value = 300;
    
    // Optionally trigger the calculation immediately
    calculateCosts();
});
// Add these functions to your scripts.js file

function updateSliderDisplay(value) {
    document.getElementById('currentSize').textContent = value;
    calculateSliderCosts(value);
}

function calculateSliderCosts(groupSize) {
    // Get the input values
    const houseCost = parseFloat(document.getElementById('houseCost').value) || 0;
    const chefCost = parseFloat(document.getElementById('chefCost').value) || 0;
    const transportCost = parseFloat(document.getElementById('transportCost').value) || 0;
    const activityCost = parseFloat(document.getElementById('activityCost').value) || 0;

    // Calculate per person costs
    const sharedCostsPerPerson = (houseCost + chefCost + transportCost) / groupSize;
    const totalPerPerson = sharedCostsPerPerson + activityCost;
    const totalGroupCost = totalPerPerson * groupSize;

    // Format and display the costs
    document.getElementById('perPersonCost').textContent = 
        `$${totalPerPerson.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalGroupCost').textContent = 
        `$${totalGroupCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Add this to your window.onload or existing event listener
document.getElementById('groupSizeSlider').addEventListener('input', function() {
    updateSliderDisplay(this.value);
});

// Calculate initial values
window.addEventListener('load', function() {
    // Initial calculation with default group size
    updateSliderDisplay(document.getElementById('groupSizeSlider').value);
    
    // Add input event listeners to recalculate when costs change
    const inputs = ['houseCost', 'chefCost', 'transportCost', 'activityCost'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            updateSliderDisplay(document.getElementById('groupSizeSlider').value);
        });
    });
});