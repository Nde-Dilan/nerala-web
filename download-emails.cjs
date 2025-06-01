// Run this script periodically to sync Formspree data to CSV

const fs = require('fs');

// Download your submissions from Formspree dashboard and place in submissions.json
const submissions = require('./submissions.json');

// Process submissions and create CSV
const csvHeader = 'Email,Timestamp,Source\n';
const csvRows = submissions.map(submission => 
  `${submission.email},${submission._date},exit-intent`
).join('\n');

const csvContent = csvHeader + csvRows;

fs.writeFileSync('email-subscribers.csv', csvContent);
console.log('CSV file updated successfully!');