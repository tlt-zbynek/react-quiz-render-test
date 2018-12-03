import React, {Component} from 'react';
import './App.css';

import {Parser} from 'html-to-react';

// import answers from './data/answers';
// import assignment from './data/assignment';
// import questions from './data/questions';
// Canvas rendered: https://utah.instructure.com/courses/509953/quizzes/1307989/history?quiz_submission_id=15486344&version=4&headless=1

import answers from './data/answers_essay';
import assignment from './data/assignment_essay';
import questions from './data/questions_essay';
// Canvas rendered: https://utah.test.instructure.com/courses/506631/quizzes/1280005/history?quiz_submission_id=15758667&headless=1&version=1

class App extends Component {

    htmlToReactParser = new Parser();

    QUESTION_TYPES = {
        MULTIPLE_CHOICE_QUESTION: "multiple_choice_question",
        TEXT_ONLY_QUESTION: "text_only_question",
        FILE_UPLOAD_QUESTION: "file_upload_question",
        ESSAY_QUESTION: "essay_question",
        CALCULATED_QUESTION: "calculated_question",
        NUMERICAL_QUESTION: "numerical_question",
        MATCHING_QUESTION: "matching_question",
        MULTIPLE_DROPDOWNS_QUESTION: "multiple_dropdowns_question",
        MULTIPLE_ANSWERS_QUESTION: "multiple_answers_question",
        FILL_IN_MULTIPLE_BLANKS_QUESTION: "fill_in_multiple_blanks_question",
        SHORT_ANSWER_QUESTION: "short_answer_question",
        TRUE_FALSE_QUESTION: "true_false_question"
    };

