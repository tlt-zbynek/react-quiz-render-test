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

async function logJson() {
    const canvasCourseId = 509953; //506631;
    const canvasUserId = 289546;//230427;
    const canvasAssignmentId = 5477002; //5344657;

    try {
        console.log("getting description...\n");
        // GET /api/v1/courses/:course_id/assignments/assignment_id
        const canvasAssignment = JSON.parse(await request.get(buildOptions(CANVAS_DOMAIN + "/api/v1/courses/" + canvasCourseId + "/assignments/" + canvasAssignmentId)));
        const canvasAssignmentInfo = { name: canvasAssignment.name, description: canvasAssignment.description };
        console.log(JSON.stringify(canvasAssignmentInfo), "\n\n\n\n");

        console.log("getting questions...\n");
        // get quiz id first
        const canvasQuizId = canvasAssignment.quiz_id;
        //GET /api/v1/courses/:course_id/quizzes/:quiz_id/questions
        const canvasQuizQuestions = JSON.parse(await request.get(buildOptions(CANVAS_DOMAIN + "/api/v1/courses/" + canvasCourseId + "/quizzes/" + canvasQuizId + "/questions")));
        console.log(JSON.stringify(canvasQuizQuestions), "\n\n\n\n");
        // not sufficiant to build the question

        console.log("getting answers...\n");
        // get answers per questions
        const submissionHistory = JSON.parse(await request.get(buildOptions(CANVAS_DOMAIN + "/api/v1/courses/" + canvasCourseId + "/assignments/" + canvasAssignmentId + "/submissions/" + canvasUserId + "?include[]=submission_history"))).submission_history;
        console.log("submissionHistory.length: ", submissionHistory.length);
        // keep one with the highest score
        const highestScoreSubmission = submissionHistory.reduce((higherScoreSubmission, submission) => (submission.score > higherScoreSubmission.score ? submission : higherScoreSubmission));
        const submissionData = highestScoreSubmission.submission_data;
        console.log(JSON.stringify(submissionData), "\n\n\n\n");
    } catch (err) {
        console.log(err);
    }
}

