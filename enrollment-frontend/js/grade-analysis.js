/**
 * Grade Analysis Module for School Enrollment System
 * This module provides functions to analyze student performance data and generate insights
 */

// Define the grade scales and their numeric equivalents
const gradeScales = {
    letter: {
        'A+': 97,
        'A': 93,
        'A-': 90,
        'B+': 87,
        'B': 83,
        'B-': 80,
        'C+': 77,
        'C': 73,
        'C-': 70,
        'D+': 67,
        'D': 63,
        'D-': 60,
        'F': 0
    },
    numeric: {
        '1.00': 95,
        '1.25': 92,
        '1.50': 89,
        '1.75': 86,
        '2.00': 83,
        '2.25': 80,
        '2.50': 77,
        '2.75': 74,
        '3.00': 71,
        '3.50': 68,
        '4.00': 65,
        '5.00': 0
    }
};

/**
 * Generate performance analytics for a course's grade data
 * @param {Object} courseData - The course data containing student grades
 * @return {Object} Analytics object with various performance metrics
 */
function generateCourseAnalytics(courseData) {
    if (!courseData || !courseData.students || courseData.students.length === 0) {
        console.error('Invalid course data provided for analysis');
        return null;
    }

    const componentKeys = ['assignments', 'quizzes', 'midterm', 'finals'];
    const analytics = {
        studentCount: courseData.students.length,
        components: {},
        overall: {
            average: 0,
            highest: 0,
            lowest: 100,
            medianScore: 0,
            passingRate: 0,
            gradeDistribution: {
                outstanding: 0,
                excellent: 0,
                verySatisfactory: 0,
                satisfactory: 0,
                fair: 0,
                poor: 0
            }
        }
    };

    // Calculate analytics for each grading component
    componentKeys.forEach(component => {
        const scores = courseData.students
            .map(student => student[component])
            .filter(score => score !== null && score !== undefined);
        
        if (scores.length === 0) return;
        
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const avg = sum / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        
        // Sort scores for median calculation
        scores.sort((a, b) => a - b);
        const median = scores.length % 2 === 0 
            ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2 
            : scores[Math.floor(scores.length / 2)];
        
        analytics.components[component] = {
            average: avg,
            highest: highest,
            lowest: lowest,
            median: median,
            standardDeviation: calculateStandardDeviation(scores, avg),
            passRate: scores.filter(score => score >= 60).length / scores.length * 100
        };
    });

    // Calculate overall student performance
    const overallScores = [];
    courseData.students.forEach(student => {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        // Calculate weighted score based on component weights
        componentKeys.forEach(component => {
            if (student[component] !== null && student[component] !== undefined) {
                const weight = courseData.gradingComponents[component] || 0;
                totalWeightedScore += student[component] * weight;
                totalWeight += weight;
            }
        });
        
        // Only include students who have grades for all components or have a final grade
        if (totalWeight > 0) {
            const finalScore = totalWeightedScore / totalWeight;
            overallScores.push(finalScore);
            
            // Update grade distribution
            if (finalScore >= 90) analytics.overall.gradeDistribution.outstanding++;
            else if (finalScore >= 85) analytics.overall.gradeDistribution.excellent++;
            else if (finalScore >= 80) analytics.overall.gradeDistribution.verySatisfactory++;
            else if (finalScore >= 75) analytics.overall.gradeDistribution.satisfactory++;
            else if (finalScore >= 60) analytics.overall.gradeDistribution.fair++;
            else analytics.overall.gradeDistribution.poor++;
        }
    });
    
    if (overallScores.length > 0) {
        overallScores.sort((a, b) => a - b);
        analytics.overall.average = overallScores.reduce((acc, score) => acc + score, 0) / overallScores.length;
        analytics.overall.highest = Math.max(...overallScores);
        analytics.overall.lowest = Math.min(...overallScores);
        analytics.overall.medianScore = overallScores.length % 2 === 0 
            ? (overallScores[overallScores.length / 2 - 1] + overallScores[overallScores.length / 2]) / 2 
            : overallScores[Math.floor(overallScores.length / 2)];
        analytics.overall.passingRate = overallScores.filter(score => score >= 60).length / overallScores.length * 100;
    }
    
    return analytics;
}