    constructor(props) {
        super(props);

        this.state = {
            assignment: {},
            questions: [],
            answers: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        console.log("fetching data...");

        try {
            this.setState({
                assignment,
                questions,
                answers
            });

        } catch (err) {
            console.log(err);
        }
    }

    renderDescription() {
        return (
            <div>
                <h1>{this.state.assignment.name}</h1>
                <hr/>
                <h2>Assignment Description</h2>
                {this.htmlToReactParser.parse(this.state.assignment.description)}
            </div>
        );
    }

    renderByQuestionType(question) {
        const studentAnswer = this.state.answers.reduce((studentAnswer, answer) => (answer.question_id === question.id ? answer : studentAnswer), null);
        if (!studentAnswer)
            throw new Error("Error: couldn't match student answer to a question!");

        let mappedAnswers = null;
        switch (question.question_type) {
            case this.QUESTION_TYPES.MULTIPLE_CHOICE_QUESTION:
            case this.QUESTION_TYPES.TRUE_FALSE_QUESTION:
            case this.QUESTION_TYPES.SHORT_ANSWER_QUESTION:
                mappedAnswers = question.answers.map(possibleAnswer => {
                    const answer = studentAnswer.answer_id === possibleAnswer.id ? possibleAnswer.text + " <b>&lt;-- Student Answered</b>" : possibleAnswer.text;
                    const answerCorrected = possibleAnswer.weight === 100 ? "Correct! --> " + answer : "-----------&gt; " + answer;
                    const answerRendered = this.htmlToReactParser.parse(answerCorrected);
                    return (
                        <div>{answerRendered}</div>
                    );
                });
                break;

            case this.QUESTION_TYPES.FILE_UPLOAD_QUESTION:
                const attachmentIds = studentAnswer.attachment_ids.map(attachmentId => <li>{attachmentId}</li>);
                mappedAnswers = (
                    <div>
                        <b>Student uploaded file ids:</b>
                        <ul>{attachmentIds}</ul>
                    </div>
                );
                break;

            case this.QUESTION_TYPES.ESSAY_QUESTION:
                const renderedAnswer = this.htmlToReactParser.parse(studentAnswer.text);
                mappedAnswers = (
                    <div>
                        <b>Student answered:</b>
                        <div>{renderedAnswer}</div>
                    </div>
                );
                break;

            case this.QUESTION_TYPES.CALCULATED_QUESTION:
                // TODO:
                // console.log("studentAnswer: ", JSON.stringify(studentAnswer));
                // console.log("question: ", JSON.stringify(question));
                break;

            case this.QUESTION_TYPES.NUMERICAL_QUESTION:
                // TODO:
                // console.log("studentAnswer: ", JSON.stringify(studentAnswer));
                // console.log("question: ", JSON.stringify(question));
                break;

            case this.QUESTION_TYPES.MATCHING_QUESTION:
                const renderedPossibleMatches = (
                    <ul>
                        {question.matches.map(match => <li>{match.text}</li>)}
                    </ul>
                );

                const answersRendered = question.answers.map(possibleAnswer => {
                    const studentAnswerIdKey = "answer_" + possibleAnswer.id;
                    const studentRightMatchId = parseInt(studentAnswer[studentAnswerIdKey]);
                    const studentRightMatchText = studentRightMatchId ? question.matches.filter(match => studentRightMatchId === match.match_id)[0].text : null;
                    const answerCorrected = (studentRightMatchId === possibleAnswer.match_id ?
                        <td>{studentRightMatchText} <b>&lt;-- Correct!</b></td> :
                        <td>{studentRightMatchText} <b>&lt;-- Incorrect!</b></td>);
                    return (
                        <tr>
                            <td>{possibleAnswer.left}</td>
                            <td>{possibleAnswer.right}</td>
                            {answerCorrected}
                        </tr>
                    );
                });

                mappedAnswers = (
                    <div>
                        <h3>All possible right matches:</h3>
                        <div>{renderedPossibleMatches}</div>
                        <h3>Result:</h3>
                        <table>
                            <tr>
                                <th>Left</th>
                                <th>Right</th>
                                <th>Student Match</th>
                            </tr>
                            {answersRendered}
                        </table>
                    </div>
                );
                break;

            case this.QUESTION_TYPES.MULTIPLE_DROPDOWNS_QUESTION:
            case this.QUESTION_TYPES.FILL_IN_MULTIPLE_BLANKS_QUESTION:
                mappedAnswers = question.answers.map(possibleAnswer => {
                    const blankName = " for [" + possibleAnswer.blank_id + "]";
                    const studentAnswerIdKey = "answer_id_for_" + possibleAnswer.blank_id;
                    const answer = (studentAnswer[studentAnswerIdKey] === possibleAnswer.id) ? (possibleAnswer.text + blankName + " <b>&lt;-- Student Answered</b>") : (possibleAnswer.text) + blankName;
                    const answerCorrected = (possibleAnswer.weight === 100 ? "Correct! --> " + answer : "-----------&gt; " + answer);
                    const answerRendered = this.htmlToReactParser.parse(answerCorrected);
                    return (
                        <div>{answerRendered}</div>
                    );
                });
                break;

            case this.QUESTION_TYPES.MULTIPLE_ANSWERS_QUESTION:
                mappedAnswers = question.answers.map(possibleAnswer => {
                    const studentAnswerIdKey = "answer_" + possibleAnswer.id;
                    const answer = (studentAnswer[studentAnswerIdKey] && studentAnswer[studentAnswerIdKey] === "1") ? (possibleAnswer.text + " <b>&lt;-- Student Answered</b>") : (possibleAnswer.text);
                    const answerCorrected = (possibleAnswer.weight === 100 ? "Correct! --> " + answer : "-----------&gt; " + answer);
                    const answerRendered = this.htmlToReactParser.parse(answerCorrected);
                    return (
                        <div>{answerRendered}</div>
                    );
                });
                break;

            case this.QUESTION_TYPES.TEXT_ONLY_QUESTION:
                // do nothing, this will render question text only
                mappedAnswers = null;
                break;

            default:
                // not found show generic rendering
                console.log("QUESTION NOT FOUND!");
                console.log("studentAnswer: ", JSON.stringify(studentAnswer));
                console.log("question: ", JSON.stringify(question));
                mappedAnswers = (
                    <div>To Do:</div>
                );
        }

        const questionTextRendered = this.htmlToReactParser.parse(question.question_text);
        const questionTypeRendered = question.question_type.replace(/_/g, " ");
        return (
            <div className="boxed">
                <h2>{question.question_name} <br/>({questionTypeRendered})</h2>
                <div>{questionTextRendered}</div>
                <div>{mappedAnswers}</div>
            </div>
        );

    }

    renderQuestionsAnswers() {
        return this.state.questions.map(question => this.renderByQuestionType(question));
    }

    render() {
        return (
            <div className="App">
                <div>{this.renderDescription()}</div>
                <div>{this.renderQuestionsAnswers()}</div>
            </div>
        );
    }
}

export default App;
