require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cron = require('node-cron')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { mongoose } = require("mongoose");
const fs = require('fs');
const pdf = require('html-pdf');
const { Tabletojson } = require('tabletojson');
const path = require('path');
const { createCanvas } = require('canvas');
const PDFDocument = require('pdfkit');
const app = express();
const budgetRoute=require('./routes/budgetRoute')
const calendarRoute=require('./routes/calenderRoute')
const categorizationRoute=require('./routes/categorizationRoute')
const dashboardRoute=require('./routes/dashboardRoute')
const expenseRoute=require('./routes/expenseRoute')
const incomeRoute=require('./routes/incomeRoute')
const reimbursementRoute=require('./routes/reimbursementRoute')
const reportRoute=require('./routes/reportRoute')
const userRoute=require('./routes/userRoute')
const user=require('./models/user')
const expense=require('./models/expense')
const income=require('./models/income')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'))
mongoose
  .connect("mongodb://localhost:27017/temp")
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });


app.use(budgetRoute)
app.use(calendarRoute)
app.use(categorizationRoute)
app.use(dashboardRoute)
app.use(expenseRoute)
app.use(incomeRoute)
app.use(reimbursementRoute)
app.use(reportRoute)
app.use(userRoute)


//monthly report
cron.schedule('55 23 28-31 * *',async function() { 
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
if(tomorrowDate.getDate() === 1){
  console.log("hello")
  try {

    let i=await user.find();
    i=i.map((obj)=>({id:obj._id,email:obj.email}))
    let expenses,incomes, categorization
    let TotalExpense=0
    let TotalIncome=0
    i.forEach(async(value)=>{

        
          expenses = await expense.aggregate([
            {
              $match:{
                $expr:{
                  $and: [
                    { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
                    { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
                  ],
               
                },
                userid:value.id
                  
               },
                
      
              },
        
            {
              $sort:{
                Date:-1
              }
            },
           
          ]);
    
          // console.log(expenses)
          expenses=expenses.map((obj)=>({Category:obj.Category,Description:obj.Description,Date:obj.Date,Amount:obj.Amount,Merchant:obj.Merchant,PaidBy:obj.PaidBy,PaymentMode:obj.PaymentMode}))
        
          // console.log("ex",expenses)
    
         incomes = await income.aggregate([
            {
              $match:{
                $expr:{
                  $and: [
                    { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
                    { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
                  ],
               
                },
                userid:value.id
                  
               },
                
      
              },
        
            {
              $sort:{
                Date:-1
              }
            },
          
           
          ]);
    
          incomes=incomes.map((obj)=>({Source:obj.SourceOfIncome,Date:obj.Date,Amount:obj.Amount}))
          
          // console.log("in",incomes)
    
          
          expenses.forEach((obj)=>{
            TotalExpense=TotalExpense+obj.Amount
          
          })
    
          incomes.forEach((obj)=>{
            TotalIncome=TotalIncome+obj.Amount
          })


           categorization = await expense.aggregate([
            {
              $match:{
                $expr:{
                  $and: [
                    { $eq: [{ $month: "$Date" }, new Date().getMonth()+1] },
                    { $eq: [{ $year: "$Date" }, new Date().getFullYear()] },
                  ],
               
                },
                userid:value.id
                  
               },
                
      
            },
            {
              $group:{
                _id:'$Category',
                TotalExpense:{$sum:'$Amount'}
              }
            },
        
            {
              $sort:{
               TotalExpense:1
              }
            },
          
           
          ]);


          // console.log("categorization",categorization)

          const exhtml = `<table>
          <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Merchant</th>
              <th>PaidBy</th>
              <th>PaymentMode</th>
          </tr>` + 
          expenses.map((obj) => {
              return `
                  <tr>
                      <td>${obj.Category}</td>
                      <td>${obj.Description}</td>
                      <td>${obj.Date}</td>
                      <td>${obj.Amount}</td>
                      <td>${obj.Merchant}</td>
                      <td>${obj.PaidBy}</td>
                      <td>${obj.PaymentMode}</td>
                  </tr>
              `;
          }).join('') +
          `</table>`;

          const inhtml= `  <table>
          <tr>
            <th>Source Of Income</th>
       
            <th>Date</th>
            <th>Amount</th>
           
          </tr>`+
          incomes.map((obj)=>{
            return `
            <tr>
            <td>${obj.Source}</td>
            <td>${obj.Date}</td>
            <td>${obj.Amount}</td>
            </tr>`
            
          }).join('')+
        `</table>`

          const header=` <div>
          <h5>TotalIncome : `+TotalIncome+`</h5>
          <h5>TotalExpense : `+TotalExpense+`</h5>
         </div>`
          
        // Parse HTML table to JSON
    const extableJson = Tabletojson.convert(exhtml);
    const intableJson =Tabletojson.convert(inhtml)
          // console.log("tablejson",tableJson)

    // Convert JSON to HTML table string
    const extableHtml = `
        <table border="1">
            <tr>
                <th>${Object.keys(extableJson[0][0]).join('</th><th>')}</th>
            </tr>
            ${extableJson[0].map(row => `<tr><td>${Object.values(row).join('</td><td>')}</td>`).join('</tr>')}
        </table>
    `;
    const intableHtml = `
    <table border="1">
        <tr>
            <th>${Object.keys(intableJson[0][0]).join('</th><th>')}</th>
        </tr>
        ${intableJson[0].map(row => `<tr><td>${Object.values(row).join('</td><td>')}</td>`).join('</tr>')}
    </table>
`;
    
    // console.log("tablehtml",tableHtml)

    // Options for PDF generation
    const options = {
        format: 'Letter',
        orientation: 'portrait'
    };

    // Generate PDF
    const exfilename='C:/backup2/expense_tracker/userreports/'+value.id+'expense.pdf'
    const infilename='C:/backup2/expense_tracker/userreports/'+value.id+'income.pdf'
    pdf.create(extableHtml, options).toFile(exfilename, function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
   
    pdf.create(intableHtml, options).toFile(infilename, function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });


    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    const data = categorization.map((obj)=>obj.TotalExpense);
    const colors = ['red', 'blue', 'yellow','pink','purple','orange'];
    const labels=categorization.map((obj)=>obj._id)
    console.log("labels",categorization)
    const total = data.reduce((acc, val) => acc + val, 0);
    let startAngle = 0;

    for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i] / total) * Math.PI * 2;

        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 150, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        startAngle += sliceAngle;
    }

  const pdfDoc = new PDFDocument({ autoFirstPage: false });

    const outputPath = path.join('C:/backup2/expense_tracker/', 'userreports'); // Specify the folder path
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
    const chartfilename=value.id+'chart.pdf'
    const filePath = path.join(outputPath, chartfilename);
    const stream = fs.createWriteStream(filePath);
    pdfDoc.pipe(stream);

    const buffer = canvas.toBuffer();

    pdfDoc.addPage({ size: [canvas.width, canvas.height] });
    pdfDoc.image(buffer,0, 30, { width: canvas.width, height: canvas.height });

    // Add legend
    const legendX = 20; // X coordinate of the legend
    let legendY = 20; // Initial Y coordinate of the legend
    const legendSpacing = 20; // Spacing between legend items

    pdfDoc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    pdfDoc.text('Legend:', legendX, legendY);

    for (let i = 0; i < labels.length; i++) {
        legendY += legendSpacing;
        pdfDoc.fillColor(colors[i]).text(labels[i], legendX + 20, legendY);
    }

    pdfDoc.end();

    const attachments = [
      {
        filename: 'expense.pdf',
        path: exfilename,
        contentType: 'application/pdf'
      },
      {
        filename: 'income.pdf',
        path: infilename,
        contentType: 'application/pdf'
      },
      {
        filename:'categorization.pdf',
        path: 'C:/backup2/expense_tracker/userreports/'+chartfilename,
        contentType: 'application.pdf'
      }
      
    ];

      transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to:value.email ,
        subject: "ExpenseForge : "+month[new Date().getMonth()]+" "+new Date().getFullYear() + " Report",
        html:header,
        attachments: attachments
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    })
   

  } catch (error) {
   console.log(error)
  }
}
   
  }); 
  
const month=['January','February','March','April','May','June','July','August','September','October','November','December']

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
app.listen(1011);