import React from 'react'
import './About.css';
import TopMenu from './menus/TopMenu'
import BottomMenu from './menus/BottomMenu'

function About() {
    return (
        <div id='about-container'>
            <TopMenu/>
            <div id='about-content'>
                <h1>About</h1>
                <div className='sep-line'/>
                <h2>Welcome to Calc It!</h2>
                <p>
                    Hi, I'm Thomas Dougherty, a senior at the University of Wisconsin-Madison, majoring in Computer Science. I'll be graduating in May 2024, and this project is a culmination of my passion for programming, problem-solving, and web development.
                </p>
                <h2>Why I built this site</h2>
                <p>
                    I created Calc It as a way to apply and refine my frontend development skills while building something practical. This site serves as a collection of intuitive, user-friendly calculators and conversion tools, designed to help users quickly solve everyday problems. Throughout this project, I've been working extensively with React, a framework I was introduced to during my UI/UX course in Fall 2024. While I had some prior experience, developing this site from the ground up has allowed me to explore more advanced concepts, improve my design thinking, and push my problem-solving abilities.
                </p>
                <h2>What's next?</h2>
                <p>
                    As I continue improving Calc It, I plan to:
                </p>
                <ul>
                    <li>Expand the collection of calculators to include more advanced tools</li>
                    <li>Enhance the user experience and ease of use through quality of life changes</li>
                    <li>Fine-tune edge cases, error handling, and documentation</li>
                </ul>
            </div>
            <BottomMenu/>
        </div>
    );
}

export default About;