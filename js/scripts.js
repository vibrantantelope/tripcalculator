const PRICES = {
    accommodation: {
        brisas: 10650,
        fantastica: 14700,
        saltwater: 14700
    },
    mealPlan: {
        basic: 300,
        premium: 375,
        child: 150,
        young: 0
    },
    transportation: {
        airportTransfer: {
            small: 215 * 2, // Round trip
            large: 400 * 2  // Round trip
        },
        vanDay: 400
    },
    activities: {
        rafting: 120,
        zipline: 95,
        catamaran: {
            adult: 85,
            child: 55,
            young: 10
        },
        surf: 90
    },
    extraGuest: 325,
    tax: 0.13
};

function updateCosts() {
    // Get group details
    const adults = parseInt(document.getElementById('adultCount').value) || 0;
    const children = parseInt(document.getElementById('childCount').value) || 0;
    const youngChildren = parseInt(document.getElementById('youngChildCount').value) || 0;
    const totalPeople = adults + children + youngChildren;

    // Calculate accommodation cost
    const accommodation = document.getElementById('accommodation').value;
    let accommodationCost = PRICES.accommodation[accommodation];
    if (totalPeople > 20) {
        accommodationCost += (totalPeople - 20) * PRICES.extraGuest;
    }

    // Calculate meal plan cost
    const mealPlan = document.getElementById('mealPlan').value;
    let mealPlanCost = 0;
    if (mealPlan !== 'none') {
        mealPlanCost = (adults * PRICES.mealPlan[mealPlan]) + 
                       (children * PRICES.mealPlan.child) +
                       (youngChildren * PRICES.mealPlan.young);
    }

    // Calculate transportation cost
    let transportationCost = 0;
    if (document.getElementById('airportTransfer').checked) {
        if (totalPeople <= 5) {
            transportationCost += PRICES.transportation.airportTransfer.small;
        } else if (totalPeople <= 17) {
            transportationCost += PRICES.transportation.airportTransfer.large;
        } else {
            // For 18+ people, need two vehicles
            transportationCost += PRICES.transportation.airportTransfer.large * 2;
        }
    }
    const vanDays = parseInt(document.getElementById('vanDays').value) || 0;
    transportationCost += vanDays * PRICES.transportation.vanDay;

    // Calculate activities cost
    let activitiesCost = 0;
    const activities = ['rafting', 'zipline', 'surf'];
    
    // Regular activities (same price for adults and children)
    activities.forEach(activity => {
        if (document.getElementById(activity).checked) {
            activitiesCost += PRICES.activities[activity] * (adults + children);
        }
    });

    // Catamaran (different prices for adults/children/young)
    if (document.getElementById('catamaran').checked) {
        activitiesCost += (adults * PRICES.activities.catamaran.adult) +
                         (children * PRICES.activities.catamaran.child) +
                         (youngChildren * PRICES.activities.catamaran.young);
    }

    // Calculate tax
    const subtotal = accommodationCost + mealPlanCost + transportationCost + activitiesCost;
    const taxCost = subtotal * PRICES.tax;
    const totalCost = subtotal + taxCost;

    // Calculate per person cost (excluding young children)
    const perPersonCost = adults > 0 ? totalCost / adults : 0;

    // Update display
    updateDisplayValues({
        accommodationCost,
        mealPlanCost,
        transportationCost,
        activitiesCost,
        taxCost,
        totalCost,
        perPersonCost
    });
}

function updateDisplayValues(costs) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    document.getElementById('accommodationCost').textContent = formatter.format(costs.accommodationCost);
    document.getElementById('mealPlanCost').textContent = formatter.format(costs.mealPlanCost);
    document.getElementById('transportationCost').textContent = formatter.format(costs.transportationCost);
    document.getElementById('activitiesCost').textContent = formatter.format(costs.activitiesCost);
    document.getElementById('taxCost').textContent = formatter.format(costs.taxCost);
    document.getElementById('totalCost').textContent = formatter.format(costs.totalCost);
    document.getElementById('perPersonCost').textContent = formatter.format(costs.perPersonCost);
}

// Initialize the calculator when the page loads
window.addEventListener('load', function() {
    // Set default values if needed
    document.getElementById('adultCount').value = 8;
    document.getElementById('childCount').value = 0;
    document.getElementById('youngChildCount').value = 0;
    
    // Initial calculation
    updateCosts();
});

// Add event listeners for all inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateCosts);
    });
});