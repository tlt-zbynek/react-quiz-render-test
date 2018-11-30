const request = require('request-promise');

const canvasCourseId = 506631;
const canvasUserId = 230427;
const canvasAssignmentId = 5344657;
const canvasSubmissionId = 15758667;  // = quiz submission id

function buildOptions(url) {
    return {
        url: url,
        headers: {
            'Authorization': 'Bearer yourtoken'
        }
    };
}
const CANVAS_DOMAIN = "https://yourdomain";

async function fetchData() {
    console.log("getting description...\n\n\n\n");
    const canvasAssignmentDescription = JSON.parse(await request.get(buildOptions(CANVAS_DOMAIN + "/api/v1/courses/" + canvasCourseId + "/assignments/" + canvasAssignmentId))).description;
//console.log(canvasAssignmentDescription, "\n\n\n\n");

    console.log("getting questions...\n\n\n\n");
    const canvasQuizQuestions = JSON.parse(await request.get(buildOptions(CANVAS_DOMAIN + "/api/v1/quiz_submissions/" + canvasSubmissionId + "/questions"))).quiz_submission_questions;
// console.log(JSON.stringify(canvasQuizQuestions), "\n\n\n\n");

    console.log("getting answers...\n\n\n\n");
// get answers per questions
    const submissionHistory = JSON.parse(await request.get(buildOptions(CANVAS_DOMAIN + "/api/v1/courses/" + canvasCourseId + "/assignments/" + canvasAssignmentId + "/submissions/" + canvasUserId + "?include[]=submission_history"))).submission_history;
    const answersPerQuestions = submissionHistory.filter(submission => {
        console.log(typeof submission.id);
        console.log(typeof canvasSubmissionId);
        console.log(submission.id === canvasSubmissionId);
        return submission.id === canvasSubmissionId;
    })[0].submission_data;
    console.log(JSON.stringify(answersPerQuestions), "\n\n\n\n");
}

