import React, {Component} from 'react';
import './App.css';

import {Parser} from 'html-to-react';

import answers from './data/answers';
import assignment from './data/assignment';
import questions from './data/questions';

class App extends Component {

    constructor(props) {
        super(props);

        this.htmlToReactParser = new Parser;

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
        // const canvasCourseId = "506631";
        // const canvasUserId = "230427";
        // const canvasAssignmentId = "5344657";
        // const canvasSubmissionId = "15758667";  // = quiz submission id

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
                <h2>Assignment Description</h2>
                {this.htmlToReactParser.parse(this.state.assignment.description)}
            </div>
        );
    }

    renderQuestionsAnswers() {
        return this.state.questions.map((question) => {
            const renderedQuestion = this.htmlToReactParser.parse(question.question_text);
            const answer = this.state.answers.filter(answer => answer.question_id === question.id)[0];
            const renderedAnswer = this.htmlToReactParser.parse(answer.text);
            return (
                <div className="boxed">
                    <h2>{question.question_name}</h2>
                    <div>{renderedQuestion}</div>
                    <h3>Your answer:</h3>
                    <div>{renderedAnswer}</div>
                </div>

            );
        });
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
