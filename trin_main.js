var task_github = "https://yingshixzz.github.io/TRIN/"; // https://<your-github-username>.github.io/<your-experiment-name>
var requiredResources = [
    task_github + "jspsych/dist/jquery.min.js",
    task_github + "jspsych/dist/jspsych.js",
    task_github + "jspsych/dist/plugin-html-button-response.js",
    task_github + "jspsych/dist/plugin-html-keyboard-response.js",
    task_github + "jspsych/dist/plugin-image-keyboard-response.js",
    task_github + "jspsych/dist/plugin-preload.js",
    task_github + "jspsych/data/practice_problems.js",
];

function loadScript(idx) {
    console.log("Loading ", requiredResources[idx]);
    jQuery.getScript(requiredResources[idx], function () {
        if ((idx + 1) < requiredResources.length) {
            loadScript(idx + 1);
        } else {
            initExp();
        }
    });
}

/* experiment parameters */
var reps_per_trial_type = 4;

/*set up welcome block*/
var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome to the experiment. Press any key to begin."
};

/*set up instructions block*/
var veh_info = practice_problems[0];
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>In this task, you will see the vehicle information, like the example below.</p>"+
        "<div class='vehicle-table'><table><tr><th>Property</th><th>Value</th></tr><tr><td>Make</td><td>"+
        veh_info.make + "</td></tr><tr><td>Body</td><td>" + veh_info.body + 
        "</td></tr><tr><td>Age</td><td>" + veh_info.age + 
        "</td></tr><tr><td>Gross Vehice Weight Rating</td><td>" + veh_info.weight + 
        "</td></tr><tr><td>Region</td><td>" + veh_info.region + 
        "</td></tr><tr><td>Odometer</td><td>" + veh_info.odometer + 
        "</td></tr><tr><td>Brake Location</td><td>" + veh_info.location +
        "</td></tr><tr><td>Average Mileage Driven Per Year</td><td>" + veh_info.mileage + 
        "</td></tr><tr><td>Brake Pad Thickness</td><td>" + veh_info.thickness +
        "</td></tr></table></div>"+
        "<p>Click on the inspection decision you want to implement.</p>"+
        "<p>Click the the decision Yes to begin.</p>",
    post_trial_gap: 1000
};

/*set up experiment structure*/
var timeline = [];
timeline.push(welcome);
timeline.push(instructions);

for (var ii = 0; ii < practice_problems.length; ii++) {
    var veh_info = practice_problems[ii];
    var veh_info_table = "<div class='vehicle-table'><table><tr><th>Property</th><th>Value</th></tr><tr><td>Make</td><td>"+
                veh_info.make + "</td></tr><tr><td>Body</td><td>" + veh_info.body + 
                "</td></tr><tr><td>Age</td><td>" + veh_info.age + 
                "</td></tr><tr><td>Gross Vehice Weight Rating</td><td>" + veh_info.weight + 
                "</td></tr><tr><td>Region</td><td>" + veh_info.region + 
                "</td></tr><tr><td>Odometer</td><td>" + veh_info.odometer + 
                "</td></tr><tr><td>Brake Location</td><td>" + veh_info.location +
                "</td></tr><tr><td>Average Mileage Driven Per Year</td><td>" + veh_info.mileage + 
                "</td></tr><tr><td>Brake Pad Thickness</td><td>" + veh_info.thickness +
                "</td></tr></table></div>";
    var trial = {
        type: jsPsychHtmlButtonResponse,
        stimulus: veh_info_table,
        choices: ['No inspection','Brake', 'Tire', 'Lighting'],
        post_trial_gap: 2000,   //ITI duration
        prompt: '<p>Select the one match your decision-making.</p>',
        save_trial_parameters: {
        // save the randomly-selected button order and ITI value to the trial data
        choices: true,
        post_trial_gap: true
        },
        on_finish: function(data) {
            // determine which button was pressed, based on the response (button index: 0 or 1) and choices array (randomized order of button labels)
            data.response_button_label = data.choices[data.response];
        }   
    };
    timeline.push(trial);
};