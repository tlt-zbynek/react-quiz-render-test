import React, {Component} from 'react';
import './App.css';

import {Parser} from 'html-to-react';

import answers from './data/answers';
import assignment from './data/assignment';
import questions from './data/questions';

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

    renderByQuestionType(question){
        const renderedQuestionText = this.htmlToReactParser.parse(question.question_text);
        //console.log("this.state.answers: ", this.state.answers);
        const studentAnswer = this.state.answers.reduce((studentAnswer, answer) => {
            console.log(question.id);
            // console.log(answer.question_id);
            return (answer.question_id === question.id ? answer : studentAnswer);
        }, null);
        if (!studentAnswer)
            throw new Error("Error: couldn't match student answer to a question!");

        let mappedAnswers = null;
        switch (question.question_type) {
            case this.QUESTION_TYPES.MULTIPLE_CHOICE_QUESTION:

                mappedAnswers = question.answers.map(possibleAnswer => {
                    const answer = studentAnswer.answer_id === possibleAnswer.id ? "Student Answered: " + possibleAnswer.text : possibleAnswer.text;
                    const answerCorrected = possibleAnswer.weight === 100 ? answer + " <-- Correct!" : answer;
                    return (
                        <div>{answerCorrected}</div>
                    );
                });
                // TODO:
                break;
            case this.QUESTION_TYPES.TEXT_ONLY_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.FILE_UPLOAD_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.ESSAY_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.CALCULATED_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.NUMERICAL_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.MATCHING_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.MULTIPLE_DROPDOWNS_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.MULTIPLE_ANSWERS_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.FILL_IN_MULTIPLE_BLANKS_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.SHORT_ANSWER_QUESTION:
                // TODO:
                break;
            case this.QUESTION_TYPES.TRUE_FALSE_QUESTION:
                // TODO:
                break;
            default:
            // not found show generic rendering
                return (
                    <div>To Do:</div>
                );
        }

        return (
            <div className="boxed">
                <h2>{question.question_name}</h2>
                <div>{renderedQuestionText}</div>
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