/**
 * Calculate the standard deviation of a set of scores
 * @param {Array} scores - Array of numeric scores
 * @param {Number} mean - Mean value of the scores
 * @return {Number} Standard deviation
 */
function calculateStandardDeviation(scores, mean) {
    if (scores.length <= 1) return 0;
    
    const squaredDifferences = scores.map(score => Math.pow(score - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / scores.length;
    return Math.sqrt(variance);
}

/**
 * Generate individual student performance report with analytics and recommendations
 * @param {Object} studentData - The student's grade data
 * @param {Object} courseData - The course data for context
 * @return {Object} Student report with analytics and recommendations
 */
function generateStudentReport(studentData, courseData) {
    if (!studentData || !courseData) {
        console.error('Invalid student or course data provided');
        return null;
    }
    
    const componentKeys = ['assignments', 'quizzes', 'midterm', 'finals'];
    const classAverages = {};
    const report = {
        studentId: studentData.studentId,
        studentName: studentData.studentName,
        courseName: courseData.courseName,
        components: {},
        overallGrade: 0,
        letterGrade: '',
        numericGrade: '',
        status: studentData.status || 'unknown',
        strengths: [],
        areasForImprovement: [],
        recommendations: [],
        performanceTrend: 'steady'
    };
    
    // Calculate class averages for comparison
    componentKeys.forEach(component => {
        const scores = courseData.students
            .map(student => student[component])
            .filter(score => score !== null && score !== undefined);
        
        if (scores.length > 0) {
            classAverages[component] = scores.reduce((acc, score) => acc + score, 0) / scores.length;
        }
    });
    
    // Analyze each component for the student
    let overallWeight = 0;
    let weightedTotal = 0;
    
    componentKeys.forEach(component => {
        if (studentData[component] !== null && studentData[component] !== undefined) {
            const score = studentData[component];
            const classAvg = classAverages[component] || 0;
            const weight = courseData.gradingComponents[component] || 0;
            
            const componentAnalysis = {
                score: score,
                classAverage: classAvg,
                weight: weight * 100,
                percentageOfClassAverage: classAvg > 0 ? (score / classAvg) * 100 : 100,
                performance: score >= 90 ? 'Excellent' :
                            score >= 80 ? 'Very Good' :
                            score >= 70 ? 'Good' :
                            score >= 60 ? 'Satisfactory' : 'Needs Improvement'
            };
            
            report.components[component] = componentAnalysis;
            
            // Track for overall calculation
            weightedTotal += score * weight;
            overallWeight += weight;
            
            // Identify strengths and areas for improvement
            if (score >= classAvg + 5) {
                report.strengths.push(component);
            } else if (score <= classAvg - 5) {
                report.areasForImprovement.push(component);
            }
        }
    });
    
    // Calculate overall grade
    if (overallWeight > 0) {
        report.overallGrade = weightedTotal / overallWeight;
        
        // Assign letter and numeric grades
        if (report.overallGrade >= 97) {
            report.letterGrade = 'A+';
            report.numericGrade = '1.00';
        } else if (report.overallGrade >= 93) {
            report.letterGrade = 'A';
            report.numericGrade = '1.00';
        } else if (report.overallGrade >= 90) {
            report.letterGrade = 'A-';
            report.numericGrade = '1.25';
        } else if (report.overallGrade >= 87) {
            report.letterGrade = 'B+';
            report.numericGrade = '1.50';
        } else if (report.overallGrade >= 83) {
            report.letterGrade = 'B';
            report.numericGrade = '1.75';
        } else if (report.overallGrade >= 80) {
            report.letterGrade = 'B-';
            report.numericGrade = '2.00';
        } else if (report.overallGrade >= 77) {
            report.letterGrade = 'C+';
            report.numericGrade = '2.25';
        } else if (report.overallGrade >= 73) {
            report.letterGrade = 'C';
            report.numericGrade = '2.50';
        } else if (report.overallGrade >= 70) {
            report.letterGrade = 'C-';
            report.numericGrade = '2.75';
        } else if (report.overallGrade >= 67) {
            report.letterGrade = 'D+';
            report.numericGrade = '3.00';
        } else if (report.overallGrade >= 63) {
            report.letterGrade = 'D';
            report.numericGrade = '3.50';
        } else if (report.overallGrade >= 60) {
            report.letterGrade = 'D-';
            report.numericGrade = '4.00';
        } else {
            report.letterGrade = 'F';
            report.numericGrade = '5.00';
        }
    }
    
    // Generate recommendations based on performance
    if (report.areasForImprovement.includes('finals')) {
        report.recommendations.push('Consider review sessions focusing on final exam material');
    }
    
    if (report.areasForImprovement.includes('midterm')) {
        report.recommendations.push('Recommend additional practice with midterm-type questions');
    }
    
    if (report.areasForImprovement.includes('assignments')) {
        report.recommendations.push('Provide more hands-on exercises and practical examples');
    }
    
    if (report.areasForImprovement.includes('quizzes')) {
        report.recommendations.push('Suggest regular study intervals and concept reviews');
    }
    
    // If student is failing, add stronger recommendations
    if (report.status === 'failing') {
        report.recommendations.push('Schedule a one-on-one session to discuss strategies for improvement');
        report.recommendations.push('Provide access to additional learning resources and tutorials');
    }
    
    // Analyze performance trend if history is available
    if (studentData.history && studentData.history.length > 0) {
        const sortedHistory = [...studentData.history].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp));
        
        const earlyScores = [];
        const lateScores = [];
        
        // Calculate early and late averages for components
        componentKeys.forEach(component => {
            const earlyEntries = sortedHistory.slice(0, Math.ceil(sortedHistory.length / 2));
            const lateEntries = sortedHistory.slice(Math.ceil(sortedHistory.length / 2));
            
            const earlyValue = earlyEntries
                .map(entry => entry[component])
                .filter(score => score !== null && score !== undefined);
                
            const lateValue = lateEntries
                .map(entry => entry[component])
                .filter(score => score !== null && score !== undefined);
            
            if (earlyValue.length > 0) {
                earlyScores.push(earlyValue.reduce((acc, score) => acc + score, 0) / earlyValue.length);
            }
            
            if (lateValue.length > 0) {
                lateScores.push(lateValue.reduce((acc, score) => acc + score, 0) / lateValue.length);
            }
        });
        
        // Calculate average of early and late scores
        const earlyAvg = earlyScores.length > 0 
            ? earlyScores.reduce((acc, score) => acc + score, 0) / earlyScores.length 
            : 0;
            
        const lateAvg = lateScores.length > 0 
            ? lateScores.reduce((acc, score) => acc + score, 0) / lateScores.length 
            : 0;
        
        // Determine trend
        if (lateAvg > earlyAvg + 3) {
            report.performanceTrend = 'improving';
        } else if (lateAvg < earlyAvg - 3) {
            report.performanceTrend = 'declining';
            report.recommendations.push('Address the declining performance trend with targeted interventions');
        }
    }
    
    return report;
}

