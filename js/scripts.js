// Constants for pricing
const PRICES = {
    accommodation: {
        brisas_base: 7650,
        brisas_full: 10650,
        fantastica_base: 11700,
        fantastica_full: 14700,
        saltwater_base: 11700,
        saltwater_full: 14700
    },
    extraBedroom: 750,
    extraGuest: 325,
    mealPlan: {
        basic: 300,      // per adult per week
        premium: 375,    // per adult per week
        child: 150       // per child (6-12) per week
    },
    transportation: {
        airport: {
            small: {     // 1-5 people
                base: 215
            },
            medium: {    // 6-9 people
                6: 225,
                7: 235,
                8: 245,
                9: 260
            },
            large: 400,  // 10-17 people
            hotelPickup: 45
        },
        van: {
            large: {
                full: 400,
                half: 225
            },
            small: {
                full: 300,
                half: 175
            },
            hourly: 40
        }
    },
    activities: {
        rafting: 115,
        tubing: 110,
        zipline: 95,
        catamaran: {
            adult: 85,
            child: 55,
            young: 10
        },
        surf: 90,
        paddleboard: 69,
        waterfall: 100,
        horseback: {
            adult: 75,
            child: 75,
            young: 0  // free under 4
        },
        chocolate: 125
    },
    tax: 0.13,
    damageFee: 100
};

// Utility function to format currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Calculate airport transfer cost based on group size
function calculateAirportTransferCost(totalPeople) {
    const transfer = PRICES.transportation.airport;
    let cost = 0;

    if (totalPeople <= 5) {
        cost = transfer.small.base;
    } else if (totalPeople <= 9) {
        cost = transfer.medium[totalPeople] || transfer.medium[9];
    } else if (totalPeople <= 17) {
        cost = transfer.large;
    } else {
        // For 18+ people, need two vehicles
        cost = transfer.large * 2;
    }

    return cost * 2; // Round trip
}

// Main calculation function
function updateCosts() {
    // Get all input values
    const accommodation = document.getElementById('accommodation').value;
    const extraBedrooms = parseInt(document.getElementById('extraBedrooms').value) || 0;
    const adults = parseInt(document.getElementById('adultCount').value) || 0;
    const children = parseInt(document.getElementById('childCount').value) || 0;
    const youngChildren = parseInt(document.getElementById('youngChildCount').value) || 0;
    const totalPeople = adults + children + youngChildren;

    // 1. Calculate Accommodation Costs
    let accommodationCost = PRICES.accommodation[accommodation];
    const extraBedroomCost = extraBedrooms * PRICES.extraBedroom;
    
    // Calculate extra guest costs (beyond 20 people)
    let extraGuestCost = 0;
    if (totalPeople > 20) {
        extraGuestCost = (totalPeople - 20) * PRICES.extraGuest;
    }

    // 2. Calculate Meal Plan Costs
    const mealPlan = document.getElementById('mealPlan').value;
    let mealPlanCost = 0;
    if (mealPlan !== 'none') {
        mealPlanCost = (adults * PRICES.mealPlan[mealPlan]) + 
                       (children * PRICES.mealPlan.child);
        // Young children eat free
    }

    // 3. Calculate Transportation Costs
    let transportationCost = 0;
    
    // Airport transfers
    if (document.getElementById('airportTransfer').checked) {
        transportationCost += calculateAirportTransferCost(totalPeople);
        
        // Add hotel pickup if selected
        if (document.getElementById('hotelPickup').checked) {
            transportationCost += PRICES.transportation.airport.hotelPickup * 2; // Round trip
        }
    }

    // Local van service
    const fullDaysLarge = parseInt(document.getElementById('fullDayLarge').value) || 0;
    const halfDaysLarge = parseInt(document.getElementById('halfDayLarge').value) || 0;
    const hourlyService = parseInt(document.getElementById('hourlyService').value) || 0;

    transportationCost += (fullDaysLarge * PRICES.transportation.van.large.full) +
                         (halfDaysLarge * PRICES.transportation.van.large.half) +
                         (hourlyService * PRICES.transportation.van.hourly);

    // 4. Calculate Activities Costs
    let activitiesCost = 0;

    // Adventure activities
    if (document.getElementById('rafting').checked) {
        activitiesCost += PRICES.activities.rafting * adults;
        activitiesCost += PRICES.activities.rafting * children;
    }
    if (document.getElementById('tubing').checked) {
        activitiesCost += PRICES.activities.tubing * adults;
        activitiesCost += PRICES.activities.tubing * children;
    }
    if (document.getElementById('zipline').checked) {
        activitiesCost += PRICES.activities.zipline * adults;
        activitiesCost += PRICES.activities.zipline * children;
    }

    // Water activities
    if (document.getElementById('catamaran').checked) {
        activitiesCost += PRICES.activities.catamaran.adult * adults;
        activitiesCost += PRICES.activities.catamaran.child * children;
        activitiesCost += PRICES.activities.catamaran.young * youngChildren;
    }
    if (document.getElementById('surf').checked) {
        activitiesCost += PRICES.activities.surf * adults;
        activitiesCost += PRICES.activities.surf * children;
    }
    if (document.getElementById('paddleboard').checked) {
        activitiesCost += PRICES.activities.paddleboard * adults;
        activitiesCost += PRICES.activities.paddleboard * children;
    }

    // Nature & Culture
    if (document.getElementById('waterfall').checked) {
        activitiesCost += PRICES.activities.waterfall * adults;
        activitiesCost += PRICES.activities.waterfall * children;
    }
    if (document.getElementById('horseback').checked) {
        activitiesCost += PRICES.activities.horseback.adult * adults;
        activitiesCost += PRICES.activities.horseback.child * children;
        // Young children ride free
    }
    if (document.getElementById('chocolate').checked) {
        activitiesCost += PRICES.activities.chocolate * adults;
        activitiesCost += PRICES.activities.chocolate * children;
    }

    // 5. Calculate Tax and Total
    const subtotal = accommodationCost + extraBedroomCost + extraGuestCost + 
                    mealPlanCost + transportationCost + activitiesCost;
    const tax = subtotal * PRICES.tax;
    const total = subtotal + tax + PRICES.damageFee;
    const perPersonCost = adults > 0 ? total / adults : 0;

    // Update display
    document.getElementById('accommodationCost').textContent = formatCurrency(accommodationCost);
    document.getElementById('bedroomCost').textContent = formatCurrency(extraBedroomCost);
    document.getElementById('extraGuestCost').textContent = formatCurrency(extraGuestCost);
    document.getElementById('mealPlanCost').textContent = formatCurrency(mealPlanCost);
    document.getElementById('transportationCost').textContent = formatCurrency(transportationCost);
    document.getElementById('activitiesCost').textContent = formatCurrency(activitiesCost);
    document.getElementById('taxCost').textContent = formatCurrency(tax);
    document.getElementById('damageFee').textContent = formatCurrency(PRICES.damageFee);
    document.getElementById('totalCost').textContent = formatCurrency(total);
    document.getElementById('perPersonCost').textContent = formatCurrency(perPersonCost);
}

// Initialize calculations on page load
window.addEventListener('load', function() {
    updateCosts();
    
    // Add event listeners to all form elements
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateCosts);
        input.addEventListener('input', updateCosts);
    });
});
// Add this to your existing scripts.js
function toggleDetails(elementId) {
    const content = document.getElementById(elementId);
    const button = content.previousElementSibling;
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        button.innerHTML = 'See More Details ▼';
    } else {
        content.classList.add('show');
        button.innerHTML = 'Hide Details ▲';
    }
}