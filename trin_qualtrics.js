/**
 * choose-and-solve_qualtrics.js
 * Kyoung Whan Choe (https://github.com/kywch/)
 
MIT License

Copyright (c) 2021 Kyoung Whan Choe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
 
**/

Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* PLEASE CHECK:
        TO RUN THIS SCRIPT PROPERLY, THE EMBEDDED VARIABLES
        
            points, bonus
            easy_math_cnt, easy_acc_math, easy_RT_math 
            easy_word_cnt, easy_acc_word, easy_RT_word
            hard_math_cnt, hard_level_math, hard_acc_math, hard_RT_math 
            hard_word_cnt, hard_level_word, hard_acc_word, hard_RT_word
            hcp_h2e2_math, hcp_h3e2_math, hcp_h4e2_math, hcp_h5e2_math, hcp_h6e2_math, hcp_h456e2_math
            hcp_h2e2_word, hcp_h3e2_word, hcp_h4e2_word, hcp_h5e2_word, hcp_h6e2_word, hcp_h456e2_word
            cnt_per_cond

        MUST BE DEFINED.
    */

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and loading required resources */
    // `requiredResources` must include all the required JS files
    var task_github = "https://yingshixzz.github.io/TRIN/jspsych/"; // https://<your-github-username>.github.io/<your-experiment-name>
    var requiredResources = [
        task_github + 'dist/jspsych.js',
        task_github + "dist/plugin-html-button-response.js",
        task_github + "dist/plugin-html-keyboard-response.js",
        task_github + "dist/plugin-image-keyboard-response.js",
        task_github + "dist/plugin-preload.js",
        task_github + "data/practice_problems.js",
        task_github + "data/trin_main.js"
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

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 3: Wrapping jsPsych.init() in a function */
    function initExp() {
        var jsPsych = initJsPsych({
            on_finish: function() {
                jsPsych.data.displayData();
            }
        });
    
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
                "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>"+
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
    
        /*start experiment*/
        jsPsych.run(timeline);

        // // finishing up
        // function sleep(time) {
        //     return new Promise((resolve) => setTimeout(resolve, time));
        // }

        // sleep(500).then(() => {
        //     // clear the stage
        //     jQuery('.display_stage').remove();
        //     jQuery('.display_stage_background').remove();

        //     // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
        //     qthis.clickNextButton();
        // });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