/**
 * Convert raw score to letter or numeric grade based on selected scale
 * @param {Number} score - Raw score (0-100)
 * @param {String} scale - Scale type ('letter' or 'numeric')
 * @return {String} The converted grade in the specified scale
 */
function convertScoreToGrade(score, scale = 'letter') {
    if (score === null || score === undefined) return 'N/A';
    
    const scaleSystem = gradeScales[scale];
    if (!scaleSystem) return 'Invalid scale';
    
    // Find the appropriate grade for the score
    const grades = Object.keys(scaleSystem);
    for (let i = 0; i < grades.length; i++) {
        if (score >= scaleSystem[grades[i]]) {
            return grades[i];
        }
    }
    
    return scale === 'letter' ? 'F' : '5.00';
}

/**
 * Generate class ranking based on overall performance
 * @param {Object} courseData - The course data containing student grades
 * @return {Array} Sorted array of students with rank information
 */
function generateClassRanking(courseData) {
    if (!courseData || !courseData.students || courseData.students.length === 0) {
        return [];
    }
    
    const componentKeys = ['assignments', 'quizzes', 'midterm', 'finals'];
    const studentRankings = [];
    
    // Calculate overall weighted score for each student
    courseData.students.forEach(student => {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        componentKeys.forEach(component => {
            if (student[component] !== null && student[component] !== undefined) {
                const weight = courseData.gradingComponents[component] || 0;
                totalWeightedScore += student[component] * weight;
                totalWeight += weight;
            }
        });
        
        const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
        
        studentRankings.push({
            studentId: student.studentId,
            studentName: student.studentName,
            overallScore: overallScore,
            letterGrade: convertScoreToGrade(overallScore, 'letter'),
            numericGrade: convertScoreToGrade(overallScore, 'numeric'),
            status: student.status
        });
    });
    
    // Sort by overall score in descending order
    studentRankings.sort((a, b) => b.overallScore - a.overallScore);
    
    // Assign ranks (handle ties by giving same rank)
    let currentRank = 1;
    for (let i = 0; i < studentRankings.length; i++) {
        if (i > 0 && studentRankings[i].overallScore < studentRankings[i-1].overallScore) {
            currentRank = i + 1;
        }
        studentRankings[i].rank = currentRank;
        
        // Add percentile (top X%)
        studentRankings[i].percentile = Math.round(
            (1 - (currentRank - 1) / studentRankings.length) * 100
        );
    }
    
    return studentRankings;
}

