// Global variables
let locations = [];

// Load locations when the page loads
$(document).ready(function() {
    // Get locations from the server
    $.get("/get_location_names", function(data) {
        locations = data.locations;
        let uiLocations = document.getElementById("uiLocations");
        locations.forEach(function(location) {
            let option = document.createElement("option");
            option.value = location;
            option.text = location;
            uiLocations.add(option);
        });
    });
});

// Function to handle the estimate price button click
function onClickedEstimatePrice() {
    // Get values from the form
    let sqft = document.getElementById("uiSqft").value;
    let bhk = $('input[name="uiBHK"]:checked').val();
    let parking = $('input[name="uiParking"]:checked').val();
    let location = document.getElementById("uiLocations").value;

    // Validate inputs
    if (sqft === "" || bhk === "" || parking === "" || location === "") {
        alert("Please fill all the fields");
        return;
    }

    // Make the API call to get the estimated price
    $.ajax({
        url: "/predict_home_price",
        type: "POST",
        data: {
            total_sqft: parseFloat(sqft),
            bhk: parseInt(bhk),
            parking: parseInt(parking),
            location: location
        },
        success: function(data) {
            // Display the estimated price
            document.getElementById("uiEstimatedPrice").innerHTML = 
                "<h2>Estimated Price: ₹" + data.estimated_price + " Lakhs</h2>";
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error("Error:", error);
            document.getElementById("uiEstimatedPrice").innerHTML = 
                "<h2>Error: Could not estimate price. Please try again.</h2>";
        }
    });
}