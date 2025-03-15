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
                <h3>Why I built this site</h3>
                <p>
                    I created Calc It as a way to apply and refine my frontend development skills while building something practical. This site serves as a collection of intuitive, user-friendly calculators and conversion tools, designed to help users quickly solve everyday problems.
                </p>
                <p>
                    Throughout this project, I've been working extensively with React, a library I was introduced to during my UI/UX course in Fall 2024. While I had some prior experience, developing this site from the ground up has allowed me to explore more advanced concepts, improve my design thinking, and push my problem-solving abilities.
                </p>
                <h3>What's next?</h3>
                <p>
                    As I continue improving Calc It, I plan to:
                </p>
                <ul>
                    <li>Expand the collection of calculators to include more advanced tools</li>
                    <li>Enhance the user experience and ease of use through quality of life changes</li>
                    <li>Fine-tune edge cases, error handling, and documentation</li>
                </ul>
                <div className='sep-line'/>
                <h2>My Favorite Calculator: Trackulator</h2>
                <p>In addition to being a developer, I'm also a track & field athlete with a passion for statistical analysis. Over the years, I've competed in 35 different official events, and I've always been obsessed with understanding how good I am at each one and how I compare to others.</p>
                <p>In track & field, interdisciplinary performances are measured differently—running events are measured in time, field events are measured in distance, and multi events are measured through a combination of factors. The Trackulator normalizes these performances into a single scoring system, making it easy to compare across different events.</p>
                <p>The Trackulator's scoring system is derived from the World Athletics scoring tables, which are used in official track & field competitions to quantify performance across different disciplines. Using these tables, we can derive polynomial regression equations to calculate marks to scores on-the-fly, a cheaper solution than storing or retrieving data from large datasets.</p>
                <p>Trackulator is an early-stage prototype for a project I am working on, called TrackIQ.</p>
                
                <h3>What is TrackIQ?</h3>
                <p>TrackIQ is my vision for a comprehensive track & field database, where athletes, coaches, and recruiters can:</p>
                <ul>
                    <li>Analyze performances through detailed data visualizations</li>
                    <li>Compare event scores across different disciplines</li>
                    <li>Evaluate an athlete's competitiveness in a structured and meaningful way</li>
                </ul>
                <p>The goal of TrackIQ is to provide a standardized way to measure and compare performances across multiple disciplines—helping athletes track their progress and giving recruiters a clearer picture of their potential.</p>
                <p>For now, the Trackulator serves as a small prototype of this concept, allowing users to convert track event performances into standardized scores. You can check out a spreadsheet-based prototype of TrackIQ's scoring system and event comparison tools <a href='https://docs.google.com/spreadsheets/d/1qvsESRmMjkgauiZsJGV35qB3cKYou9ULY-QRF-HYLxE/edit?usp=sharing'>here</a>.</p>
            </div>
            <BottomMenu/>
        </div>
    );
}

export default About;