/**
 * Identify students who need additional support based on performance
 * @param {Object} courseData - The course data containing student grades
 * @param {Number} threshold - Score threshold below which students need support
 * @return {Array} Array of at-risk students with specific areas for improvement
 */
function identifyAtRiskStudents(courseData, threshold = 70) {
    if (!courseData || !courseData.students || courseData.students.length === 0) {
        return [];
    }
    
    const componentKeys = ['assignments', 'quizzes', 'midterm', 'finals'];
    const atRiskStudents = [];
    
    courseData.students.forEach(student => {
        const weakAreas = [];
        let overallAtRisk = false;
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        // Check each component
        componentKeys.forEach(component => {
            if (student[component] !== null && student[component] !== undefined) {
                const weight = courseData.gradingComponents[component] || 0;
                totalWeightedScore += student[component] * weight;
                totalWeight += weight;
                
                if (student[component] < threshold) {
                    weakAreas.push({
                        component: component,
                        score: student[component],
                        gap: threshold - student[component]
                    });
                }
            }
        });
        
        // Calculate overall score
        const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
        if (overallScore < threshold) {
            overallAtRisk = true;
        }
        
        // If student is at risk overall or in specific areas, add to list
        if (overallAtRisk || weakAreas.length > 0) {
            atRiskStudents.push({
                studentId: student.studentId,
                studentName: student.studentName,
                overallScore: overallScore,
                overallAtRisk: overallAtRisk,
                weakAreas: weakAreas,
                status: student.status
            });
        }
    });
    
    // Sort by overall score ascending (most at-risk first)
    atRiskStudents.sort((a, b) => a.overallScore - b.overallScore);
    
    return atRiskStudents;
}

// Export all functions for use in other modules
window.GradeAnalysis = {
    generateCourseAnalytics,
    generateStudentReport,
    convertScoreToGrade,
    generateClassRanking,
    identifyAtRiskStudents,
    gradeScales
};
