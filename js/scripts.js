// Constants for pricing
const PRICES = {
    accommodation: {
        brisas_base: 7650,
        brisas_full: 10650,
		brisas_26: 12600,
        fantastica_base: 11700,
        fantastica_full: 14700,
        saltwater_base: 11700,
        saltwater_full: 14700
    },
    extraBedroom: 750,
    extraGuest: 325,
    mealPlan: {
        basic: 300, // per adult per week
        premium: 375, // per adult per week
        child: 150 // per child (6-12) per week
    },
    transportation: {
        airport: {
            small: { base: 215 }, // 1-5 people
            medium: { 6: 225, 7: 235, 8: 245, 9: 260 }, // 6-9 people
            large: 400, // 10-17 people
            hotelPickup: 45
        },
        van: {
            large: { full: 400, half: 225 },
            small: { full: 300, half: 175 },
            hourly: 40
        }
    },
    activities: {
        adventure: {
            rafting: { private: { chorro: 125, savegre: 125, naranjo: 115 }, public: { chorro: 115, savegre: 125, naranjo: 105 } },
            tubing: 110,
            zipline: { low: 85, high: 105 },
            atv: { single: 110, double: 140, combo: { single: 170, double: 270 } },
            horseback: { adult: 75, young: 0 } // Free under 4
        },
        water: {
            catamaran: { public: { adult: 85, child: 55, young: 10 }, private: "ASK" },
            surf: { standard: 90, no_frills: 55 },
            paddleboard: 69,
            parasailing: { single: 100, double: 155, triple: 210 },
            jet_ski: { single: 130, double: 160 }
        },
        nature: {
            waterfall: { half_day: 100, full_day: 130, off_beaten_path: 130 },
            hanging_bridges: { private: 125, public: 95 },
            reto_mae_hike: 45,
            nauyaca_waterfall: 130,
            damas_mangrove: { day: 75, night: 85 },
            manuel_antonio_park: { adult: 55, child: 45, young: 0 } // Free under 2
        },
        cultural: {
            chocolate_workshop: 125,
            jungle_yoga: 125,
            spice_tasting: 60,
            village_hike: 125,
            buggy_tour: { buggy: 170, deposit: 30 }
        },
        family_friendly: {
            surf_camp: 70,
            beach_concierge: 20,
            babysitting: { low: 20, high: 25 },
            massages: "ASK"
        }
    },
    tax: 0.13,
    damageFee: { low: 100, high: 120 }
};

// Utility function to format currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calculate airport transfer cost based on group size
function calculateAirportTransferCost(totalPeople) {
    const transfer = PRICES.transportation.airport;
    if (totalPeople <= 5) return transfer.small.base * 2; // Round trip
    if (totalPeople <= 9) return transfer.medium[totalPeople] * 2; // Round trip
    if (totalPeople <= 17) return transfer.large * 2; // Round trip
    return transfer.large * 4; // For 18+ people, need two vehicles (round trip)
}

// Main calculation function
function updateCosts() {
    const accommodation = document.getElementById('accommodation').value;
    const extraBedrooms = parseInt(document.getElementById('extraBedrooms').value) || 0;
    const adults = parseInt(document.getElementById('adultCount').value) || 0;
    const children = parseInt(document.getElementById('childCount').value) || 0;
    const youngChildren = parseInt(document.getElementById('youngChildCount').value) || 0;
    const totalPeople = adults + children + youngChildren;

    // 1. Calculate Accommodation Costs
    const accommodationCost = PRICES.accommodation[accommodation];
    const extraBedroomCost = extraBedrooms * PRICES.extraBedroom;
    const extraGuestCost = totalPeople > 20 ? (totalPeople - 20) * PRICES.extraGuest : 0;

    // 2. Calculate Meal Plan Costs
    const mealPlan = document.getElementById('mealPlan').value;
    const mealPlanCost = mealPlan !== 'none' ? (adults * PRICES.mealPlan[mealPlan] + children * PRICES.mealPlan.child) : 0;

    // 3. Calculate Transportation Costs
    let transportationCost = 0;
    if (document.getElementById('airportTransfer').checked) {
        transportationCost += calculateAirportTransferCost(totalPeople);
        if (document.getElementById('hotelPickup').checked) transportationCost += PRICES.transportation.airport.hotelPickup * 2;
    }
    const fullDaysLarge = parseInt(document.getElementById('fullDayLarge').value) || 0;
    const halfDaysLarge = parseInt(document.getElementById('halfDayLarge').value) || 0;
    const hourlyService = parseInt(document.getElementById('hourlyService').value) || 0;
    transportationCost += fullDaysLarge * PRICES.transportation.van.large.full + halfDaysLarge * PRICES.transportation.van.large.half + hourlyService * PRICES.transportation.van.hourly;

	let activitiesCost = 0;

	document.querySelectorAll('.activity-checkbox').forEach(activity => {
		if (activity.checked) {
			const pricePerAdult = parseFloat(activity.dataset.priceAdult) || 0;
			const pricePerChild = parseFloat(activity.dataset.priceChild) || 0;
			const pricePerYoungChild = parseFloat(activity.dataset.priceYoung) || 0;

			activitiesCost += (pricePerAdult * adults) +
							  (pricePerChild * children) +
							  (pricePerYoungChild * youngChildren);
		}
	});

    // 5. Calculate Tax and Total
    const subtotal = accommodationCost + extraBedroomCost + extraGuestCost + mealPlanCost + transportationCost + activitiesCost;
    const tax = subtotal * PRICES.tax;
    const total = subtotal + tax + PRICES.damageFee.low; // Using low damage fee
    const perPersonCost = adults > 0 ? total / adults : 0;

    // Update display
    document.getElementById('accommodationCost').textContent = formatCurrency(accommodationCost);
    document.getElementById('bedroomCost').textContent = formatCurrency(extraBedroomCost);
    document.getElementById('extraGuestCost').textContent = formatCurrency(extraGuestCost);
    document.getElementById('mealPlanCost').textContent = formatCurrency(mealPlanCost);
    document.getElementById('transportationCost').textContent = formatCurrency(transportationCost);
    document.getElementById('activitiesCost').textContent = formatCurrency(activitiesCost);
    document.getElementById('taxCost').textContent = formatCurrency(tax);
    document.getElementById('damageFee').textContent = formatCurrency(PRICES.damageFee.low);
    document.getElementById('totalCost').textContent = formatCurrency(total);
    document.getElementById('perPersonCost').textContent = formatCurrency(perPersonCost);
}

// Initialize calculations and attach event listeners
window.addEventListener('load', function () {
    updateCosts();
    document.querySelectorAll('input, select').forEach(input => input.addEventListener('change', updateCosts));
});

// Function to toggle details display
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
